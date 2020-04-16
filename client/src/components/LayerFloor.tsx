import React, { useRef, useState } from 'react';
import * as THREE from 'three';

import CircleFloor from '../classes/CircleFloor';

interface ILayerFloorProps {
  children?: React.ReactNode;
  position?: THREE.Vector3;
}

const LayerFloor: React.FC<ILayerFloorProps> = ({
  position = new THREE.Vector3(0,0,0)
}) => {

  const layerGeometry = useRef(CircleFloor.generate(15, 15, 1, 3.6));

  return (
    <mesh
      position={position}
      rotation={[-Math.PI /2, 0, 0]}
      geometry={layerGeometry.current}
    >
      <meshPhongMaterial attach="material" color={'#cccccc'} />
    </mesh>
  )
};

export default LayerFloor;