import dynamic from 'next/dynamic';

const DynamicJohnGLCanvas = dynamic(() =>
  import('./JohnGL').then((mod) => mod.JohnGLCanvas),
);

const DynamicFreehandCanvas = dynamic(() => import('./FreehandCanvas'));

export { DynamicFreehandCanvas, DynamicJohnGLCanvas };
