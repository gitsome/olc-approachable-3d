import React, { Fragment, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useCamera, useFrame } from 'react-three-fiber'
import { useSpring, animated } from 'react-spring/three';
import Section from '../classes/Section';

import SectionButton from '../components/SectionButton';
import SectionItemsWall from '../components/SectionItemsWall';
import SectionItem from '../components/SectionItem';

import useGlobal from '../globalState/global';

const WALL_PADDING_RADIANS = 0.1;
const ITEM_RADIANS = Math.PI / 12;

const getPositionDataForItem = (startingRadians: number, itemIndex: number) => {
  const radians = startingRadians - WALL_PADDING_RADIANS - itemIndex * ITEM_RADIANS - (itemIndex > 0 ? (itemIndex * WALL_PADDING_RADIANS) : 0) - (ITEM_RADIANS / 2) ;
  return {
    radians: radians,
    pos: new THREE.Vector3(Math.sin(radians) * 3.4, 1.1, Math.cos(radians) * 3.4)
  };
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
    wallPos: selected ? [0, 0, 0] : [0, -2,0],
    delay: selected ? 300 : 0,
    config: { mass: 1, tension: 300, friction: 25, clamp: false, precision: 0.00001 }
  });

  const wallRadians = 2 * WALL_PADDING_RADIANS + section.items.length * ITEM_RADIANS + (section.items.length - 1) * WALL_PADDING_RADIANS;
  const halfWallRadians = wallRadians / 2;

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

            const positionData = getPositionDataForItem(-Math.PI + wallRadians, index);

            return (
              <group key={itemId} position={positionData.pos} rotation={[0, positionData.radians + Math.PI, 0]}>
                <SectionItem itemId={itemId} onClick={() => {
                  if (selected) {
                    globalState.update({currentView: 'item', currentItemId: itemId});
                  }
                }}></SectionItem>
              </group>
            )
          })}
        </animated.group>
      </animated.group>
    </Fragment>
  )
};

export default SectionUI;