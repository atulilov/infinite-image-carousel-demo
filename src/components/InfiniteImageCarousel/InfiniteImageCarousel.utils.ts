import type { CSSProperties } from "react";

export const createContainerStyle = (
  itemWidth: number,
  itemHeight: number,
  gap: number
): CSSProperties & Record<string, string> => ({
  "--item-width": `${itemWidth}px`,
  "--item-height": `${itemHeight}px`,
  "--gap": `${gap}px`,
});

export const createItemStyle = (
  left: number,
  itemWidth: number,
  itemHeight: number
): CSSProperties => ({
  position: "absolute",
  left,
  width: itemWidth,
  height: itemHeight,
});
