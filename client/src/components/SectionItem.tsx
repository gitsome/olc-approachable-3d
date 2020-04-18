import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

import fonts from '../fonts/fonts';

const ITEMS_PATH = `${process.env.PUBLIC_URL}/assets/items`;

interface ISectionItemProps {
  children?: React.ReactNode;
  onClick: () => void;
  itemId: string;
}

const SectionItem: React.FC<ISectionItemProps> = ({
  onClick,
  itemId
}) => {

  const [ materialMap, setMaterialMap ] = useState<THREE.Texture | null>(null);
  const [ itemTitle, setItemTitle ] = useState('');

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);

  const [titleOpts] = useState({
    fontSize: 0.08,
    maxWidth: 0.75,
    textAlign: "center",
    materialType: "MeshBasicMaterial"
  });

  useEffect(() => {
    const texture = new THREE.TextureLoader().load( `${ITEMS_PATH}/${itemId}/screenshot.png` );
    setMaterialMap(texture);
  }, []);

  useEffect(() => {
    fetch(`${ITEMS_PATH}/${itemId}/item.json`).then((resp) => {
      return resp.json();
    }).then((itemJson) => {
      setItemTitle(itemJson.name);
    });
  }, []);

  return (
    <group>
      <mesh
        onPointerOver={(e: any) => { setHover(true); }}
        onPointerOut={(e: any) => { setHover(false); }}
        onPointerUp={() => { onClick() }}
        position={[0, 0, 0.2]}
      >
        <planeBufferGeometry attach="geometry" args={[1, 0.9, 1]} />
        <meshPhongMaterial attach="material" color={hovered ? '#DDDDDD' : '#FFFFFF'} side={THREE.FrontSide} emissive={new THREE.Color('#333333')} shininess={10}/>
      </mesh>
      <mesh position={[0, 0.15, 0.21]}>
        <planeBufferGeometry attach="geometry" args={[0.4, 0.4, 1]} />
        <meshPhongMaterial attach="material" color={'#FFFFFF'} side={THREE.FrontSide} map={materialMap} transparent={true} />
      </mesh>
      <textMesh
        position={[0, -0.2, 0.22]}
        {...titleOpts}
        color={'#333333'}
        font={fonts.Roboto}
        text={itemTitle}
        anchor={[0.5, 0.5]}
        frustumCulled={false}
      ></textMesh>
    </group>
  )
};

export default SectionItem;