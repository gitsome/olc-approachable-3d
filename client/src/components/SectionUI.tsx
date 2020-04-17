import React, { Fragment, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useCamera, useFrame } from 'react-three-fiber'
import { useSpring, animated } from 'react-spring/three';
import Section from '../classes/Section';

import SectionButton from '../components/SectionButton';
import SectionItemsWall from '../components/SectionItemsWall';

import useGlobal from '../globalState/global';

const WALL_PADDING_RADIANS = 0.1;
const ITEM_RADIANS = Math.PI / 12;

const getPositionForItem = (startingRadians: number, itemIndex: number) => {
  // const radians = -Math.PI + startingRadians - (WALL_PADDING_RADIANS + itemIndex * ITEM_RADIANS + (itemIndex > 0 ? ((itemIndex - 1) * WALL_PADDING_RADIANS) : 0));
  const radians = startingRadians - WALL_PADDING_RADIANS - itemIndex * ITEM_RADIANS - (itemIndex > 0 ? (itemIndex * WALL_PADDING_RADIANS) : 0) - (ITEM_RADIANS / 2) ;
  return new THREE.Vector3(
    Math.sin(radians) * 3.4,
    1,
    Math.cos(radians) * 3.4
  );
};

interface ISectionUIProps {
  children?: React.ReactNode;
  section: Section;
  position: THREE.Vector3;
  rotation: number;
  onClick: () => void;
  selected: boolean;
  hide: boolean;
}

const SectionUI: React.FC<ISectionUIProps> = ({
  section,
  position,
  rotation,
  onClick,
  selected,
  hide
}) => {

  const [ globalStateValues, globalState ] = useGlobal();

  const { wallPos } = useSpring({
    wallPos: selected ? [0, -0.15, 0] : [0, -1.8,0],
    delay: selected ? 300 : 0,
    config: { mass: 1, tension: 300, friction: 25, clamp: false, precision: 0.00001 }
  });

  const wallRadians = 2 * WALL_PADDING_RADIANS + section.items.length * ITEM_RADIANS + (section.items.length - 1) * WALL_PADDING_RADIANS;
  const halfWallRadians = wallRadians / 2;

  console.log("rotation:", rotation, halfWallRadians);

  return (
    <Fragment>
      <SectionButton
        hide={hide}
        selected={selected}
        section={section}
        rotation={rotation}
        position={position}
        onClick={onClick}
      />
      <animated.group position={wallPos} rotation={[0, rotation - halfWallRadians, 0]}>
        <SectionItemsWall position={new THREE.Vector3(0, 0.75, 0)} radians={wallRadians} />
        <animated.group>
          { section.items.map((itemId, index) => {
            return (
              <mesh key={itemId} position={getPositionForItem(-Math.PI + wallRadians, index)} onPointerDown={() => {
                globalState.update({currentView: 'item', currentItemId: itemId});
              }}>
                <sphereBufferGeometry attach="geometry" args={[0.1, 5, 5]} />
                <meshPhongMaterial attach="material" color={'#FF0000'} />
              </mesh>
            )
          })}
        </animated.group>
      </animated.group>
    </Fragment>
  )
};

export default SectionUI;