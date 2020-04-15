import React, { Suspense, Fragment, useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useThree, useLoader, useFrame } from 'react-three-fiber';

import ItemInfoPanel from '../components/ItemInfoPanel';
import AnnotationPanel from '../components/AnnotationPanel';
import AnnotationPoint from '../components/AnnotationPoint';

import Item, { Annotation } from '../classes/Item';

import useGlobal from '../globalState/global';

import fonts from '../fonts/fonts';

const itemInfoPosition = new THREE.Vector3(-2.75, 1.6 + 0.05, -2);
const itemInfoRotation = [0, Math.PI / 3.5, 0];

const annotationPosition = new THREE.Vector3(2.75, 1.6 + 0.05, -2);
const annotationRotation = [0, -Math.PI / 3.5, 0];

const ITEM_LOCATION = `${process.env.PUBLIC_URL}/assets/items`;

interface IItemRoomProps {
  children?: React.ReactNode;
  itemId: number;
}

const ItemRoom: React.FC<IItemRoomProps> = ({itemId}) => {

  const [ debugText, setDebugText ] = useState('');

  const [ item, setItem ] = useState<Item | null>(null);
  const [ itemLoading, setItemLoading ] = useState(true);

  const [ annotation, setAnnotation ] = useState<Annotation | null>(null);

  const [ modelLoading, setModelLoading ] = useState(true);
  const [ modelScene, setModelScene ] = useState<THREE.Group | null>(null);

  const primRef = useRef<THREE.Object3D>();

  const [ { rotateLeftActive, rotateRightActive, autoRotateActive } ] = useGlobal();

  useFrame(({camera}) => {
    // (camera as THREE.PerspectiveCamera).getWorldPosition(temp);
    setDebugText(``);
    if (primRef && primRef.current) {

      const rotateValue = (rotateRightActive || autoRotateActive) ? - 0.01 : 0.01;

      if (rotateLeftActive || rotateRightActive || autoRotateActive) {

        primRef.current.rotation.y = primRef.current.rotation.y + rotateValue * ((item && item.rotateY) || 0);
        primRef.current.rotation.x = primRef.current.rotation.x + rotateValue * ((item && item.rotateX) || 0);
        primRef.current.rotation.z = primRef.current.rotation.z + rotateValue * ((item && item.rotateZ) || 0);

      }
    }
  });

  useEffect(() => {

    fetch(`${ITEM_LOCATION}/${itemId}/item.json`).then((resp) => {
      return resp.json();
    }).then((itemJson) => {
      console.log("itemJson:", itemJson);
      setItem(itemJson);
      setItemLoading(false);
    });
  }, []);

  const [opts, setOpts] = useState({
    font: "Philosopher",
    fontSize: 0.2,
    color: "white",
    maxWidth: 10,
    lineHeight: 1,
    letterSpacing: 0,
    textAlign: "justify",
    materialType: "MeshPhongMaterial"
  });

  useEffect(() => {
    if (item) {

      var loader = new GLTFLoader();

      loader.load(`${process.env.PUBLIC_URL}/assets/items/${itemId}/${item.model.location}`, (gltf) => {
        setModelScene(gltf.scene);
        setModelLoading(false);
      });
    }
  }, [item]);

  const material = useMemo(() => {
    return new THREE.MeshPhongMaterial({ color: new THREE.Color('red') })
  }, []);

  const { scene } = useThree();

  return (
    <Fragment>
      <textMesh
          position={[0, 0, -4]}
          {...opts}
          font={fonts['Roboto']}
          text={debugText}
          anchor={[0.5, 0.5]}
      >
        <meshPhongMaterial attach="material" color={opts.color} />
      </textMesh>

      { !itemLoading && item !== null && !modelLoading && (
        <Fragment>
          <group position={[0, 1.6, -2.5]} ref={primRef}>
            <group position={item.model.translation} scale={[item.model.scale, item.model.scale, item.model.scale]} rotation={item.model.rotation}>
              <primitive object={modelScene} />
              { item.annotations.map((ann) => {
                return (
                  <AnnotationPoint
                    key={ann.label}
                    color={ann.color}
                    highlightColor={ann.highlightColor}
                    position={new THREE.Vector3(ann.x, ann.y, ann.z)}
                    scale={1/item.model.scale} selected={(annotation !== null) && annotation.label === ann.label}
                    onSelectedChange={() => { setAnnotation(ann); }}
                  />
                );
              })}
            </group>
          </group>
          <ItemInfoPanel position={itemInfoPosition} rotation={itemInfoRotation} item={item} />
          <AnnotationPanel position={annotationPosition} rotation={annotationRotation} annotation={annotation}/>
        </Fragment>
      )}

    </Fragment>
  )
};

export default ItemRoom;