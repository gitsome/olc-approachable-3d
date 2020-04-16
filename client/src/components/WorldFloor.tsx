import React, { useRef, useState } from 'react';
import * as THREE from 'three';

import Floor from '../classes/Floor';

interface ILibraryCeilingProps {
  children?: React.ReactNode;
  position?: THREE.Vector3;
}

const floorTex = THREE.ImageUtils.loadTexture(`${process.env.PUBLIC_URL}/assets/textures/dirt.normal.png`);
floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
floorTex.repeat.set(0.75, 0.2);

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
      <meshPhongMaterial attach="material" color={'#cccccc'} normalMap={floorTex} />
    </mesh>
  )
};

export default WorldFloor;