import { useMutation, useSelf } from '@liveblocks/react/suspense';

/**
 * Delete all the selected layers.
 */
export default function useDeleteLayers() {
  // @ts-expect-error
  const selection = useSelf((me) => me.presence.selection);
  return useMutation(
    ({ storage, setMyPresence }) => {
      // @ts-expect-error
      const liveLayers = storage.get('layers');
      // @ts-expect-error
      const liveLayerIds = storage.get('layerIds');
      for (const id of selection) {
        // Delete the layer from the layers LiveMap
        // @ts-expect-error
        liveLayers.delete(id);
        // Find the layer index in the z-index list and remove it
        // @ts-expect-error
        const index = liveLayerIds.indexOf(id);
        if (index !== -1) {
          // @ts-expect-error
          liveLayerIds.delete(index);
        }
      }
      setMyPresence({ selection: [] }, { addToHistory: true });
    },
    [selection],
  );
}
