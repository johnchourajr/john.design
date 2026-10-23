/**
 * The video shaders' aspect ratios, kept apart from VideoThreeShader so the
 * WebGPU path (VideoShader) can use them without loading three.js.
 */
export type AspectRatio =
  | '1:1'
  | '4:3'
  | '16:9'
  | '21:9'
  | '3:2'
  | '2:3'
  | '5:4'
  | '9:16'
  | '4:5'
  | '1200:600'
  | '2000:1327'
  | '1680:1050'
  | '1280:720';

export const aspectClass: Record<AspectRatio, string> = {
  '1:1': 'aspect-square',
  '4:3': 'aspect-4/3',
  '16:9': 'aspect-video',
  '21:9': 'aspect-21/9',
  '3:2': 'aspect-3/2',
  '2:3': 'aspect-2/3',
  '5:4': 'aspect-5/4',
  '9:16': 'aspect-9/16',
  '4:5': 'aspect-4/5',
  '1200:600': 'aspect-1200/600',
  '2000:1327': 'aspect-2000/1327',
  '1680:1050': 'aspect-1680/1050',
  '1280:720': 'aspect-1280/720',
};
