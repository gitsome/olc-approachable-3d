import React, { Fragment, useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, CanvasContext, useThree } from 'react-three-fiber';
import { useSpring, animated } from 'react-spring/three';
import fonts from '../fonts/fonts';

import Section from '../classes/Section';
import SectionUI from '../components/SectionUI';
import LayerFloor from '../components/LayerFloor';

import useGlobal from '../globalState/global';

const LIBRARY_CEILING_POSITION = new THREE.Vector3(0,-1,0);

const SECTION_RADIANS = Math.PI / 8;
const SECTION_HEIGHT = 0.5;
const SECTIONS_PER_COLUMN = 1;

const LibraryRoom: React.FC = () => {

  const [ { sectionOffset, currentSection, sections }, globalState ] = useGlobal();

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
    rotation: [0, SECTION_RADIANS * sectionOffset, 0],
    config: { mass: 2, tension: 400, friction: 40, precision: 0.00001 }
  });

  const getSectionPositionByIndex = (index: number) => {
    const columnNum = Math.floor(index / SECTIONS_PER_COLUMN);
    const columnPos = index % SECTIONS_PER_COLUMN;
    const radians = -columnNum * SECTION_RADIANS - Math.PI;
    const x = Math.sin(radians) * 3.4;
    const z = Math.cos(radians) * 3.4;
    return { pos: new THREE.Vector3(x, 2, z), rotation: radians - Math.PI};
  };

  return (
    <Fragment>

      <LayerFloor position={LIBRARY_CEILING_POSITION} />

      <animated.group rotation={sectionAnim.rotation}>
        { sections.map((section: Section, index: number) => {

          const positionData = getSectionPositionByIndex(index);
          const isSelectionSelected = (currentSection !== null) && (currentSection.id === section.id);
          const isHidden = (currentSection !== null) && (currentSection.id !== section.id);

          return (
            <SectionUI
              key={index}
              hide={isHidden}
              selected={ isSelectionSelected }
              section={section}
              rotation={positionData.rotation}
              position={positionData.pos}
              onClick={ () => {
                if (currentSection && currentSection.id === section.id) {
                  globalState.update({currentSection: null});
                } else {
                  globalState.update({currentSection: section, sectionOffset: index});
                }
              }}
            />
          )
        })}

      </animated.group>

      <textMesh
          position={[0, 2, -5]}
          {...opts}
          font={fonts['Roboto']}
          text={''}
          anchor={[0.5, 0.5]}
        >
          <meshPhongMaterial attach="material" color={opts.color} />
      </textMesh>
    </Fragment>
  )
};

export default LibraryRoom;