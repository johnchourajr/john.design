---
template: "post"
slug: "/journal/web-shaders"
date: "2024-12-27"
title: "Super Simple Image Shader Component"
cover: /journal-images/web-shaders/shader.png
thumb: /journal-images/web-shaders/shader.png
# hidden: true
tags:
  - Dev
---

Ever wanted to add those fancy image effects you see on creative websites? You know, the ones with the smooth transitions, pixelation effects, and interactive distortions? Well, I've created a React component that makes it easy to add WebGL shader effects to your images. Meet the **ImageThreeShader** – a flexible and reusable component that combines the power of Three.js with the simplicity of React.

## What is ImageThreeShader?

ImageThreeShader is a React component that wraps Three.js functionality to apply custom shader effects to images. It handles all the complex WebGL setup, aspect ratio management, and responsive behaviors, letting you focus on the creative part – writing shaders.

## Key Features

- 🎨 Easy shader implementation
- 📐 Automatic aspect ratio handling
- 🖱️ Mouse interaction support
- ⚡ Performant WebGL rendering
- 📱 Responsive design
- ⚛️ React-friendly implementation

## How to Use It

### Basic Implementation

Here's a simple example of how to use the component with a basic color manipulation shader:

```tsx
import { ImageThreeShader } from './components/ImageThreeShader';

const colorShader = {
  fragmentShader: `
    uniform sampler2D image;
    varying vec2 vUv;
    void main() {
      vec4 color = texture2D(image, vUv);
      gl_FragColor = vec4(color.r, color.g * 0.5, color.b, color.a);
    }
  `
};

function App() {
  return (
    <ImageThreeShader
      src="/path/to/image.jpg"
      aspectRatio="16:9"
      shaderConfig={colorShader}
    />
  );
}
```

### Interactive Effects

One of the coolest features is the built-in mouse interaction. Here's an example of a pixelation effect that follows your cursor:

```glsl
uniform sampler2D image;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float dist = distance(
    vec2(uv.x * resolution.x / resolution.y, uv.y),
    vec2(mouse.x / resolution.y, mouse.y / resolution.y)
  );

  float pixelSize = smoothstep(0.0, 0.2, dist) * 0.05;
  vec2 pixelated = floor(uv / pixelSize) * pixelSize;

  gl_FragColor = texture2D(image, pixelated);
}
```

## Available Aspect Ratios

The component supports various common aspect ratios out of the box:
- 1:1 (Square)
- 16:9 (Widescreen)
- 4:3 (Standard)
- 21:9 (Ultrawide)
- 3:2 (Classic Photography)
- 9:16 (Portrait Video)
- And more...

## Advanced Features

### Custom Uniforms

You can pass additional uniforms to your shaders for more complex effects:

```tsx
const waveShader = {
  fragmentShader: `
    // ... shader code ...
  `,
  uniforms: {
    intensity: { value: 1.0 },
    frequency: { value: 2.0 }
  }
};
```

### Animation

The component automatically handles animation frames and provides a `time` uniform for creating animated effects:

```glsl
uniform float time;
// ... in your main function:
uv.x += sin(uv.y * 10.0 + time) * 0.1;
```

## Performance Considerations

The component is optimized for performance with:
- Automatic cleanup of WebGL contexts
- Proper disposal of Three.js resources
- Efficient render loop management
- Responsive resize handling

## Future Improvements

I'm constantly working on improving the component. Some planned features include:
- Transition effects between images
- More built-in shader presets
- Touch interaction support
- Custom vertex shader examples
- Performance optimizations

Feel free to contribute to the component or suggest new features! The code is available on my GitHub, and I'm always looking for ways to make it better.

## Conclusion

WebGL shaders don't have to be complicated. With ImageThreeShader, you can add professional-grade effects to your React applications with just a few lines of code. Give it a try and let your creativity flow!

Happy coding! 🚀

