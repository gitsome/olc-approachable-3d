import React, { Fragment, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useSpring, animated } from 'react-spring/three';

import fonts from '../fonts/fonts';

import Section from '../classes/Section';

import SectionButton from '../components/SectionButton';
import SectionItemsWall from '../components/SectionItemsWall';
import SectionItem from '../components/SectionItem';

import useGlobal from '../globalState/global';

const WALL_PADDING_RADIANS = 0.1;
const ITEM_RADIANS = Math.PI / 12;

const ITEM_RADIUS = 3.4;
const ITEM_POSITION_Y = 1.1;

const getPositionDataForItem = (startingRadians: number, itemIndex: number) => {
  const radians = startingRadians - WALL_PADDING_RADIANS - itemIndex * ITEM_RADIANS - (itemIndex > 0 ? (itemIndex * WALL_PADDING_RADIANS) : 0) - (ITEM_RADIANS / 2) ;
  return {
    radians: radians,
    pos: new THREE.Vector3(Math.sin(radians) * ITEM_RADIUS, ITEM_POSITION_Y, Math.cos(radians) * ITEM_RADIUS)
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

  const [textOpts] = useState({
    fontSize: 0.12,
    maxWidth: 0.8,
    textAlign: "center",
    materialType: "MeshBasicMaterial"
  });

  const { wallPos } = useSpring({
    wallPos: selected ? [0, 0, 0] : [0, -2,0],
    delay: selected ? 300 : 0,
    config: { mass: 1, tension: 300, friction: 25, clamp: false, precision: 0.00001 }
  });

  const minWallRadians = 2 * WALL_PADDING_RADIANS + 1 * ITEM_RADIANS;
  const wallRadians = Math.max(minWallRadians, 2 * WALL_PADDING_RADIANS + section.items.length * ITEM_RADIANS + (section.items.length - 1) * WALL_PADDING_RADIANS);
  const halfWallRadians = wallRadians / 2;

  const zeroStatePosition = getPositionDataForItem(-Math.PI + wallRadians, 0);

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
        <group>
          { section.items.map((itemId, index) => {

            const positionData = getPositionDataForItem(-Math.PI + wallRadians, index);

            return (
              <group key={itemId} position={positionData.pos} rotation={[0, positionData.radians + Math.PI, 0]}>
                <SectionItem itemId={itemId} onClick={() => {
                  if (selected === true) {
                    globalState.update({currentView: 'item', currentItemId: itemId});
                  }
                }}></SectionItem>
              </group>
            )
          })}
          { section.items.length === 0 && (
            <group>
              <group position={[zeroStatePosition.pos.x, zeroStatePosition.pos.y, zeroStatePosition.pos.z]}>
                <textMesh
                  rotation={[0, zeroStatePosition.radians + Math.PI, 0]}
                  position={[0,0, 0.1]}
                  {...textOpts}
                  color={'#333333'}
                  font={fonts.Roboto}
                  text={'You have not viewed any items in this section yet'}
                  anchor={[0.5, 0.5]}
                  frustumCulled={false}
                ></textMesh>
              </group>
            </group>
          )}
        </group>
      </animated.group>
    </Fragment>
  )
};

export default SectionUI;