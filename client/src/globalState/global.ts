import StateStore from '../classes/StateStore';
import { useState, useEffect } from 'react';
import Section from '../classes/Section';

interface IUserData {
  [key: string]: any;
}

export type GlobalState = {
  isStateLoaded: boolean;
  userData: IUserData | null;
  currentSection: Section;
  currentItemId: string | null;
  currentView: string;
  rotateLeftActive: boolean;
  rotateRightActive: boolean;
  autoRotateActive: boolean;
  sectionOffset: number;
  sections: Section[];
  requestRecenter: boolean;
  isVR: boolean;
};

const globalStateStore = new StateStore({
  isStateLoaded: false,
  userData: null,
  currentSection: null,
  currentItemId: 5,
  currentView: 'library',
  rotateLeftActive: false,
  rotateRightActive: false,
  autoRotateActive: false,
  sectionOffset: 0,
  requestRecenter: false,
  isVR: false,
  sections: []
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
