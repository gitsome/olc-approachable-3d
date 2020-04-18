import React, { Fragment, useEffect } from 'react';
import * as THREE from 'three';
import { useSpring, animated } from 'react-spring/three';
import { useThree } from 'react-three-fiber';

import Section from '../classes/Section';

import useGlobal from '../globalState/global';

import GlobalSetup from '../components/GlobalSetup';

import MenuBar from '../components/MenuBar';
import RoundButton from '../components/RoundButton';

import Surroundings from '../components/Surroundings';
import ItemRoom from '../rooms/ItemRoom';
import LibraryRoom from '../rooms/LibraryRoom';

import fonts from '../fonts/fonts';
import { Vector3 } from 'three';

const libraryButtonPosition = new THREE.Vector3(-0.37, 0, 0);
const rotateLeftButtonPosition = new THREE.Vector3(-0.13, 0, 0);
const rotateButtonPosition = new THREE.Vector3(0, 0, 0);
const rotateRightButtonPosition = new THREE.Vector3(0.13, 0, 0);

const sectionLeftButtonPosition = new THREE.Vector3(-0.32, 0, 0);
const centerCameraButtonPosition = new THREE.Vector3(0, 0, 0);
const sectionRightButtonPosition = new THREE.Vector3(0.32, 0, 0);

const directionalLight = new THREE.Color('#222222');
const itemRoomPosition = [0, 7, 0];

const CanvasMain: React.FC = () => {

  const { camera } = useThree();

  const [ {
    currentItemId,
    currentSection,
    autoRotateActive,
    currentView,
    sectionOffset,
    sections,
    isVR
  }, globalStateStore ] = useGlobal();

  const { pos, ...props } = useSpring({
    pos: currentView === 'library' ? [0, 0, 0] : [0, -7, 0],
    config: { mass: 1, tension: 5, clamp: true, friction: 4, precision: 0.00001 }
  });

  const itemRoomMenu = useSpring({
    scale: currentView === 'library' ? [0, 0, 0] : [1, 1, 1],
    pos: currentView === 'library' ? [0, 0.075, 0] : [0, 0, 0],
    opacity: currentView === 'library' ? 0 : 1,
    config: { mass: 1, tension: 280, friction: 120, precision: 0.00001, duration: 400 }
  });
  const libraryRoomMenu = useSpring({
    scale: currentView === 'item' ? [0, 0, 0] : [1, 1, 1],
    pos: currentView === 'item' ? [0, -0.075, 0] : [0, 0, 0],
    opacity: currentView === 'item' ? 0 : 1,
    config: { mass: 1, tension: 280, friction: 120, precision: 0.00001, duration: 400 }
  });

  useEffect(() => {
    let currentSectionIndex = -1;
    if (currentSection) {
      currentSectionIndex = sections.map((sec: Section) => { return sec.id; }).indexOf(currentSection.id);
      if (sectionOffset !== currentSectionIndex) {
        globalStateStore.update({
          currentSection: sections[sectionOffset]
        });
      }
    }
  }, [currentSection, sectionOffset]);

  return (
    <Fragment>

      <GlobalSetup />

      <animated.group position={pos}>
        <group position={itemRoomPosition}>
          <ItemRoom itemId={currentItemId} />
        </group>

        <LibraryRoom />
      </animated.group>

      <group>
        <directionalLight position={[0, 10, 5]} color={directionalLight} frustumCulled={false} />
        <pointLight position={[-1.5, 5,-2]} distance={12} color={new THREE.Color('#FFFFFF')} />

        <Surroundings />

        <mesh>
          <cylinderBufferGeometry attach="geometry" args={[3, 3, 0.3, 24]}/>
          <meshPhongMaterial attach="material" color={"#AAAAAA"}/>
        </mesh>

        <MenuBar width={1.0}>

          <animated.group scale={itemRoomMenu.scale} position={itemRoomMenu.pos} opacity={itemRoomMenu.opacity}>
            <RoundButton
              position={libraryButtonPosition}
              fontPath={fonts.FontAwesome}
              paddingBottom={0.03}
              width={0.15}
              text="&#xf66f;"
              onClick={() => {
                globalStateStore.update({currentView: currentView === 'library' ? 'item' : 'library'});
              }}
            />
            <RoundButton
              position={rotateLeftButtonPosition}
              fontPath={fonts.FontAwesome}
              paddingBottom={0.03}
              width={0.12}
              text="&#xf0e2;"
              fontScale={0.85}
              onDownChanged={(newVal) => {
                globalStateStore.update({rotateLeftActive: newVal});
              }}
            />
            <RoundButton
              position={rotateButtonPosition}
              selected={autoRotateActive}
              paddingBottom={0.03}
              fontPath={fonts.FontAwesome}
              width={0.12}
              text="&#xf021;"
              onClick={() => {
                globalStateStore.update({autoRotateActive: !autoRotateActive});
              }}
            />
            <RoundButton
              position={rotateRightButtonPosition}
              fontPath={fonts.FontAwesome}
              paddingBottom={0.03}
              width={0.12}
              text="&#xf01e;"
              fontScale={0.85}
              onDownChanged={(newVal) => {
                globalStateStore.update({rotateRightActive: newVal});
              }}
            />
          </animated.group>

          <animated.group scale={libraryRoomMenu.scale} position={libraryRoomMenu.pos} opacity={libraryRoomMenu.opacity}>
            <RoundButton
              position={sectionLeftButtonPosition}
              fontPath={fonts.FontAwesome}
              paddingBottom={0.03}
              width={0.25}
              text="&#xf060;"
              onClick={() => {
                if (sectionOffset > 0) { globalStateStore.update({sectionOffset: sectionOffset - 1});}
              }}
            />

            { !isVR && (
              <RoundButton
                position={centerCameraButtonPosition}
                fontPath={fonts.FontAwesome}
                paddingBottom={0.03}
                width={0.15}
                text="&#xf78c;"
                onClick={() => {
                  globalStateStore.update({requestRecenter: true});
                }}
              />
            )}

            <RoundButton
              position={sectionRightButtonPosition}
              fontPath={fonts.FontAwesome}
              paddingBottom={0.03}
              width={0.25}
              text="&#xf061;"
              onClick={() => {
                if (sectionOffset < (sections.length - 1)) { globalStateStore.update({sectionOffset: sectionOffset + 1});}
              }}
            />
          </animated.group>

        </MenuBar>
      </group>
    </Fragment>
  );
}

export default CanvasMain;