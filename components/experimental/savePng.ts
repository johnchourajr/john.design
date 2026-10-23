/** Saves what `capture` reads back as a PNG download. */
export const savePng = async (capture: () => Promise<Blob | null>) => {
  const blob = await capture();
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `shader-${Date.now()}.png`;
  link.click();
  URL.revokeObjectURL(url);
};
