import * as THREE from 'three';

class CircleFloor {

  public static generate = (outerRadius: number, innerRadius: number, depth: number) => {

    const outerShape = new THREE.Shape();
    outerShape.moveTo(outerRadius, 0);
    outerShape.absarc( 0, 0, outerRadius, 0, 2 * Math.PI, false );

    const innerShape = new THREE.Path();
    innerShape.moveTo(innerRadius, 0);
    innerShape.absarc( 0, 0, innerRadius, 0, 2 * Math.PI, false );

    outerShape.holes = [innerShape];

    const extrudeSettings = { depth: depth, bevelEnabled: false, bevelSegments: 1, steps: 1, bevelSize: 0.0010, bevelThickness: 0.001 };

    return new THREE.ExtrudeBufferGeometry( outerShape, extrudeSettings );
  }
}

export default CircleFloor;