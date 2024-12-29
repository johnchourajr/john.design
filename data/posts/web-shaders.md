---
template: "shader"
slug: "/journal/web-shaders"
date: "2024-12-27"
title: "Getting Creative with GLSL Shaders"
cover: /journal-images/web-shaders/shader.jpg
thumb: /journal-images/web-shaders/shader.**jpg**
hidden: true
tags:
  - Dev
---

## For some time now, I’ve wanted to explore shaders.

> What is a shader?
> A program that runs on your GPU rather than your CPU. Shaders create those mesmerizing visual effects you see in modern video games and interactive websites by manipulating pixels in real-time.

## Obstacle

The main challenge in my journey with shaders has been the GLSL language itself. While it shares some similarities with JavaScript, it's more akin to older programming languages and trickier to grasp. Thankfully, with the emergence of AI tools like GPTs and Copilot, this world has become much more approachable.

So over this wonderful holiday break, I decided to dive into this space.

## The Prompt

> Help me write a simple distortion shader, where I pass in an image, and the cursor controls the distortion.

Simple enough, but with some trial and error (LLMs aren't perfect), I achieved my result. Surprisingly, one of the toughest challenges was handling varying aspect ratios of images.

[shader sandbox]

## Going Further

But I didn't stop there—I wanted to make this more portable and reusable for future projects, something like a component (perhaps an NPM package someday).

One amazing thing about shaders is that you can use them without any third-party libraries—it's all built into the browser with WebGL APIs and HTML. Though using something like Three.js makes composing this code much easier.

My goal was to create a simple image component that could take an asset string, a few props, some shader code, and output something amazing.

I'm happy to say I achieved just that. With this shader component, the implementation becomes really straightforward:

```tsx
// Basic usage with a simple color manipulation shader
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

<ImageThreeShader
  src="/path/to/image.jpg"
  aspectRatio="1:1"
  shaderConfig={colorShader}
/>
```

A few improvements I hope to make in the future would be creating a version without three.js, including image optimization (ideally for Next.js apps), and developing a version that works with video assets.

Cheers and enjoy. ✌️