import React, { useEffect, Fragment } from 'react';
import useGlobal from '../globalState/global';
import { useParams } from 'react-router-dom';
import Section from '../classes/Section';

const RouteItem = (props: any) => {

  const { itemId, sectionId } = useParams();

  const [ { sections }, globalStateService ] = useGlobal();

  useEffect(() => {

    const matchingSection = sections.find((section: Section) => section.id === sectionId);

    if (matchingSection === undefined) {
      globalStateService.update({currentView: 'item', currentItemId: itemId });
    } else {
      const sectionIndex = sections.indexOf(matchingSection);
      globalStateService.update({currentView: 'item', currentItemId: itemId, currentSection: matchingSection, sectionOffset: sectionIndex });
    }

  }, []);

  return (<Fragment></Fragment>);
};

export default RouteItem;
