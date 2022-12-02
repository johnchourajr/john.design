import * as THREE from "three";
import React, {
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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

  // use mouse position to rotate the mesh
  const { mouse } = useThree();
  // useFrame(() => {
  //   if (ref.current) {
  //     ref.current.rotation.x = mouse.y * 0.1;
  //     ref.current.rotation.y = mouse.x * 0.1;
  //   }
  // });

  // use mouse position to move lights
  const [x, setX] = useState(1);
  const [y, setY] = useState(1);
  useFrame(() => {
    setX(mouse.x * 21);
    setY(mouse.y * 5);
  });

  const light1 = { x: x * 0.2 - 4, y: y * 0.35 + 2, z: 5 };
  const light2 = { x: x * 0.2 - 8, y: y * 0.35 + 2, z: 5 };

  // ease out expo cubic bezier

  return (
    <mesh ref={ref as any} scale={1}>
      {light_1.value && (
        <motion.pointLight
          animate={light1 as any}
          intensity={1.5}
          color={0xffffff}
          transition={{ ease: [0.16, 1, 0.3, 1] }}
        />
      )}
      {light_2.value && (
        <motion.pointLight
          animate={light2 as any}
          intensity={1.5}
          color={0xffffff}
          transition={{ ease: [0.16, 1, 0.3, 1] }}
        />
      )}
      <motion.pointLight
        position={[0, 0, 5]}
        intensity={0.25}
        color={0xffffff}
      />
      <planeBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial
        metalness={0.4}
        roughness={0.24}
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
        className="w-[100vw] h-[100vh]"
        style={{ width: size.width, height: size.height }}
        dpr={devicePixelRatio || 3}
        camera={{
          position: [0, 0, 2],
          fov: 25,
          aspect: width / height,
          near: 0.1,
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
