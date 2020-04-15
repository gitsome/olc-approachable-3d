import * as THREE from 'three';

class Frame {

  public static generateFrame = (width: number, height: number, depth: number, borderWidth: number) => {

    const outerShape = new THREE.Shape();

    const halfWidth = width/2;
    const halfHeight = height/2;

    outerShape.moveTo( -halfWidth, -halfHeight );
    outerShape.lineTo( -halfWidth, halfHeight );
    outerShape.lineTo( halfWidth, halfHeight );
    outerShape.lineTo( halfWidth, -halfHeight );
    outerShape.lineTo( -halfWidth, -halfHeight );

    const innerShape = new THREE.Path();
    innerShape.moveTo( -halfWidth + borderWidth, -halfHeight + borderWidth);
    innerShape.lineTo( -halfWidth + borderWidth, halfHeight - borderWidth);
    innerShape.lineTo( halfWidth - borderWidth, halfHeight - borderWidth );
    innerShape.lineTo( halfWidth - borderWidth, -halfHeight + borderWidth );
    innerShape.lineTo( -halfWidth + borderWidth, -halfHeight + borderWidth);

    outerShape.holes = [innerShape];

    const extrudeSettings = { amount: depth, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.0010, bevelThickness: 0.001 };

    return new THREE.ExtrudeBufferGeometry( outerShape, extrudeSettings );
  }

}


export default Frame;