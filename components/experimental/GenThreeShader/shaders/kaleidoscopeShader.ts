export const kaleidoscopeShader = `
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
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = vUv;

    // Enhanced kaleidoscopic effect with variable segments
    vec2 kaleidoUv = uv - 0.5;
    float angle = atan(kaleidoUv.y, kaleidoUv.x);
    float radius = length(kaleidoUv);
    angle = mod(angle * kaleidoSegments, 3.14159 * 2.0);
    kaleidoUv = vec2(cos(angle), sin(angle)) * radius + 0.5;

    // Time-based animation controlled by motion speed
    float animTime = time * motionSpeed;

    // Scale-controlled noise layers
    float n1 = snoise(kaleidoUv * noiseScale * patternScale + animTime * 0.2);
    float n2 = snoise(kaleidoUv * (noiseScale * 1.4 * patternScale) - animTime * 0.15);
    float n3 = snoise(kaleidoUv * (noiseScale * 2.1 * patternScale) + animTime * 0.1);
    float n4 = snoise(uv * (noiseScale * 3.5 * patternScale) - animTime * 0.08);

    // Dynamic diffusion based on warp intensity
    float diffusion = snoise((kaleidoUv + sin(animTime * 0.5) * warpIntensity) * noiseScale);

    float finalNoise = (
        n1 * 0.4 +
        n2 * 0.3 +
        n3 * 0.2 +
        n4 * 0.1
    );

    // Warping controlled by warp intensity
    finalNoise = mix(finalNoise, diffusion, warpIntensity * sin(animTime * 0.5));

    // Color generation with intensity control
    vec3 color1 = vec3(
        0.5 + 0.5 * sin(animTime + finalNoise * 5.0),
        0.5 + 0.5 * sin(animTime * 0.85 + finalNoise * 6.0 + 2.0),
        0.5 + 0.5 * sin(animTime * 0.7 + finalNoise * 7.0 + 4.0)
    );

    // Enhanced color mixing with intensity control
    vec3 colorMix = mix(
        vec3(0.5),
        color1,
        colorIntensity
    );

    // Final color composition
    vec3 finalColor = colorMix * (0.8 + 0.2 * finalNoise);

    // Interactive highlight
    float highlight = 0.15 / (length(uv - mouse) + 0.2);
    finalColor += vec3(highlight * 0.3) * colorIntensity;

    gl_FragColor = vec4(finalColor, 1.0);
}
`;
