'use client';

import { getSettingValue } from '@/components/experimental/SettingsComponents';
import { useDevicePixelRatio } from '@/hooks/useDevicePixelRatio';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import clsx from 'clsx';
import { motion } from 'framer-motion-3d';
import { useRef, useState } from 'react';
import * as THREE from 'three';

function Light({ type, light, hide, ...rest }: any) {
  if (hide) return null;
  if (type === 'spotLight') {
    return <motion.spotLight animate={light as any} {...rest} />;
  } else if (type === 'pointLight') {
    return <motion.pointLight animate={light as any} {...rest} />;
  } else return null;
}

// interpolate an array of inputs into an array of outputs
function transform(value: number, input: number[], output: number[]) {
  if (value <= input[0]) return output[0];
  if (value >= input[input.length - 1]) return output[output.length - 1];
  for (let i = 0; i < input.length - 1; i++) {
    if (value >= input[i] && value <= input[i + 1]) {
      const slope = (output[i + 1] - output[i]) / (input[i + 1] - input[i]);
      return output[i] + slope * (value - input[i]);
    }
  }
}

function Mesh({
  settings,
}: {
  settings: {
    [key: string]: any;
  };
}) {
  const ref = useRef<THREE.Mesh>();
  const [alphaMap, normalMap] = useLoader(THREE.TextureLoader, [
    '/me-alpha.png',
    '/me-map.png',
  ]);

  const light_1 = getSettingValue(settings, 'Red Light', true);
  const light_3 = getSettingValue(settings, 'White Light', true);
  const metalness = getSettingValue(settings, 'Metalness', 0.5);

  const { mouse } = useThree();
  const [x, setX] = useState(3);
  const [y, setY] = useState(3);

  useFrame(() => {
    setX(mouse.x * 1);
    setY(mouse.y * 1);
  });

  const light1 = {
    x: transform(x, [-1, 1], [1, 0.5]),
    y: transform(y, [-1, 1], [-0.66, -0.4]),
    z: 0.5,
  };

  const light3 = {
    x: 0,
    y: 0,
    z: 2,
  };

  const sharedProps = {
    intensity: 500,
    distance: 10,
    penumbra: 0.5,
    angle: 0.8,
    castShadow: true,
    decay: 1,
    transition: { ease: [0.16, 1, 0.3, 1] },
  };

  const color = document.documentElement.getAttribute('data-color');
  const colorHex = new THREE.Color(color || '#ff0000');

  return (
    <motion.mesh ref={ref as any} scale={1}>
      <Light
        type={'spotLight'}
        light={light1 as any}
        color={colorHex}
        hide={!light_1}
        {...sharedProps}
      />
      <Light
        type={'pointLight'}
        light={light3 as any}
        intensity={300}
        color={16777215}
        hide={!light_3}
      />
      <motion.planeGeometry
        attach="geometry"
        args={[1, 1]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <meshStandardMaterial
        metalness={metalness}
        roughness={5}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(1, 1)}
        alphaMap={alphaMap}
        transparent
      />
    </motion.mesh>
  );
}

export const SETTINGS = [
  {
    name: 'Red Light',
    type: 'Boolean',
    value: true,
  },
  {
    name: 'White Light',
    type: 'Boolean',
    value: true,
  },
  {
    name: 'Metalness',
    type: 'Slider',
    value: 0.5,
    step: 0.01,
    min: 0,
    max: 0.5,
  },
];

export function JohnGLCanvas({
  settings,
  className,
}: {
  settings: {
    [key: string]: any;
  };
  className?: string;
}) {
  const devicePixelRatio = useDevicePixelRatio();

  return (
    <div className={clsx('absolute inset-0 z-[1]', className)}>
      <Canvas
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
        dpr={devicePixelRatio || 3}
        camera={{
          position: [0, 0, 2],
          aspect: 1,
          fov: 25,
          near: 0.1,
          far: 100,
        }}
      >
        <Mesh settings={settings} />
      </Canvas>
    </div>
  );
}
