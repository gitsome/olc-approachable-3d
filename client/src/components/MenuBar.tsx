// var geometry = new THREE.PlaneGeometry( 5, 20, 32 );
// var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
// var plane = new THREE.Mesh( geometry, material );

import React, { useRef, useState, Children, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from 'react-three-fiber'
import useGlobal from '../globalState/global';

const menuBarOffset = new THREE.Vector3(0, -0.35, -1.2);
const menuBarOffsetVR = new THREE.Vector3(0, 0.9, -1);

const menuBarRotation = new THREE.Vector3(-0.3, 0, 0);

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

  const menuBarRef = useRef<THREE.Group>();

  const [{isVR}] = useGlobal();

  useFrame(({gl, camera}) => {

    if (menuBarRef && menuBarRef.current) {

      if (isVR) {

        menuBarRef.current.position.copy(menuBarOffsetVR);
        menuBarRef.current.rotation.x = menuBarRotation.x;

      } else {
        menuBarRef.current.position.copy( camera.position );
        menuBarRef.current.rotation.copy( camera.rotation );
        menuBarRef.current.rotateX(menuBarRotation.x);
        menuBarRef.current.updateMatrix();
        menuBarRef.current.translateX(menuBarOffset.x);
        menuBarRef.current.translateY(menuBarOffset.y);
        menuBarRef.current.translateZ(menuBarOffset.z);
      }
    }
  });

  return (
    <group ref={menuBarRef}>
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