import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";

import InlineLink from "../../components/InlineLink";
import { useDevicePixelRatio, useWindowSize } from "../../utils/hooks";
import { motion } from "framer-motion-3d";
import { SettingsGroup } from "../../components/SettingsComponents";

function Mesh({ settings }: any) {
  const ref = useRef<THREE.Mesh>();
  const [me, memap] = useLoader(THREE.TextureLoader, ["/me.png", "/memap.png"]);

  const light_1 = settings.find((setting: any) => setting.name === "Light 1");
  const light_2 = settings.find((setting: any) => setting.name === "Light 2");
  const light_3 = settings.find((setting: any) => setting.name === "Light 3");
  const metalness = settings.find(
    (setting: any) => setting.name === "Metalness"
  );

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
      {light_1?.value && (
        <motion.spotLight
          animate={light1 as any}
          intensity={10}
          color={0x0000ff}
          transition={{ ease: [0.16, 1, 0.3, 1] }}
          angle={0.5}
          distance={100}
          penumbra={1}
          castShadow
        />
      )}
      {light_2?.value && (
        <motion.spotLight
          animate={light2 as any}
          intensity={10}
          color={0xff0000}
          transition={{ ease: [0.16, 1, 0.3, 1] }}
          angle={0.5}
          distance={100}
          penumbra={1}
          castShadow
        />
      )}
      {light_3?.value && (
        <motion.pointLight
          animate={light3 as any}
          intensity={0.8}
          color={0xffffff}
        />
      )}
      <planeBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial
        metalness={metalness?.value}
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

export default function JohnGL() {
  const [settings, setSettings] = React.useState(SETTINGS);

  React.useEffect(() => {}, []);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { width = 0, height = 0 } = useWindowSize();
  const devicePixelRatio = useDevicePixelRatio();

  useEffect(() => {
    setSize({ width, height });
  }, [width, height]);

  return (
    <>
      <InlineLink href="/exp/" className="no-underline">
        <h2 className="my-8">
          &larr; <span className="underline">Back</span>
        </h2>
      </InlineLink>
      <Canvas
        className="w-[100vw] h-[100vh] fixed inset-0"
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
      <SettingsGroup settings={settings} setSettings={setSettings} />
    </>
  );
}
