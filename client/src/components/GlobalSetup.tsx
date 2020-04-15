import React, { Fragment, useEffect, useState } from 'react';
import { useThree, useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

import ThreeVRControllers from '../classes/ThreeVRControllers';

import LookControls from './LookControls';
import ControllerRayCaster from './ControllerRayCaster';


const ambientLightColor = new THREE.Color('#BBBBBB');
const directionalLight = new THREE.Color('#222222');

const orbitTarget = new THREE.Vector3(0, 1.6, -1);

const GlobalSetup: React.FC = (props: any) => {

  const { camera, gl, scene } = useThree();

  const [ vrControllers, setVrControllers ] = useState<ThreeVRControllers | null>(null);

  useEffect(() => {

    gl.setClearColor(new THREE.Color('#CCCCCC'));

    camera.position.set(0, 1.6, 0);

    camera.updateProjectionMatrix();

    setVrControllers(new ThreeVRControllers(gl, scene));
    const vrButton = VRButton.createButton(gl);
    vrButton.classList.add('vr-button');
    document.body.appendChild(vrButton);

  }, []);

  return (
    <Fragment>

      <LookControls target={orbitTarget}/>

      <ControllerRayCaster vrControllers={vrControllers} />

      <ambientLight color={ambientLightColor} />
      <directionalLight position={[0, 10, 5]} color={directionalLight} />
      <pointLight position={[-1.5, 5,-2]} distance={12} color={new THREE.Color('#FFFFFF')}/>
    </Fragment>
  );
};

export default GlobalSetup;
