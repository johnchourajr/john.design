export const spaceTimeShader = `
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
uniform float noiseScale;
uniform float colorSpeed;
uniform float kaleidoSegments;
uniform float patternScale;
uniform float colorIntensity;
uniform float motionSpeed;
uniform float warpIntensity;

varying vec2 vUv;

// Simplex noise function
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = vUv;
    float animTime = time * motionSpeed;

    // Create spiral coordinates
    float angle = atan(uv.y - 0.5, uv.x - 0.5);
    float dist = length(uv - 0.5);

    // Spiral warping
    float spiral = angle * kaleidoSegments + dist * 10.0 * patternScale + animTime;
    vec2 warpedUv = vec2(
        cos(spiral) * dist + 0.5,
        sin(spiral) * dist + 0.5
    );

    // Layer multiple noise patterns
    float n1 = snoise(warpedUv * noiseScale * patternScale + animTime * 0.3);
    float n2 = snoise(warpedUv * (noiseScale * 2.0 * patternScale) - animTime * 0.2);
    float n3 = snoise(uv * (noiseScale * 3.0 * patternScale) + animTime * 0.1);

    // Combine noise with warping
    float finalNoise = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2) * warpIntensity;

    // Create dynamic color pattern
    vec3 color1 = vec3(
        0.5 + 0.5 * sin(finalNoise * 3.0 + animTime),
        0.5 + 0.5 * sin(finalNoise * 4.0 + animTime * 1.2 + 2.0),
        0.5 + 0.5 * sin(finalNoise * 5.0 + animTime * 0.8 + 4.0)
    );

    // Add spiral highlights
    float highlight = 0.5 + 0.5 * sin(spiral * 0.5);
    vec3 spaceColor = mix(
        color1,
        vec3(highlight),
        0.3 * warpIntensity
    );

    // Apply color intensity
    vec3 finalColor = mix(vec3(0.5), spaceColor, colorIntensity);

    // Add mouse interaction highlight
    float mouseGlow = 0.15 / (length(uv - mouse) + 0.2);
    finalColor += vec3(mouseGlow * 0.3) * colorIntensity;

    gl_FragColor = vec4(finalColor, 1.0);
}
`;
