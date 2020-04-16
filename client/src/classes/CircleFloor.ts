import * as THREE from 'three';

class CircleFloor {

  public static generate = (width: number, height: number, depth: number, circleRadius: number) => {

    const halfWidth = width/2;
    const halfHeight = height/2;

    const outerShape = new THREE.Shape();
    outerShape.moveTo(halfWidth, 0);
    outerShape.absarc( 0, 0, halfWidth, 0, 2 * Math.PI, false );

    const innerShape = new THREE.Path();
    innerShape.moveTo(circleRadius, 0);
    innerShape.absarc( 0, 0, circleRadius, 0, 2 * Math.PI, false );

    outerShape.holes = [innerShape];

    const extrudeSettings = { depth: depth, bevelEnabled: false, bevelSegments: 1, steps: 2, bevelSize: 0.0010, bevelThickness: 0.001 };

    return new THREE.ExtrudeBufferGeometry( outerShape, extrudeSettings );
  }

}

export default CircleFloor;