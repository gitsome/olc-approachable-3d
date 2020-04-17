import StateStore from '../classes/StateStore';
import { useState, useEffect } from 'react';
import Section from '../classes/Section';

interface IUserData {
  [key: string]: any;
}

export type GlobalState = {
  userData: IUserData | null;
  currentSection: Section;
  currentItemId: string | null;
  currentView: string;
  rotateLeftActive: boolean;
  rotateRightActive: boolean;
  autoRotateActive: boolean;
  sectionOffset: number;
  sections: Section[];
};

const globalStateStore = new StateStore({
  userData: null,
  currentSection: null,
  currentItemId: 5,
  currentView: 'library',
  rotateLeftActive: false,
  rotateRightActive: false,
  autoRotateActive: false,
  sectionOffset: 0,
  sections: [
    {
      id: '1.1.1',
      name: 'Fungi',
      items: ['1', '5', '7']
    },
    {
      id: '4.1.5',
      name: 'Molecules',
      items: ['2']
    },
    {
      id: '3.1.5',
      name: 'Head Anatomy',
      items: ['3']
    }
  ]
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
