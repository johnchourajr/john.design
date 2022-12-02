import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";

import InlineLink from "../../components/InlineLink";
import { useDevicePixelRatio, useWindowSize } from "../../utils/hooks";
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

function Mesh({ settings }: any) {
  const ref = useRef<THREE.Mesh>();
  const [me, memap] = useLoader(THREE.TextureLoader, ["/me.png", "/memap.png"]);

  const light_1 = getSettingValue(settings, "Light 1") || true;
  const light_2 = getSettingValue(settings, "Light 2") || true;
  const light_3 = getSettingValue(settings, "Light 3") || true;
  const metalness = getSettingValue(settings, "Metalness") || 0.01;

  // use mouse position to rotate the mesh
  const { mouse } = useThree();

  // use mouse position to move lights
  const [x, setX] = useState(1);
  const [y, setY] = useState(1);

  useFrame(() => {
    setX(mouse.x);
    setY(mouse.y);
  });

  const light1 = {
    x: Math.sin(-x),
    y: Math.cos(-x + y),
    z: 0.2,
  };

  const light2 = {
    x: Math.sin(x),
    y: Math.cos(x + y),
    z: 0.2,
  };

  const light3 = {
    x: 0,
    y: y - 2,
    z: 1,
  };

  // console.log({
  //   light2Y: light2.y,
  //   light2X: light2.x,
  // });

  return (
    <mesh ref={ref as any} scale={1}>
      <Light
        type={"spotLight"}
        light={light1 as any}
        intensity={10}
        color={0x0000ff}
        transition={{ ease: [0.16, 1, 0.3, 1] }}
        angle={0.5}
        distance={100}
        penumbra={1}
        castShadow
        hide={!light_1}
      />
      <Light
        type={"spotLight"}
        light={light2 as any}
        intensity={10}
        color={0xff0000}
        transition={{ ease: [0.16, 1, 0.3, 1] }}
        angle={0.5}
        distance={100}
        penumbra={1}
        castShadow
        hide={!light_2}
      />
      <Light
        type={"pointLight"}
        light={light3 as any}
        intensity={0.8}
        color={0xffffff}
        hide={!light_3}
      />
      <motion.planeGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial
        metalness={metalness}
        roughness={0}
        normalMap={memap}
        map={me}
        transparent
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
    name: "Metalness",
    type: "Slider",
    value: 0.01,
    step: 0.01,
    min: 0,
    max: 0.5,
  },
];

export function JohnGLCanvas({ settings }: any) {
  const { width = 0, height = 0 } = useWindowSize();
  const devicePixelRatio = useDevicePixelRatio();
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setSize({ width, height });
  }, [width, height]);

  return (
    <div className="w-[100vw] h-[100vh] absolute inset-0 z-[0]">
      <Canvas
        style={{ width: size.width, height: size.height }}
        dpr={devicePixelRatio || 3}
        camera={{
          position: [0, 0, 2],
          fov: 25,
          aspect: width / height,
          near: 0.2,
          far: 100,
        }}
      >
        <Suspense fallback={null}>
          <Mesh settings={settings} />
        </Suspense>
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
