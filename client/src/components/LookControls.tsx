import React, { Fragment, useRef, useState, useEffect } from 'react';
import { extend, useThree, useFrame } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

extend({ OrbitControls });

interface IOrbitTargetControlsProps {
  children?: React.ReactNode;
  target: THREE.Vector3;
};

const OrbitTargetControls: React.FC<IOrbitTargetControlsProps> = ({target}) => {

  const clock = useRef(new THREE.Clock());
  const ref = useRef<OrbitControls>(null);
  const { camera, gl } = useThree();

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.target.z -= 0.01;
    }
  }, [ref.current]);


  useFrame(() => {
    if (ref && ref.current) {
      ref.current.update();
    }
  });

  return (
    <Fragment>
      {/*
      // @ts-ignore */}
      <orbitControls ref={ref} args={[camera, gl.domElement]} target={target} enablePan={false} enableZoom={false} />
    </Fragment>
  );
};

export default OrbitTargetControls;