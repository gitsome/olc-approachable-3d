import React, { useRef, useState, Children, useEffect } from 'react';
import * as THREE from 'three';
import { useCamera, useFrame } from 'react-three-fiber'
import { useSpring, animated } from 'react-spring/three';
import Section from '../classes/Section';

import SectionPanel from '../components/SectionPanel';

interface ISectionButtonProps {
  children?: React.ReactNode;
  section: Section;
  position: THREE.Vector3;
  rotation: number;
  onClick: () => void;
  selected: boolean;
  hide: boolean;
}

const SectionButton: React.FC<ISectionButtonProps> = ({
  section,
  position,
  rotation,
  onClick,
  selected,
  hide
}) => {

  const [ hasLoaded, setHasLoaded ] = useState(false);

  const rootGroupRef = useRef<THREE.Object3D>();

  useEffect(() => {
    setHasLoaded(true);
  }, [])

  const { scale, animPosition } = useSpring({
    scale: hasLoaded ? [1, 1, 1] : [0, 0, 0],
    animPosition: hide ? [position.x * 2, position.y + 0.5, position.z * 2] : [position.x, position.y, position.z],
    config: { mass: 1, tension: 280, friction: 120, precision: 0.00001, duration: 300 }
  });

  useFrame(() => {
    if ( rootGroupRef && rootGroupRef.current) {
      rootGroupRef.current.position.copy(new THREE.Vector3(animPosition));
    }
  });

  return (
    <animated.group scale={scale} position={animPosition} rotation={[0, rotation, 0]}>
      <SectionPanel hide={hide} selected={selected} text={section.name} onSelected={() => { onClick() }}/>
    </animated.group>
  )
};

export default SectionButton;