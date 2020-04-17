import React, { useRef, useState } from 'react';
import * as THREE from 'three';

import Section from '../classes/Section';
import CurvedRect from '../classes/CurvedRect';

interface ISectionItemsWallProps {
  children?: React.ReactNode;
  position?: THREE.Vector3;
  radians: number;
}

const SectionItemsWall: React.FC<ISectionItemsWallProps> = ({
  position = new THREE.Vector3(0,0,0),
  radians
}) => {

  const curvedRectGeometry = useRef(CurvedRect.generate(2, 3.4, radians, 10, 1));

  return (
    <mesh
      position={position}
      rotation={[0, 0, 0]}
      geometry={curvedRectGeometry.current}
    >
      <meshPhongMaterial attach="material" color={'#FFFFFF'} side={THREE.BackSide} />
    </mesh>
  )
};

export default SectionItemsWall;