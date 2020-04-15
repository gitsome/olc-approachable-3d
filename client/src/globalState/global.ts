import StateStore from '../classes/StateStore';
import { useState, useEffect } from 'react';

interface IUserData {
  [key: string]: any;
}

export type GlobalState = {
  userData: IUserData | null;
  currentView: string;
  rotateLeftActive: boolean;
  rotateRightActive: boolean;
  autoRotateActive: boolean;
};

const globalStateStore = new StateStore({
  userData: null,
  currentView: 'library',
  rotateLeftActive: false,
  rotateRightActive: false,
  autoRotateActive: false
});

const useGlobal = () => {

  const [globalState, setGlobalState] = useState(globalStateStore.get());

  const onStateStoreUpdated = () => {
    setGlobalState(globalStateStore.get());
  };

  useEffect(() => {

    globalStateStore.on('update', onStateStoreUpdated);

    return () => {
      globalStateStore.off('update', onStateStoreUpdated);
    };

  }, []);

  return [ globalState, globalStateStore ];
};

export default useGlobal;
