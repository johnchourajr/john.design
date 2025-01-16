# GenThreeShader Component

A React component that renders customizable WebGL shaders using Three.js.

## Usage

```tsx
import { GenThreeShader } from './GenThreeShader';
import { kaleidoscopeShader } from './shaders/kaleidoscopeShader';

const MyComponent = () => {
  const shaderConfig = {
    fragmentShader: kaleidoscopeShader,
    uniforms: {
      patternScale: { value: 1.0 },
      kaleidoSegments: { value: 6.0 },
      colorIntensity: { value: 0.7 },
    },
  };

  return (
    <GenThreeShader
      shaderConfig={shaderConfig}
      className="w-full h-full"
    />
  );
};
```

## Props

- `className?: string` - Optional CSS class name for the container
- `shaderConfig: ShaderConfig` - Configuration object for the shader
- `onDownload: (ref: () => void) => void` - Callback to receive the download function

### ShaderConfig Interface

```typescript
type ShaderConfig = {
  vertexShader?: string;      // Optional custom vertex shader
  fragmentShader: string;     // Required fragment shader code
  uniforms?: Record<string, THREE.IUniform>;  // Optional uniforms
};
```

## Base Uniforms

The component automatically provides these uniforms to all shaders:

- `resolution` - Screen resolution (vec2)
- `mouse` - Mouse position (vec2)
- `time` - Elapsed time (float)
- `noiseScale` - Base noise scale (float)
- `colorSpeed` - Color animation speed (float)

## Example with Custom Uniforms

```tsx
const customConfig = {
  vertexShader: `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: myCustomShader,
  uniforms: {
    customValue: { value: 1.0 },
    customColor: { value: new THREE.Color(1, 0, 0) },
  },
};
