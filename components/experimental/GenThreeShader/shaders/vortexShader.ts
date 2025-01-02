export const vortexShader = `
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

    // Create color pattern
    vec3 color = vec3(0.5) + vec3(0.5) * vec3(
        cos(twist + time),
        cos(twist + time * 0.3 + 2.0),
        cos(twist + time * 0.5 + 4.0)
    );

    // Add radial fade
    float fade = 1.0 - smoothstep(0.0, 0.5, dist);
    color *= fade * colorIntensity;

    // Add mouse interaction
    float mouseDistance = length(uv - (mouse - 0.5));
    float mouseFade = 1.0 - smoothstep(0.0, 0.2, mouseDistance);
    color += vec3(mouseFade * 0.3);

    gl_FragColor = vec4(color, 1.0);
}
`;
