import './App.scss';
import React, { Suspense } from 'react';
import * as THREE from 'three';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { extend, Canvas } from 'react-three-fiber';
import { TextMesh } from 'troika-3d-text/dist/textmesh-standalone.umd.js';

import GlobalSetup from './components/GlobalSetup';

import ApplicationNavigation from './components/ApplicationNavigation';

import RouteItem from './routes/RouteItem';
import RouteLibrary from './routes/RouteLibrary';
import RouteQuiz from './routes/RouteQuiz';

extend({ TextMesh });


const App: React.FC = () => {

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
            <ApplicationNavigation />
            <Switch>
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
            </Switch>
          </BrowserRouter>

        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
