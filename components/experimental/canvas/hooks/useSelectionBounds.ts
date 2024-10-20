import { shallow } from '@liveblocks/react';
import { useSelf, useStorage } from '@liveblocks/react/suspense';
import { Layer, XYWH } from '../types';

function boundingBox(layers: Layer[]): XYWH | null {
  const first = layers[0];
  if (!first) {
    return null;
  }

  let left = first.x;
  let right = first.x + first.width;
  let top = first.y;
  let bottom = first.y + first.height;

  for (let i = 1; i < layers.length; i++) {
    const { x, y, width, height } = layers[i];
    if (left > x) {
      left = x;
    }
    if (right < x + width) {
      right = x + width;
    }
    if (top > y) {
      top = y;
    }
    if (bottom < y + height) {
      bottom = y + height;
    }
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
}

export default function useSelectionBounds() {
  // @ts-expect-error
  const selection = useSelf((me) => me.presence.selection);
  return useStorage((root) => {
    const selectedLayers = selection
      // @ts-expect-error
      .map((layerId) => root.layers.get(layerId)!)
      .filter(Boolean);
    return boundingBox(selectedLayers);
  }, shallow);
}
