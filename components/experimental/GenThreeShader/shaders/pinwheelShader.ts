export const pinwheelShaderSettings = [
  {
    name: 'Rotation Speed',
    type: 'Slider',
    value: 1.0,
    min: 0.1,
    max: 2.0,
    step: 0.1,
    uniform: 'rotationSpeed',
  },
  {
    name: 'Vortex Strength',
    type: 'Slider',
    value: 5.0,
    min: 1.0,
    max: 10.0,
    step: 0.5,
    uniform: 'vortexStrength',
  },
  {
    name: 'Color Intensity',
    type: 'Slider',
    value: 0.7,
    min: 0.1,
    max: 1.0,
    step: 0.05,
    uniform: 'colorIntensity',
  },
];

export const pinwheelShader = `
uniform float time;
uniform vec2 mouse;
uniform float noiseScale;
uniform float rotationSpeed;
uniform float vortexStrength;
uniform float colorIntensity;

varying vec2 vUv;

void main() {
    // Center the coordinates
    vec2 uv = vUv - 0.5;
    float dist = length(uv);
    float angle = atan(uv.y, uv.x);

    // Create vortex effect
    float twist = angle + dist * vortexStrength + time * rotationSpeed;

    // Create pinwheel color pattern
    vec3 pinwheelColor = vec3(0.5) + vec3(0.5) * vec3(
        cos(twist + time),
        cos(twist + time * 0.3 + 2.0),
        cos(twist + time * 0.5 + 4.0)
    );

    // Create outer area pattern
    float outerAngle = angle * 4.0 + time * rotationSpeed * 0.5;
    vec3 outerColor = vec3(0.5) + vec3(0.5) * vec3(
        sin(outerAngle),
        sin(outerAngle + 2.0),
        sin(outerAngle + 4.0)
    );

    // Smooth transition between inner and outer areas
    float transitionStart = 0.3;
    float transitionEnd = 0.7;
    float blend = smoothstep(transitionStart, transitionEnd, dist);

    // Mix colors based on distance
    vec3 color = mix(pinwheelColor, outerColor, blend);

    // Apply color intensity and fade
    color *= colorIntensity;

    // Add mouse interaction
    float mouseDistance = length(uv - (mouse - 0.5));
    float mouseFade = 1.0 - smoothstep(0.0, 0.2, mouseDistance);
    color += vec3(mouseFade * 0.3);

    gl_FragColor = vec4(color, 1.0);
}
`;
