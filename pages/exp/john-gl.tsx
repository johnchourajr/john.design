import * as THREE from "three";
import React, { FC, Suspense, useRef, useState } from "react";
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Noise } from "@react-three/postprocessing";

import InlineLink from "../../components/InlineLink";
import { useDevicePixelRatio } from "../../utils/hooks";
import { motion } from "framer-motion-3d";
import {
  getSettingValue,
  SettingsGroup,
} from "../../components/SettingsComponents";

function Light({ type, light, hide, ...rest }: any) {
  if (hide) return null;
  if (type === "spotLight") {
    return <motion.spotLight animate={light as any} {...rest} />;
  } else if (type === "pointLight") {
    return <motion.pointLight animate={light as any} {...rest} />;
  } else return null;
}

export const Effect: FC = () => {
  return (
    <EffectComposer>
      <Noise opacity={0.035} />
    </EffectComposer>
  );
};

function Mesh({ settings }: any) {
  const ref = useRef<THREE.Mesh>();
  const [me, memap] = useLoader(THREE.TextureLoader, [
    "/me-alpha.png",
    "/me-map.png",
  ]);

  const light_1 = getSettingValue(settings, "Light 1", true);
  const light_2 = getSettingValue(settings, "Light 2", true);
  const light_3 = getSettingValue(settings, "Light 3", true);
  const metalness = getSettingValue(settings, "Metalness", 0.5);

  // use mouse position to rotate the mesh
  const { mouse } = useThree();

  // use mouse position to move lights
  const [x, setX] = useState(3);
  const [y, setY] = useState(3);

  useFrame(() => {
    setX(mouse.x * 1);
    setY(mouse.y * 1);
  });

  const light1 = {
    x: Math.sin(-x),
    y: Math.cos(-x + y) - 0.3,
    z: 0,
  };

  const light2 = {
    x: Math.sin(x),
    y: Math.cos(x + y) - 0.3,
    z: 0,
  };

  const light3 = {
    x: 1,
    y: Math.sin(x + y) - 2,
    z: 1,
  };

  const sharedProps = {
    intensity: 10,
    distance: 100,
    penumbra: 1,
    angle: 1,
    castShadow: true,
    transition: { ease: [0.16, 1, 0.3, 1] },
  };

  return (
    <mesh ref={ref as any} scale={1}>
      <Light
        type={"spotLight"}
        light={light1 as any}
        color={0x0000ff}
        hide={!light_1}
        {...sharedProps}
      />
      <Light
        type={"spotLight"}
        light={light2 as any}
        color={0xff0000}
        hide={!light_2}
        {...sharedProps}
      />
      <Light
        type={"pointLight"}
        light={light3 as any}
        intensity={2.2}
        color={0xffffff}
        hide={!light_3}
      />
      <motion.planeGeometry attach="geometry" args={[1, 1]} />
      <meshStandardMaterial
        metalness={metalness}
        roughness={0}
        normalMap={memap}
        map={me}
      />
    </mesh>
  );
}

const SETTINGS = [
  {
    name: "Light 1",
    type: "Boolean",
    value: true,
  },
  {
    name: "Light 2",
    type: "Boolean",
    value: true,
  },
  {
    name: "Light 3",
    type: "Boolean",
    value: true,
  },
  {
    name: "Noise",
    type: "Boolean",
    value: true,
  },
  {
    name: "Metalness",
    type: "Slider",
    value: 0.5,
    step: 0.01,
    min: 0,
    max: 0.5,
  },
];

export function JohnGLCanvas({ settings }: any) {
  const devicePixelRatio = useDevicePixelRatio();

  const noise = getSettingValue(settings, "Noise", false);

  return (
    <div className="absolute inset-0 z-[0]">
      <Canvas
        style={{
          width: "100vw",
          height: "100vw",
        }}
        dpr={devicePixelRatio || 3}
        camera={{
          position: [0, 0, 2],
          aspect: 1,
          fov: 25,
          near: 0.2,
          far: 100,
        }}
      >
        <Suspense fallback={null}>
          <Mesh settings={settings} />
        </Suspense>
        {noise && <Effect />}
      </Canvas>
    </div>
  );
}

export default function JohnGL() {
  const [settings, setSettings] = React.useState(SETTINGS);

  return (
    <>
      <InlineLink href="/exp/" className="no-underline">
        <h2 className="my-8">
          &larr; <span className="underline">Back</span>
        </h2>
      </InlineLink>
      <JohnGLCanvas settings={settings} />
      <SettingsGroup settings={settings} setSettings={setSettings} />
    </>
  );
}
