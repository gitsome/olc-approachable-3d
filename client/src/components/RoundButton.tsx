import React, { useRef, useState, Children } from 'react';
import * as THREE from 'three';

import fonts from '../fonts/fonts';

const createBoxWithRoundedEdges = ( width: number, height: number, depth: number, radius0: number, smoothness: number ): THREE.ExtrudeBufferGeometry => {

  let eps = 0.00001;
  let radius = radius0 - eps;

  let shape = new THREE.Shape();
  shape.absarc( eps, eps, eps, -Math.PI / 2, -Math.PI, true );
  shape.absarc( eps, height -  radius * 2, eps, Math.PI, Math.PI / 2, true );
  shape.absarc( width - radius * 2, height -  radius * 2, eps, Math.PI / 2, 0, true );
  shape.absarc( width - radius * 2, eps, eps, 0, -Math.PI / 2, true );

  let geometry = new THREE.ExtrudeBufferGeometry( shape, {
    depth: depth - radius0 * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius0,
    curveSegments: smoothness
  });

  geometry.center();
  return geometry;
};

interface IButtonProps {
  children?: React.ReactNode;
  text: string;
  position?: THREE.Vector3;
  rotation?: THREE.Vector3;
  width?: number;
  height?: number;
  fontScale?: number;
  paddingTop?: number;
  paddingBottom?: number;
  depth?: number;
  radius?: number;
  smoothness?: number;
  color?: string;
  hoverColor?: string;
  activeColor?: string;
  downColor?: string;
  fontPath?: string;
  selected?: boolean;
  onSelectChange?: (selected: boolean) => void;
  onDownChanged?: (isDown: boolean) => void;
}

const RoundButton: React.FC<IButtonProps> = ({
  text='',
  position=new THREE.Vector3(0,0,0),
  rotation=new THREE.Vector3(0,0,0),
  width=0.5,
  height=0.1,
  fontScale=1,
  paddingTop=0.01,
  paddingBottom=0.01,
  depth=0.02,
  radius=0.01,
  smoothness=2,
  color='#333333',
  hoverColor='#007bff',
  activeColor='#004a99',
  downColor='#000000',
  fontPath=fonts.Roboto,
  selected=false,
  onSelectChange= () => {},
  onDownChanged= () => {}
}) => {

  // This reference will give us direct access to the mesh
  const mesh = useRef<THREE.Mesh>();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [down, setDown] = useState(false);

  const [ buttonGeometry ] = useState<THREE.ExtrudeBufferGeometry>(createBoxWithRoundedEdges(width, height, depth, radius, smoothness));

  const [opts, setOpts] = useState({
    fontSize: (height - paddingTop - paddingBottom) * 0.5 * fontScale,
    color: "white",
    maxWidth: 10,
    letterSpacing: 0,
    textAlign: "justify",
    materialType: "MeshPhongMaterial"
  });

  const updateDown = (newDownValue: boolean) => {
    onDownChanged(newDownValue);
    setDown(newDownValue);
  };

  return (
    <group position={position}>
      <mesh
        geometry={buttonGeometry}
        ref={mesh}
        onPointerOver={(e: any) => { setHover(true); }}
        onPointerOut={(e: any) => { setHover(false); updateDown(false); }}
        onPointerDown={(e: any) => { updateDown(true); onSelectChange(!selected); }}
        onPointerUp={(e: any) => { updateDown(false); }}
      >
        <meshBasicMaterial attach="material" color={selected ? activeColor: (down ? downColor : (hovered ? hoverColor : color))} />
      </mesh>
      <textMesh
          position={[0, paddingBottom, depth / 2 + 0.001]}
          {...opts}
          font={fontPath}
          text={text}
          anchor={[0.5, 0.5]}
      >
        <meshPhongMaterial attach="material" color={opts.color} />
      </textMesh>
    </group>
  )
};

export default RoundButton;