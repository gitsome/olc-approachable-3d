import React, { useRef, useState, Children } from 'react';
import * as THREE from 'three';

import fonts from '../fonts/fonts';

const createBoxWithRoundedEdges = ( width: number, height: number, flat: boolean, depth: number, radius0: number, smoothness: number ): THREE.ExtrudeBufferGeometry => {

  let eps = 0.00001;
  let radius = radius0 - eps;

  let shape = new THREE.Shape();
  shape.absarc( eps, eps, eps, -Math.PI / 2, -Math.PI, true );
  shape.absarc( eps, height -  radius * 2, eps, Math.PI, Math.PI / 2, true );
  shape.absarc( width - radius * 2, height -  radius * 2, eps, Math.PI / 2, 0, true );
  shape.absarc( width - radius * 2, eps, eps, 0, -Math.PI / 2, true );

  let geometry = new THREE.ExtrudeBufferGeometry( shape, {
    depth: depth - radius0 * 2,
    bevelEnabled: !flat,
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
  flat?: boolean;
  opacity?: number;
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
  onClick?: () => void;
  onSelectChange?: (selected: boolean) => void;
  onDownChanged?: (isDown: boolean) => void;
}

const RoundButton: React.FC<IButtonProps> = ({
  text='',
  flat=false,
  opacity=1,
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
  onClick=() => {},
  onSelectChange= () => {},
  onDownChanged= () => {}
}) => {

  // This reference will give us direct access to the mesh
  const mesh = useRef<THREE.Mesh>();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [down, setDown] = useState(false);

  const [ buttonGeometry ] = useState<THREE.ExtrudeBufferGeometry>(createBoxWithRoundedEdges(width, height, flat, depth, radius, smoothness));

  const fontSize = (height - paddingTop - paddingBottom) * fontScale;

  const [opts, setOpts] = useState({
    fontSize: fontSize,
    color: "white",
    maxWidth: width,
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
        onPointerDown={(e: any) => { updateDown(true); }}
        onPointerUp={(e: any) => { updateDown(false); onSelectChange(!selected); onClick(); }}
      >
        <meshBasicMaterial attach="material" color={selected ? activeColor: (down ? downColor : (hovered ? hoverColor : color))} opacity={opacity}/>
      </mesh>
      <textMesh
          position={[0, -height/2 + paddingBottom + fontSize / 2, depth / 2 + 0.001]}
          {...opts}
          font={fontPath}
          text={text}
          anchor={[0.5, 0.5]}
      >
        <meshPhongMaterial attach="material" color={opts.color} opacity={opacity} />
      </textMesh>
    </group>
  )
};

export default RoundButton;