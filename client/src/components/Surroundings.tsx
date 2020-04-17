import React, { Fragment, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import WorldFloor from '../components/WorldFloor';

const WORLD_FLOOR_POSITION = new THREE.Vector3(0, -8, 0);

interface ITree {
  scale: number[];
  pos: THREE.Vector3;
  scene: THREE.Group | null;
}

const trees: ITree[] = [
  { scale: [1,1,1], pos: new THREE.Vector3(-9, -2, -13), scene: null},
  { scale: [1,1,1], pos: new THREE.Vector3(12, -2, -25), scene: null}
];

const Surroundings: React.FC = (props: any) => {

  const [ modelScene, setModelScene ] = useState<THREE.Group | null>(null);
  const [ treeLoading, setTreeLoading ] = useState(false);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(`${process.env.PUBLIC_URL}/assets/models/low_poly_pine/scene.gltf`, (gltf) => {
      trees.forEach((tree) => {
        tree.scene = gltf.scene.clone();
      });
      setModelScene(gltf.scene);
      setTreeLoading(false);
    });
  }, []);

  return (
    <Fragment>
      <WorldFloor position={WORLD_FLOOR_POSITION} />
      { !treeLoading && modelScene && (
        <Fragment>
          { trees.map((tree: any, index) => {
            return (
              <primitive object={tree.scene} scale={tree.scale} position={tree.pos} key={index}/>
            );
          })}
        </Fragment>
      )}
    </Fragment>

  )
};

export default Surroundings;