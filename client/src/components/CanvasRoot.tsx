import React, { Suspense } from 'react';
import { Canvas } from 'react-three-fiber';
import CanvasMain from './CanvasMain';

const canvasStyle:React.CSSProperties = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%" };

const CanvasRoot = (props: any) => {

  return (
    <Canvas vr pixelRatio={window.devicePixelRatio} style={canvasStyle} >

      <Suspense fallback={null}>
        <CanvasMain />
      </Suspense>

    </Canvas>
  )
};

export default CanvasRoot;
