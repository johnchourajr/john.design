export const spiralSphereShaderSettings = [
  {
    name: 'Speed',
    type: 'Slider',
    value: 0.5,
    min: 0,
    max: 2,
    step: 0.1,
    uniform: 'speed',
  },
  {
    name: 'Density',
    type: 'Slider',
    value: 6,
    min: 1,
    max: 20,
    step: 1,
    uniform: 'density',
  },
  {
    name: 'Width',
    type: 'Slider',
    value: 0.02,
    min: 0.01,
    max: 0.1,
    step: 0.01,
    uniform: 'width',
  },
  {
    name: 'Rainbow Speed',
    type: 'Slider',
    value: 1,
    min: 0,
    max: 5,
    step: 0.1,
    uniform: 'randowSpeed',
  },
  {
    name: 'Rotation',
    type: 'Slider',
    value: 0,
    min: -Math.PI,
    max: Math.PI,
    step: 0.1,
    uniform: 'rotation',
  },
  {
    name: 'X Rotation',
    type: 'Slider',
    value: 0,
    min: -Math.PI,
    max: Math.PI,
    step: 0.1,
    uniform: 'rotationX',
  },
  {
    name: 'Y Rotation',
    type: 'Slider',
    value: 0,
    min: -Math.PI,
    max: Math.PI,
    step: 0.1,
    uniform: 'rotationY',
  },
  {
    name: 'Depth',
    type: 'Slider',
    value: 0.5,
    min: 0,
    max: 2,
    step: 0.1,
    uniform: 'depth',
  },
];

export const spiralSphereShader = `
uniform float time;
uniform vec2 resolution;
uniform float speed;
uniform float density;
uniform float width;
uniform float randowSpeed;
uniform float rotation;
uniform float rotationX;
uniform float rotationY;
uniform float depth;

#define PI 3.14159265359

mat2 rotate2D(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

vec2 rotate3D(vec2 uv, float rotX, float rotY) {
    vec3 pos = vec3(uv, depth);

    // Rotate around X axis
    float sx = sin(rotX);
    float cx = cos(rotX);
    pos.yz = mat2(cx, -sx, sx, cx) * pos.yz;

    // Rotate around Y axis
    float sy = sin(rotY);
    float cy = cos(rotY);
    pos.xz = mat2(cy, -sy, sy, cy) * pos.xz;

    return pos.xy / (1.0 + pos.z * 0.5);
}

void main() {
    vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;

    // Apply 3D rotation
    uv = rotate3D(uv, rotationX, rotationY);

    vec3 finalColor = vec3(0.0);
    float t = time * speed;

    for(float i = 0.0; i < 3.0; i++) {
        float r = length(uv);
        float theta = atan(uv.y, uv.x) + t + i * 2.0 * PI / 3.0 + rotation;

        float spiral = sin(theta * density + r * 10.0 + t);
        float circle = 1.0 - smoothstep(0.0, width, abs(r - 0.5 + 0.2 * spiral));

        // Add depth shading
        float shade = 1.0 - (r * 0.5);
        vec3 color = 0.5 + 0.5 * cos(time * randowSpeed + uv.xyx + vec3(0, 2, 4));
        finalColor += circle * color * shade;
    }

    gl_FragColor = vec4(finalColor, 1.0);
}
`;
