import React, { useRef, useState, Children } from 'react';
import * as THREE from 'three';
import { useCamera, useFrame } from 'react-three-fiber'

import Item from '../classes/Item';

import Frame from '../classes/Frame';
import fonts from '../fonts/fonts';

const itemPanelRotation = [0,0,0];

const WHITEBOARD_BORDER_WIDTH = 0.1;

const TITLE_FONT_SIZE = 0.25;
const DESCRIPTION_FONT_SIZE = 0.125;

interface IItemInfoPanelProps {
  children?: React.ReactNode;
  width?: number;
  height?: number;
  position: THREE.Vector3;
  rotation: number[];
  item: Item;
}

const ItemInfoPanel: React.FC<IItemInfoPanelProps> = ({
  children,
  width = 3,
  height = 2.5,
  position = new THREE.Vector3(0,0,0),
  rotation = [0,0,0],
  item
}) => {

  const frame = useRef(Frame.generateFrame(width, height, 0.1, WHITEBOARD_BORDER_WIDTH));

  const WHITEBOARD_CONTENT_PADDING = 2 * WHITEBOARD_BORDER_WIDTH;
  const TITLE_START = height / 2 - WHITEBOARD_BORDER_WIDTH - WHITEBOARD_CONTENT_PADDING;
  const TITLE_HEIGHT = TITLE_FONT_SIZE;
  const CONTENT_START = TITLE_START - TITLE_HEIGHT - WHITEBOARD_CONTENT_PADDING;
  const CONTENT_HEIGHT = height - 2 * WHITEBOARD_BORDER_WIDTH - 2 * WHITEBOARD_CONTENT_PADDING - TITLE_HEIGHT;
  const CONTENT_WIDTH = width - 2 * WHITEBOARD_BORDER_WIDTH - WHITEBOARD_CONTENT_PADDING;

  const [titleOpts] = useState({
    fontSize: TITLE_FONT_SIZE,
    color: "#444444",
    maxWidth: width - 2 * WHITEBOARD_BORDER_WIDTH - 2 * WHITEBOARD_CONTENT_PADDING,
    textAlign: "center",
    materialType: "MeshPhongMaterial"
  });

  const [descriptionOpts] = useState({
    fontSize: DESCRIPTION_FONT_SIZE,
    color: "#444444",
    maxWidth: width - 2 * WHITEBOARD_BORDER_WIDTH - 2 * WHITEBOARD_CONTENT_PADDING,
    lineHeight: DESCRIPTION_FONT_SIZE * 7,
    textAlign: "left",
    materialType: "MeshPhongMaterial"
  });

  return (
    <group position={position} rotation={rotation}>

      <pointLight position={[0, height / 2, 1]} distance={5} color={new THREE.Color('#555555')}/>

      <mesh geometry={frame.current}>
        <meshPhongMaterial attach="material" color={new THREE.Color('#BBBBBB')} />
      </mesh>

      <mesh>
        <planeGeometry attach="geometry" args={[width - WHITEBOARD_BORDER_WIDTH / 2, height - WHITEBOARD_BORDER_WIDTH / 2, 1]}/>
        <meshPhongMaterial attach="material" color={new THREE.Color('#EEEEEE')} />
      </mesh>

      <group position={[0,0, 0.01]}>
        <textMesh
            position={[0, TITLE_START, 0]}
            {...titleOpts}
            font={fonts.Whiteboard}
            text={item.name}
            anchor={[0.5, 0.5]}
            frustumCulled={false}
        ></textMesh>

        { item.description.map((desc, index) => {
          return (
            <textMesh
                position={[-CONTENT_WIDTH/2, CONTENT_START - index * (CONTENT_HEIGHT / 3) , 0]}
                {...descriptionOpts}
                font={fonts.Whiteboard}
                text={desc}
                anchor={[0, 0.5]}
                frustumCulled={false}
            ></textMesh>
          );
        })}
      </group>

    </group>
  )
};

export default ItemInfoPanel;