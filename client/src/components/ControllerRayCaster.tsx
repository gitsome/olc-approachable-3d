import React, { Fragment, useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, CanvasContext, useThree } from 'react-three-fiber';
import ThreeVRControllers from '../classes/ThreeVRControllers';

let counter = 0;

interface IControllerRayCasterProps {
  children?: React.ReactNode;
  vrControllers: ThreeVRControllers | null;
}

const pointLightColor = new THREE.Color('#6666FF');

const tempMatrix = new THREE.Matrix4();
const tempDirection = new THREE.Vector3();

let isOnSelectStart: boolean = false;
let isOnSelectEnd: boolean = false;
let isOnSelect: boolean = false;

const ControllerRayCaster: React.FC<IControllerRayCasterProps> = ({vrControllers}) => {

  const [ debugText, setDebugText ] = useState('');
  const [ contextRef, setContextRef ] = useState<CanvasContext | null>(null);

  // start listening for VR Controller events
  useEffect(() => {

    if (vrControllers) {

      vrControllers.on('onSelectStart', () => {
        isOnSelectStart = true;
      });
      vrControllers.on('onSelectEnd', () => {
        isOnSelectEnd = true;
      });
      vrControllers.on('onSelect', () => {
        isOnSelect = true;
      });
    }

  }, [vrControllers]);


  useFrame((context) => {

    if (contextRef !== null) {
      setContextRef(context);
    }

    if (vrControllers) {

      // handle vr controller movement
      if (vrControllers.selectedController === 1) {
        tempMatrix.identity().extractRotation( vrControllers.controller1.matrixWorld );
        context.raycaster.ray.origin.setFromMatrixPosition( vrControllers.controller1.matrixWorld );
        context.raycaster.ray.direction.set(0, 0, -1).applyMatrix4( tempMatrix );
      } else if (vrControllers.selectedController === 2) {
        tempMatrix.identity().extractRotation( vrControllers.controller2.matrixWorld );
        context.raycaster.ray.origin.setFromMatrixPosition( vrControllers.controller2.matrixWorld );
        context.raycaster.ray.direction.set(0, 0, -1).applyMatrix4( tempMatrix );
      }
      context.events.onPointerMove({});

      // check for select down and up and select
      if (isOnSelectStart) {
        context.events.onPointerDown({});
        isOnSelectStart = false;
      }
      if (isOnSelectEnd) {
        context.events.onPointerUp({});
        isOnSelectEnd = false;
      }
      if (isOnSelect) {
        context.events.onClick({});
        isOnSelect = false;
      }
    }
  });

  return (
    <Fragment></Fragment>
  )
};

export default ControllerRayCaster;