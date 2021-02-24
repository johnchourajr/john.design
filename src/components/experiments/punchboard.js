import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from 'react-three-fiber';
import { useDrag } from 'react-use-gesture';
import { useSpring, a } from '@react-spring/three';

import styled from 'styled-components';

function Camera(props) {
  const ref = useRef();
  const { setDefaultCamera } = useThree();
  // Make the camera known to the system
  useEffect(() => void setDefaultCamera(ref.current), []);
  // Update it every frame
  useFrame(() => ref?.current?.updateMatrixWorld());
  return <perspectiveCamera ref={ref} {...props} />;
}

function El(props) {
  const { viewport } = useThree();
  const [spring, set] = useSpring(() => ({
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    config: { mass: 3, friction: 40, tension: 800 }
  }));

  const mesh = useRef();
  const [hovered, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  const bind = useDrag(
    ({ offset: [x, y], vxvy: [vx, vy], down, ...props }) => {
      const aspect = viewport().factor;
      set({
        position: [x / aspect, -y / aspect, 0],
        rotation: [y / aspect, x / aspect, 0]
      });
    },
    { eventOptions: { pointer: true } }
  );

  const setScale = (state) => {
    setHover(state);
    set({
      scale: state ? [1, 1.1, 1] : [1, 1, 1]
    });
  };

  const handlePressed = (state) => {
    setPressed(state);
    set({
      scale: state ? [1, 0.5, 1] : [1, 1, 1]
    });
  };

  return (
    <a.mesh
      {...spring}
      {...bind()}
      {...props}
      ref={mesh}
      rotation={[-2, 0, 0]}
      onPointerMove={(e) => setScale(true)}
      onPointerOut={(e) => setScale(false)}
      onPointerDown={(e) => handlePressed(true)}
      onPointerUp={(e) => handlePressed(false)}
      castShadow
    >
      <cylinderBufferGeometry attach="geometry" args={[1, 1, 2, 60]} />
      <meshPhongMaterial attach="material" color="#72FFBB" />
    </a.mesh>
  );
}

function Slate(props) {
  return (
    <a.mesh receiveShadow rotation={[0, 0, 0]} position={[0, 0, -5]} {...props}>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshPhongMaterial color="#FF7272" attach="material" />
    </a.mesh>
  );
}

export default function PunchBoard() {
  if (typeof document == `undefined` && typeof window == `undefined`) {
    return <></>;
  }

  return (
    <Wrap>
      <Canvas colorManagement pixelRatio={window.devicePixelRatio}>
        <Camera position={[0, 0, 16]} />
        <ambientLight intensity={1} castShadow />
        <spotLight
          position={[10, 10, 0]}
          angle={0.15}
          penumbra={1}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} castShadow />
        <El position={[0, 0, -5]} />
        <El position={[-3, 0, -5]} />
        <El position={[3, 0, -5]} />
        <El position={[0, -3, -5]} />
        <El position={[-3, -3, -5]} />
        <El position={[3, -3, -5]} />
        <El position={[0, 3, -5]} />
        <El position={[-3, 3, -5]} />
        <El position={[3, 3, -5]} />
        <Slate />
      </Canvas>
    </Wrap>
  );
}

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: lightblue;
`;
