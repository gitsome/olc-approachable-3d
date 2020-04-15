import React, { useRef, useState } from 'react';
import { useFrame } from 'react-three-fiber';
import * as THREE from 'three';

interface IAnnotationPointProps {
  children?: React.ReactNode;
  position: THREE.Vector3;
  color?: string | null;
  highlightColor?: string;
  scale?: number;
  selected?: boolean;
  rotate?: boolean;
  onSelectedChange?: (newSelectedValue: boolean) => void;
}

const AnnotationPoint: React.FC<IAnnotationPointProps> = ({
  position,
  scale = 1,
  color = null,
  highlightColor = null,
  rotate = true,
  selected = false,
  onSelectedChange = () => {}
}) => {

  color = color || '#CCCCCC'
  highlightColor = highlightColor || '#007bff';

  // This reference will give us direct access to the mesh
  const pointRef = useRef<THREE.Mesh>();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [down, setDown] = useState(false);

  useFrame(() => {
    if (rotate && pointRef && pointRef.current) {
      pointRef.current.rotation.z = pointRef.current.rotation.y = pointRef.current.rotation.y - 0.01;
    }
  });

  const updateDown = (newDownValue: boolean) => {
    setDown(newDownValue);
  };

  return (
    <mesh
      position={position}
      ref={pointRef}
      scale={selected ? [1.5 * scale, 1.5 * scale, 1.5 * scale] : [scale, scale, scale]}
      onPointerOver={(e: any) => { setHover(true); }}
      onPointerOut={(e: any) => { setHover(false); updateDown(false); }}
      onPointerDown={(e: any) => { updateDown(true); onSelectedChange(!selected); }}
      onPointerUp={(e: any) => { updateDown(false); }}
    >
      <octahedronBufferGeometry attach="geometry" args={[0.07, 1]}/>
      <meshPhongMaterial attach="material" color={selected ? highlightColor : (hovered ? highlightColor : color)} flatShading={true}/>
    </mesh>
  )
};

export default AnnotationPoint;