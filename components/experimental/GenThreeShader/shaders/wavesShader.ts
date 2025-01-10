export const wavesShader = `
precision mediump float;
uniform float time;
uniform float scale;
uniform float speed;
uniform float distortion;
uniform float colorIntensity;
uniform vec2 resolution;

vec3 hsl2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

float wave(vec2 uv, float scale, float speed, float distortion) {
    float x = uv.x;
    float y = uv.y;
    float diagonal = dot(uv, vec2(cos(x * distortion), -sin(y * distortion)));
    float wave1 = sin(diagonal * scale + time * speed + sin(x + y));
    float wave2 = cos(diagonal * scale * 0.7 + time * (speed * 0.8) + cos(x - y));
    float wave3 = sin(diagonal * scale * 1.3 + time * (speed * 1.2) + sin(x * 0.7 + y * 1.3));
    return (wave1 + wave2 + wave3) * 0.5 + 0.5;
}

void main() {
    vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;

    float w1 = wave(uv, scale * 3.0, speed * 0.5, distortion * 0.3);
    float w2 = wave(uv * 1.2, scale * 4.0, speed * -0.3, distortion * 0.5);
    float w3 = wave(uv * 0.8, scale * 5.0, speed * 0.2, distortion * 0.7);

    float waves = pow((w1 * 0.5 + w2 * 0.3 + w3 * 0.2), 2.0);
    float depth = waves * 0.7 + 0.3;

    vec3 color1 = hsl2rgb(vec3(time * 0.1, 0.5, 0.3));
    vec3 color2 = hsl2rgb(vec3(time * 0.1 + 0.33, 0.4, 0.7));
    vec3 color3 = hsl2rgb(vec3(time * 0.1 + 0.66, 0.6, 0.5));

    vec3 finalColor = mix(color1, color2, waves);
    finalColor = mix(finalColor, color3, depth);
    finalColor *= colorIntensity;

    gl_FragColor = vec4(finalColor, 1.0);
}
`;
