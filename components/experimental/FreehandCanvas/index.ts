import dynamic from 'next/dynamic';

export { default as FreehandCanvas } from './FreehandCanvas';

export const DynamicFreehandCanvas = dynamic(() => import('./FreehandCanvas'), {
  ssr: false,
});
