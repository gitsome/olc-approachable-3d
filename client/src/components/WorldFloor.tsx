import React, { useRef, useState } from 'react';
import * as THREE from 'three';

import Floor from '../classes/Floor';

interface ILibraryCeilingProps {
  children?: React.ReactNode;
  position?: THREE.Vector3;
}

const WorldFloor: React.FC<ILibraryCeilingProps> = ({
  position = new THREE.Vector3(0,0,0)
}) => {

  const ceilingGeometry = useRef(Floor.generateFloor(100, 100, 8, 8));

  return (
    <mesh
      position={position}
      rotation={[-Math.PI /2, 0, 0]}
      geometry={ceilingGeometry.current}
    >
      <meshPhongMaterial attach="material" color={'#aaaaaa'} />
    </mesh>
  )
};

export default WorldFloor;