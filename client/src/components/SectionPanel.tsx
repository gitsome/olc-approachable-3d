import React, { useRef, useState, Children } from 'react';
import * as THREE from 'three';
import { useSpring, animated } from 'react-spring/three';
import fonts from '../fonts/fonts';

interface ISectionPanelProps {
  children?: React.ReactNode;
  text: string;
  hide: boolean;
  selected: boolean;
  position?: THREE.Vector3;
  width?: number;
  height?: number;
  onDownChanged?: (isDown: boolean) => void;
}

const SectionPanel: React.FC<ISectionPanelProps> = ({
  text='',
  position=new THREE.Vector3(0,0,0),
  width=1.3,
  height=0.6,
  hide,
  selected,
  onDownChanged= () => {}
}) => {

  // This reference will give us direct access to the mesh
  const mesh = useRef<THREE.Mesh>();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [down, setDown] = useState(false);

  const [opts, setOpts] = useState({
    fontSize: 0.14,
    maxWidth: width * 0.75,
    letterSpacing: 0,
    textAlign: "center",
    materialType: "MeshPhongMaterial"
  });

  const { opacity, scale } = useSpring({
    opacity: hide ? 0.5 : 1,
    config: { mass: 1, tension: 280, friction: 120, precision: 0.00001, duration: 300 }
  });

  const updateDown = (newDownValue: boolean) => {
    onDownChanged(newDownValue);
    setDown(newDownValue);
  };

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onPointerOver={(e: any) => { setHover(true); }}
        onPointerOut={(e: any) => { setHover(false); updateDown(false); }}
        onPointerDown={(e: any) => { updateDown(true); }}
        onPointerUp={(e: any) => { updateDown(false); }}
      >
        <planeGeometry attach="geometry" args={[width, height, 1]} />
        <animated.meshPhongMaterial attach="material" color={down ? '#DDDDDD' : (hovered ? '#DDDDDD' : '#FFFFFF')} opacity={opacity} transparent={true}/>
      </mesh>
      <textMesh
          position={[0, 0, 0.01]}
          {...opts}
          font={fonts.Roboto}
          text={text}
          anchor={[0.5, 0.5]}
      >
        <meshBasicMaterial attach="material" color={'#333333'}/>
      </textMesh>
    </group>
  )
};

export default SectionPanel;