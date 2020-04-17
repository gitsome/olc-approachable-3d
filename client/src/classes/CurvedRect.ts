import * as THREE from 'three';

class CurvedRect {

  public static generate = (height: number, radius: number, radians: number, width_segments = 2, height_segments = 1) => {

    const plane = new THREE.PlaneGeometry(1, height, width_segments, height_segments);

    const radiansStep = radians / width_segments;

    let currentRadians = 0;

    for(let i = 0; i < plane.vertices.length / 2; i = i + 1) {
      currentRadians = (i) * radiansStep;
      plane.vertices[i].x = plane.vertices[i + width_segments + 1].x = Math.sin(currentRadians) * radius;
      plane.vertices[i].z = plane.vertices[i + width_segments + 1].z = Math.cos(currentRadians) * radius;
    }

    plane.verticesNeedUpdate = true;
    plane.normalsNeedUpdate = true;
    plane.rotateY(Math.PI);

    return plane;
  }
}

export default CurvedRect;

