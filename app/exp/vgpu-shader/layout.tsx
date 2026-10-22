import { pageMetadata } from '@/data/metadata';

export const metadata = pageMetadata({
  title: 'WebGPU Shader',
  description: 'Proof of concept: a pinwheel shader rendered with WebGPU via vgpu.',
  path: '/exp/vgpu-shader',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
