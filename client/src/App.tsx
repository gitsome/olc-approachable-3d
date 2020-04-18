import './App.scss';
import React, { Fragment, useEffect } from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { extend } from 'react-three-fiber';
import { TextMesh } from 'troika-3d-text/dist/textmesh-standalone.umd.js';

import useGlobal from './globalState/global';

import RouteLibrary from './routes/RouteLibrary';
import RouteItem from './routes/RouteItem';

import CanvasRoot from './components/CanvasRoot';

extend({ TextMesh });

const App: React.FC = () => {

  const [{
    isStateLoaded
  }, globalStateStore ] = useGlobal();

  useEffect(() => {
    // load state from server
    fetch(`/api/user`).then((resp) => {
      return resp.json();
    }).then((userData) => {
      console.log("userData:", userData);
      globalStateStore.update({sections: userData.sections, isStateLoaded: true});
    });
  }, []);

  return (
    <div className="app">

      { !isStateLoaded && (
        <div>loading...</div>
      )}

      { isStateLoaded && (
        <Fragment>

          <CanvasRoot/>

          <BrowserRouter>
            <Switch>
              <Route path="/section/:sectionId/item/:itemId">
                <RouteItem />
              </Route>
              <Route component={RouteLibrary} />
            </Switch>
          </BrowserRouter>

        </Fragment>
      )}

    </div>
  );
}

export default App;
