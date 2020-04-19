import React, { useEffect, Fragment } from 'react';
import useGlobal from '../globalState/global';
import { useParams } from 'react-router-dom';
import Section from '../classes/Section';

const RouteSection = (props: any) => {

  const { sectionId } = useParams();

  const [ { sections }, globalStateService ] = useGlobal();

  useEffect(() => {

    const matchingSection = sections.find((section: Section) => section.id === sectionId);

    if (matchingSection === undefined) {
      globalStateService.update({currentView: 'library'});
    } else {
      const sectionIndex = sections.indexOf(matchingSection);
      globalStateService.update({currentView: 'library', currentSection: matchingSection, sectionOffset: sectionIndex });
    }

  }, []);

  return (<Fragment></Fragment>);
};

export default RouteSection;
