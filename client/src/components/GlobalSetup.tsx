import React, { Fragment, useEffect, useState } from 'react';
import { useThree, useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

import ThreeVRControllers from '../classes/ThreeVRControllers';

import LookControls from './LookControls';
import ControllerRayCaster from './ControllerRayCaster';

const CLEAR_COLOR = '#CCCCCC';

const ambientLightColor = new THREE.Color('#999999');

const orbitTarget = new THREE.Vector3(0, 1.6, -1);

const GlobalSetup: React.FC = (props: any) => {

  const { camera, gl, scene } = useThree();

  const [ vrControllers, setVrControllers ] = useState<ThreeVRControllers | null>(null);

  useEffect(() => {

    gl.setClearColor(new THREE.Color(CLEAR_COLOR));

    camera.position.set(0, 1.6, 0);

    camera.updateProjectionMatrix();

    setVrControllers(new ThreeVRControllers(gl, scene));
    const vrButton = VRButton.createButton(gl);
    vrButton.classList.add('vr-button');
    document.body.appendChild(vrButton);

  }, []);

  return (
    <Fragment>
      <fog attach="fog" args={[CLEAR_COLOR, 8, 45]} />
      <LookControls target={orbitTarget}/>
      <ControllerRayCaster vrControllers={vrControllers} />
      <ambientLight color={ambientLightColor} />
    </Fragment>
  );
};

export default GlobalSetup;
