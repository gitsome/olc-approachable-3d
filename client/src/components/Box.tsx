import React, { useRef, useState } from 'react';
import * as THREE from 'three';

const Box = (props: any) => {

  // This reference will give us direct access to the mesh
  const mesh = useRef<THREE.Mesh>();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(e: any) => setActive(!active)}
      onPointerOver={(e: any) => setHover(true)}
      onPointerOut={(e: any) => setHover(false)}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshPhongMaterial attach="material" color={hovered ? '#FFFFFF' : '#CCCCCC'} opacity={active ? 1.0 : 0.75}/>
    </mesh>
  )
};

export default Box;