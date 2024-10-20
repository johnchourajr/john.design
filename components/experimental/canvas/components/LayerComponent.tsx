import { useStorage } from '@liveblocks/react/suspense';
import React, { memo } from 'react';
import { CanvasMode, LayerType } from '../types';
import { colorToCss } from '../utils';
import Ellipse from './Ellipse';
import Path from './Path';
import Rectangle from './Rectangle';

type Props = {
  id: string;
  mode: CanvasMode;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
};

const LayerComponent = memo(function LayerComponent({
  mode,
  onLayerPointerDown,
  id,
  selectionColor,
}: Props) {
  type RootType = {
    layers: Map<string, any>;
  };

  // @ts-expect-error
  const layer = useStorage<RootType>((root) => root.layers.get(id));
  if (!layer) {
    return null;
  }

  const isAnimated =
    mode !== CanvasMode.Translating && mode !== CanvasMode.Resizing;

  // @ts-expect-error
  switch (layer.type) {
    case LayerType.Ellipse:
      return (
        <Ellipse
          id={id}
          // @ts-expect-error
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selectionColor={selectionColor}
        />
      );
    case LayerType.Path:
      return (
        <Path
          key={id}
          // @ts-expect-error
          points={layer.points}
          onPointerDown={(e) => onLayerPointerDown(e, id)}
          // @ts-expect-error
          x={layer.x}
          // @ts-expect-error
          y={layer.y}
          // @ts-expect-error
          fill={layer.fill ? colorToCss(layer.fill) : '#CCC'}
          stroke={selectionColor}
        />
      );
    case LayerType.Rectangle:
      return (
        <Rectangle
          id={id}
          // @ts-expect-error
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selectionColor={selectionColor}
        />
      );
    default:
      console.warn('Unknown layer type');
      return null;
  }
});

export default LayerComponent;
