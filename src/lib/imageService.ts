interface CarouselImage {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

// Type definitions with better constraint validation
interface PicsumImage {
  readonly id: string;
  readonly author: string;
}

interface FetchImagesOptions {
  readonly count?: number;
  readonly width?: number;
  readonly height?: number;
}

// Result type for better error handling without try/catch
type ImageResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: string };

// Helper functions for creating results
const createSuccess = <T>(data: T): ImageResult<T> => ({
  success: true,
  data,
});

const createError = <T>(error: string): ImageResult<T> => ({
  success: false,
  error,
});

// Constants with strict typing
const DEFAULT_OPTIONS = {
  count: 20,
  width: 400,
  height: 300,
};

const CONSTRAINTS = {
  maxCount: 50,
  minCount: 1,
  maxDimension: 2000,
  minDimension: 50,
  fallbackLimit: 10,
};

const API_CONFIG = {
  baseUrl: "https://picsum.photos",
  timeout: 10000,
  cache: "default",
} satisfies {
  baseUrl: string;
  timeout: number;
  cache: RequestCache;
};

// Validation functions using functional approach
const isValidCount = (count: number): boolean =>
  Number.isInteger(count) &&
  count >= CONSTRAINTS.minCount &&
  count <= CONSTRAINTS.maxCount;

const isValidDimension = (dimension: number): boolean =>
  Number.isInteger(dimension) &&
  dimension >= CONSTRAINTS.minDimension &&
  dimension <= CONSTRAINTS.maxDimension;

const validateOptions = (
  options: FetchImagesOptions
): ImageResult<Required<FetchImagesOptions>> => {
  const normalizedOptions = { ...DEFAULT_OPTIONS, ...options };

  if (!isValidCount(normalizedOptions.count)) {
    return createError(
      `Count must be between ${CONSTRAINTS.minCount} and ${CONSTRAINTS.maxCount}`
    );
  }

  if (!isValidDimension(normalizedOptions.width)) {
    return createError(
      `Width must be between ${CONSTRAINTS.minDimension} and ${CONSTRAINTS.maxDimension}`
    );
  }

  if (!isValidDimension(normalizedOptions.height)) {
    return createError(
      `Height must be between ${CONSTRAINTS.minDimension} and ${CONSTRAINTS.maxDimension}`
    );
  }

  return createSuccess(normalizedOptions);
};

// Pure function for creating carousel images
const createCarouselImage = (
  id: string,
  author: string,
  width: number,
  height: number
): CarouselImage => ({
  id,
  url: `${API_CONFIG.baseUrl}/id/${id}/${width}/${height}`,
  alt: `Photo by ${author}`,
  width,
  height,
});

// Pure function for creating fallback images
const createFallbackImages = (
  count: number,
  width: number,
  height: number
): CarouselImage[] =>
  Array.from(
    { length: Math.min(count, CONSTRAINTS.fallbackLimit) },
    (_, index) => ({
      id: `fallback-${index}`,
      url: `${API_CONFIG.baseUrl}/${width}/${height}?random=${index}`,
      alt: `Random image ${index + 1}`,
      width,
      height,
    })
  );

// Type guard for API response validation
const isPicsumImageArray = (data: unknown): data is PicsumImage[] =>
  Array.isArray(data) &&
  data.every(
    (item): item is PicsumImage =>
      typeof item === "object" &&
      item !== null &&
      "id" in item &&
      "author" in item &&
      typeof item.id === "string" &&
      typeof item.author === "string"
  );

// Fetch with timeout using Promise.race and async/await
const fetchWithTimeout = async (
  url: string,
  options: RequestInit
): Promise<Response> => {
  const fetchPromise = fetch(url, options);
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timeout")), API_CONFIG.timeout)
  );

  return Promise.race([fetchPromise, timeoutPromise]);
};

// Helper function to safely execute async operations
const safeAsync = async <T>(
  operation: () => Promise<T>
): Promise<ImageResult<T>> => {
  const result = await operation().catch(error => ({
    isError: true,
    error: error instanceof Error ? error.message : "Unknown error",
  }));

  if (typeof result === "object" && result !== null && "isError" in result) {
    return createError(result.error);
  }

  return createSuccess(result);
};

// Main fetch function using functional error handling with async/await
const fetchImagesFromAPI = async (
  count: number,
  width: number,
  height: number
): Promise<ImageResult<CarouselImage[]>> => {
  const url = `${API_CONFIG.baseUrl}/v2/list?page=1&limit=${count}`;

  return safeAsync(async () => {
    const response = await fetchWithTimeout(url, { cache: API_CONFIG.cache });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: unknown = await response.json();

    if (!isPicsumImageArray(data)) {
      throw new Error("Invalid API response format");
    }

    return data.map(({ id, author }) =>
      createCarouselImage(id, author, width, height)
    );
  });
};

// Main export function with comprehensive error handling
export const fetchImages = async (
  options: FetchImagesOptions = {}
): Promise<CarouselImage[]> => {
  const validationResult = validateOptions(options);

  if (!validationResult.success) {
    return createFallbackImages(
      DEFAULT_OPTIONS.count,
      DEFAULT_OPTIONS.width,
      DEFAULT_OPTIONS.height
    );
  }

  const { count, width, height } = validationResult.data;

  const apiResult = await fetchImagesFromAPI(count, width, height);

  return apiResult.success
    ? apiResult.data
    : createFallbackImages(count, width, height);
};
