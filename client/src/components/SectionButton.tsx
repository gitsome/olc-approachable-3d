import React, { useRef, useState, Children, useEffect } from 'react';
import * as THREE from 'three';
import { useCamera, useFrame } from 'react-three-fiber'
import { useSpring, animated } from 'react-spring/three';
import Section from '../classes/Section';


const menuBarPosition = new THREE.Vector3(0, 0.95, -1);
const menuBarRotation = [-0.3, 0, 0];

interface ISectionButtonProps {
  children?: React.ReactNode;
  section: Section;
  sectionIndex: number;
  position: THREE.Vector3;
  onClick: () => void;
}

const MenuBar: React.FC<ISectionButtonProps> = ({
  section,
  sectionIndex,
  position,
  onClick
}) => {

  const [ hasLoaded, setHasLoaded ] = useState(false);

  useEffect(() => {
    setHasLoaded(true);
  }, [])

  const { scale } = useSpring({
    from: {scale: [0, 0, 0]},
    to: {scale: [1, 1, 1]},
    delay: 300 + 300 * sectionIndex,
    config: { mass: 1, tension: 280, friction: 120, precision: 0.00001, duration: 300 }
  });

  return (
    <group position={position}>
      <animated.mesh scale={scale} onPointerDown={onClick}>
        <circleBufferGeometry attach="geometry" args={[0.3, 8, 8]}/>
        <meshPhongMaterial attach="material" color={new THREE.Color('#222222')} side={THREE.DoubleSide} />
      </animated.mesh>
    </group>
  )
};

export default MenuBar;