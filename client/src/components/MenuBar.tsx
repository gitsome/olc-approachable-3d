// var geometry = new THREE.PlaneGeometry( 5, 20, 32 );
// var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
// var plane = new THREE.Mesh( geometry, material );

import React, { useRef, useState, Children } from 'react';
import * as THREE from 'three';
import { useCamera, useFrame } from 'react-three-fiber'

const menuBarPosition = new THREE.Vector3(0, 0.95, -1);
const menuBarRotation = [-0.3,0,0];

interface IMenuBarProps {
  children?: React.ReactNode;
  width?: number;
  height?: number;
}

const MenuBar: React.FC<IMenuBarProps> = ({
  children,
  width = 1,
  height = 0.2
}) => {

  return (
    <group position={menuBarPosition} rotation={menuBarRotation}>
      <mesh>
        <planeGeometry attach="geometry" args={[width, height, 1]}/>
        <meshPhongMaterial attach="material" color={new THREE.Color('#222222')} side={THREE.DoubleSide} />
      </mesh>
      <group position={[0,0,0]}>
        {children}
      </group>
    </group>
  )
};

export default MenuBar;