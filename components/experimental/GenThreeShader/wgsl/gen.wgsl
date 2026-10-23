// The generative shaders' uniforms on WebGPU (#129), a pure module. One
// struct holds every knob any of them reads, so the settings panel's
// sliders (each names its uniform) set the same field whichever shader is
// showing. A shader reads only the fields it uses; the rest are ignored.
// Defaults are GenThreeShader's baseUniforms; knobs no shader default sets
// are 0 until a slider sets them, as on WebGL.
export struct GenParams {
  // The canvas in CSS px.
  resolution: vec2f,
  // The pointer in CSS px from the canvas's top left (undamped).
  mouse: vec2f,
  // Seconds; 0 with reduced motion.
  time: f32,
  noiseScale: f32,
  colorSpeed: f32,
  kaleidoSegments: f32,
  patternScale: f32,
  colorIntensity: f32,
  motionSpeed: f32,
  warpIntensity: f32,
  rotationSpeed: f32,
  vortexStrength: f32,
  scale: f32,
  speed: f32,
  distortion: f32,
  density: f32,
  width: f32,
  randowSpeed: f32,
  rotation: f32,
  rotationX: f32,
  rotationY: f32,
  depth: f32,
}
