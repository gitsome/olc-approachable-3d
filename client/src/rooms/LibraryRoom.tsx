import React, { Fragment, useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, CanvasContext, useThree } from 'react-three-fiber';
import { useSpring, animated } from 'react-spring/three';
import Section from '../classes/Section';
import fonts from '../fonts/fonts';

import SectionButton from '../components/SectionButton';
import LayerFloor from '../components/LayerFloor';
import { Triangle } from 'three';
import useGlobal from '../globalState/global';

const LIBRARY_CEILING_POSITION = new THREE.Vector3(0,-1,0);

const sections = [
  {
    id: '1.1.1',
    name: 'Fungi',
    items: ['1', '5']
  },
  {
    id: '4.1.5',
    name: 'Molecules',
    items: ['2']
  },
  {
    id: '3.1.5',
    name: 'Head Anatomy',
    items: ['3']
  },
  {
    id: '3.2.1',
    name: 'Organ Systems: Skin',
    items: ['4']
  }
];

const SECTION_RADIANS = Math.PI / 10;

const getSectionPositionByIndex = (index: number) => {
  return new THREE.Vector3(0.75 * index, 2, -2);
};

const LibraryRoom: React.FC = () => {

  const [ selectedSection, setSelectedSection ] = useState<Section | null>(null);
  const [ { sectionOffset }, globalState ] = useGlobal();

  const [opts, setOpts] = useState({
    font: "Philosopher",
    fontSize: 0.7,
    color: "gray",
    maxWidth: 10,
    lineHeight: 1,
    letterSpacing: 0,
    textAlign: "justify",
    materialType: "MeshPhongMaterial"
  });

  const sectionAnim = useSpring({
    rotation: [0, - SECTION_RADIANS * sectionOffset, 0],
    config: { mass: 100, tension: 270, friction: 5, precision: 0.00001, duration: 400 }
  });

  return (
    <Fragment>

      <LayerFloor position={LIBRARY_CEILING_POSITION} />

      <animated.group rotation={sectionAnim.rotation}>
        { sections.map((section, index) => {
          return (<SectionButton key={index} sectionIndex={index} section={section} position={getSectionPositionByIndex(index)} onClick={ () => { globalState.update({currentView: 'item', currentItemId: index + 1}) }} />)
        })}
      </animated.group>

      <textMesh
          position={[0, 2, -5]}
          {...opts}
          font={fonts['Roboto']}
          text={'Library'}
          anchor={[0.5, 0.5]}
        >
          <meshPhongMaterial attach="material" color={opts.color} />
      </textMesh>
    </Fragment>
  )
};

export default LibraryRoom;