import React, { Fragment, useRef, useState, useEffect } from 'react';
import { extend, useThree, useFrame } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import useGlobal from '../globalState/global';

extend({ OrbitControls });

interface IOrbitTargetControlsProps {
  children?: React.ReactNode;
  target: THREE.Vector3;
};

const OrbitTargetControls: React.FC<IOrbitTargetControlsProps> = ({target}) => {

  const ref = useRef<OrbitControls>(null);
  const { camera, gl } = useThree();

  const [ { requestRecenter } , globalStateStore ] = useGlobal();

  useEffect(() => {
    if (ref.current) {
      ref.current.saveState();
    }
  }, [ref, ref.current]);

  useFrame(() => {
    if (ref && ref.current) {

      if (requestRecenter) {
        ref.current.reset();
        globalStateStore.update({requestRecenter: false});
      }

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