import './App.scss';
import React, { Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useSpring, animated } from 'react-spring/three';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { extend, Canvas } from 'react-three-fiber';
import { TextMesh } from 'troika-3d-text/dist/textmesh-standalone.umd.js';

import { useParams} from "react-router";

import useGlobal from './globalState/global';

import GlobalSetup from './components/GlobalSetup';

import MenuBar from './components/MenuBar';
import RoundButton from './components/RoundButton';

import ItemRoom from './rooms/ItemRoom';
import LibraryRoom from './rooms/LibraryRoom';

import fonts from './fonts/fonts';

extend({ TextMesh });

const libraryButtonPosition = new THREE.Vector3(-0.37, 0, 0);
const rotateLeftButtonPosition = new THREE.Vector3(-0.13, 0, 0);
const rotateButtonPosition = new THREE.Vector3(0, 0, 0);
const rotateRightButtonPosition = new THREE.Vector3(0.13, 0, 0);

const sectionLeftButtonPosition = new THREE.Vector3(-0.32, 0, 0);
const sectionRightButtonPosition = new THREE.Vector3(0.32, 0, 0);

const itemRoomPosition = [0, 8, 0];

const App: React.FC = () => {

  const [ view, setView ] = useState('library');

  const [ { userData, autoRotateActive, currentView }, globalStateStore ] = useGlobal();

  const { pos, ...props } = useSpring({
    pos: currentView === 'library' ? [0, 0, 0] : [0, -8, 0],
    config: { mass: 1, tension: 280, friction: 120, precision: 0.00001 }
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

  return (
    <div className="app">

      <Canvas vr
        pixelRatio={window.devicePixelRatio}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%"
        }}
      >

        <GlobalSetup />

        <mesh
          position={new THREE.Vector3(0, 0, 0)}
          rotation={new THREE.Euler(0, 0, 0)}
          geometry={new THREE.SphereGeometry(0.25, 16, 16)}
          material={new THREE.MeshPhongMaterial({ color: new THREE.Color('hotpink'), transparent: true })}
        />

        <Suspense fallback={null}>

          <BrowserRouter>

            <animated.group position={pos}>
              <group position={itemRoomPosition}>
                <ItemRoom itemId={4} />
              </group>

              <LibraryRoom />
            </animated.group>

            <group>
              <mesh>
                <cylinderBufferGeometry attach="geometry" args={[3, 3, 0.5, 33]}/>
                <meshPhongMaterial attach="material" color={"#AAAAAA"}/>
              </mesh>
              <MenuBar width={1.0}>

                <animated.group scale={itemRoomMenu.scale} position={itemRoomMenu.pos} opacity={itemRoomMenu.opacity}>
                  <RoundButton position={libraryButtonPosition} fontPath={fonts.FontAwesome} paddingBottom={0.007} width={0.15} text="&#xf66f;" onDownChanged={(newVal) => { if (newVal) { globalStateStore.update({currentView: currentView === 'library' ? 'item' : 'library'}); }}}/>
                  <RoundButton position={rotateLeftButtonPosition} fontPath={fonts.FontAwesome} paddingBottom={0.007} width={0.12} text="&#xf0e2;" fontScale={0.65} onDownChanged={(newVal) => { globalStateStore.update({rotateLeftActive: newVal}); }} />
                  <RoundButton position={rotateButtonPosition} selected={autoRotateActive} onSelectChange={(newVal) => { globalStateStore.update({autoRotateActive: newVal}); }} fontPath={fonts.FontAwesome} paddingBottom={0.007} width={0.12} text="&#xf021;" />
                  <RoundButton position={rotateRightButtonPosition} fontPath={fonts.FontAwesome} paddingBottom={0.007} width={0.12} text="&#xf01e;" fontScale={0.65} onDownChanged={(newVal) => { globalStateStore.update({rotateRightActive: newVal}); }} />
                </animated.group>

                <animated.group scale={libraryRoomMenu.scale} position={libraryRoomMenu.pos} opacity={libraryRoomMenu.opacity}>
                  <RoundButton position={sectionLeftButtonPosition} fontPath={fonts.FontAwesome} paddingBottom={0.007} width={0.25} text="&#xf060;" onDownChanged={(newVal) => { if (newVal) { globalStateStore.update({currentView: currentView === 'library' ? 'item' : 'library'}); }}}/>
                  <RoundButton position={sectionRightButtonPosition} fontPath={fonts.FontAwesome} paddingBottom={0.007} width={0.25} text="&#xf061;" onDownChanged={(newVal) => { globalStateStore.update({rotateLeftActive: newVal}); }} />
                </animated.group>

              </MenuBar>
            </group>


            {/* <Switch>
              <Route path="/item/:itemId">
                <RouteItem />
              </Route>
              <Route path="/library">
                <RouteLibrary />
              </Route>
              <Route path="/quiz/course/:courseId">
                <RouteQuiz />
              </Route>
              <Route path="/quiz/course/:courseId/section/:sectionId">
                <RouteQuiz />
              </Route>
              <Route path="/quiz/item/:itemId">
                <RouteQuiz />
              </Route>
            </Switch> */}
          </BrowserRouter>

        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
