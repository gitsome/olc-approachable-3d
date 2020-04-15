import React, { Fragment, useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, CanvasContext, useThree } from 'react-three-fiber';

import fonts from '../fonts/fonts';

import Box from '../components/Box';

const RouteQuiz: React.FC = () => {

  const [opts, setOpts] = useState({
    font: "Philosopher",
    fontSize: 0.7,
    color: "gray",
    maxWidth: 10,
    lineHeight: 1,
    letterSpacing: 0,
    textAlign: "justify",
    materialType: "MeshPhongMaterial"
  });

  return (
    <Fragment>
      <textMesh
          position={[0, 2, -5]}
          {...opts}
          font={fonts['Roboto']}
          text={'Quiz'}
          anchor={[0.5, 0.5]}
        >
          <meshPhongMaterial attach="material" color={opts.color} />
      </textMesh>
      {/* <Box position={[3, 0, -5]} /> */}
    </Fragment>
  )
};

export default RouteQuiz;