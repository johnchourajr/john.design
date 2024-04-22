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
import { AnimatePresence } from "framer-motion";
import clsx from "clsx";

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

function Mesh({ settings }: any) {
  const ref = useRef<THREE.Mesh>();
  const [me, memap] = useLoader(THREE.TextureLoader, [
    "/me-alpha.png",
    "/me-map.png",
  ]);

  const light_1 = getSettingValue(settings, "Blue Light", true);
  const light_2 = getSettingValue(settings, "Red Light", true);
  const light_3 = getSettingValue(settings, "White Light", true);
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
    x: transform(x, [-1, 1], [1, 0.5]),
    y: transform(y, [-1, 1], [-0.66, -0.4]),
    z: 0,
  };

  const light2 = {
    x: transform(x, [-1, 1], [0, 1]),
    y: transform(y, [-1, 1], [-0.2, -0.44]),
    z: 0,
  };

  const light3 = {
    x: -4,
    y: -4,
    z: 5,
  };

  const sharedProps = {
    intensity: 20,
    distance: 100,
    penumbra: 1,
    angle: 1,
    castShadow: true,
    transition: { ease: [0.16, 1, 0.3, 1] },
  };

  // get color from html data attribute 'data-color'
  const color = document.documentElement.getAttribute("data-color");

  // convert hex to webgl color
  const colorHex = new THREE.Color(color || "#ff0000");

  return (
    <motion.mesh ref={ref as any} scale={1}>
      <Light
        type={"spotLight"}
        light={light2 as any}
        color={0x0000ff}
        hide={!light_2}
        {...sharedProps}
      />
      <Light
        type={"spotLight"}
        light={light1 as any}
        color={colorHex}
        hide={!light_1}
        {...sharedProps}
      />
      <Light
        type={"pointLight"}
        light={light3 as any}
        intensity={2}
        color={0xffffff}
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
        roughness={0}
        normalMap={memap}
        map={me}
        transparent
      />
    </motion.mesh>
  );
}

const SETTINGS = [
  {
    name: "Blue Light",
    type: "Boolean",
    value: true,
  },
  {
    name: "Red Light",
    type: "Boolean",
    value: true,
  },
  {
    name: "White Light",
    type: "Boolean",
    value: true,
  },
  {
    name: "Noise",
    type: "Boolean",
    value: false,
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

export function JohnGLCanvas({ settings, className }: any) {
  const devicePixelRatio = useDevicePixelRatio();

  const noise = getSettingValue(settings, "Noise", false);

  return (
    <div className={clsx("absolute inset-0 z-[1]", className)}>
      <Canvas
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
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
        <AnimatePresence>
          <Suspense fallback={null}>
            <Mesh settings={settings} />
          </Suspense>
        </AnimatePresence>
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
