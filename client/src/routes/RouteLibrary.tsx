import React, { useEffect, Fragment } from 'react';
import useGlobal from '../globalState/global';

const RouteLibrary = (props: any) => {

  const [ globalState, globalStateService ] = useGlobal();

  useEffect(() => {
    globalStateService.update({currentView: 'library'});
  });

  return (<Fragment></Fragment>);
};

export default RouteLibrary;
