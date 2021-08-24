import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from 'react-three-fiber';
import { useDrag } from 'react-use-gesture';
import { useSpring, a } from '@react-spring/three';

import styled from 'styled-components';
import { changeBodyClass } from '../../functions/util';

function Camera(props) {
  const ref = useRef(null);
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

  const mesh = useRef(null);
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

  useEffect(() => {
    if (props.keyState === props.keyId) {
      handlePressed(true);
    } else {
      handlePressed(false);
    }
  }, [props.keyState]);

  const setScale = (state) => {
    setHover(state);
    set({
      scale: state ? [1, 1.1, 1] : [1, 1, 1]
    });
  };

  const pressedScale = props.pressedScale ? props.pressedScale : 0.45;

  const handlePressed = (state) => {
    setPressed(state);
    set({
      scale: state ? [1, pressedScale, 1] : [1, 1, 1]
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
      receiveShadow
    >
      <cylinderBufferGeometry attach="geometry" args={props.arg} />
      <meshToonMaterial attach="material" color={props.color} />
    </a.mesh>
  );
}

function Slate(props) {
  return (
    <a.mesh receiveShadow rotation={[0, 0, 0]} position={[0, 0, -5]} {...props}>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshToonMaterial color="#2E2E2E" attach="material" />
    </a.mesh>
  );
}

export default function PunchBoard() {
  const [keyState, setKeyState] = useState('');

  function logKey(e) {
    if (e.type === 'keydown') {
      setKeyState(e.code);
    } else {
      setKeyState('');
    }
  }

  useEffect(() => {
    changeBodyClass('enter', '', 'white', 'black');
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', logKey);
    document.addEventListener('keyup', logKey);
    console.log(keyState);

    return () => {
      document.removeEventListener('keydown', logKey);
      document.removeEventListener('keyup', logKey);
    };
  });

  if (typeof document == `undefined` && typeof window == `undefined`) {
    return <></>;
  }

  return (
    <Wrap>
      <InstructionBox>
        <h2 className="funky">Press Keys 1-9</h2>
      </InstructionBox>
      <Canvas colorManagement shadowMap pixelRatio={window.devicePixelRatio}>
        <Camera position={[0, 0, 16]} />
        <ambientLight intensity={0.1} />
        <directionalLight position={[3, 3, 10]} intensity={0.5} castShadow />
        <El
          position={[0, 0, -5]}
          arg={[1, 1, 3, 60]}
          color="#F86D6A"
          keyId="Digit1"
          keyState={keyState}
        />
        <El
          position={[-3, 0, -5]}
          arg={[1, 1, 2, 60]}
          color="#FFFFFF"
          keyId="Digit2"
          keyState={keyState}
        />
        <El
          position={[3, 0, -5]}
          arg={[1, 1, 2, 60]}
          color="#72E6FF"
          keyId="Digit3"
          pressedScale={2}
          keyState={keyState}
        />
        <El
          position={[0, -3, -5]}
          arg={[1, 1, 2, 60]}
          color="#FFC672"
          keyId="Digit4"
          keyState={keyState}
        />
        <El
          position={[-3, -3, -5]}
          arg={[1, 1, 2.5, 60]}
          color="#7291FF"
          keyId="Digit5"
          keyState={keyState}
        />
        <El
          position={[3, -3, -5]}
          arg={[1, 1, 2, 60]}
          color="#A2E270"
          keyId="Digit6"
          pressedScale={3}
          keyState={keyState}
        />
        <El
          position={[0, 3, -5]}
          arg={[1, 1, 2, 60]}
          color="#72FFBB"
          keyId="Digit7"
          keyState={keyState}
        />
        <El
          position={[-3, 3, -5]}
          arg={[1, 1, 4, 60]}
          color="#FCFF72"
          keyId="Digit8"
          keyState={keyState}
        />
        <El
          position={[3, 3, -5]}
          arg={[1, 1, 2, 60]}
          color="#FF98F5"
          keyId="Digit9"
          keyState={keyState}
        />
        <Slate />
      </Canvas>
    </Wrap>
  );
}

const InstructionBox = styled.div`
  position: absolute;
  bottom: 10%;
  z-index: 9999;
  left: 50%;
  transform: translateX(-50%);
`;

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  color: white;
`;
