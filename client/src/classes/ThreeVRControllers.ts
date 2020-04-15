import EventEmitter from 'events';
import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

const buildController = ( data: any ) => {

  switch ( data.targetRayMode ) {

    case 'tracked-pointer':

      const bufferGeometry = new THREE.BufferGeometry();
      bufferGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
      bufferGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );

      var material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );

      return new THREE.Line( bufferGeometry, material );

    case 'gaze':

      const geometry = new THREE.RingBufferGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
      const basicMaterial = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
      return new THREE.Mesh( geometry, basicMaterial );
  }
}

class ThreeVRControllers extends EventEmitter {

  private renderer: any;
  private scene: THREE.Scene;

  public controller1: any;
  private controllerGrip1: any;
  private controller1Ray: any;

  public controller2: any;
  private controllerGrip2: any;
  private controller2Ray: any;

  public selectedController: number | null = null;

  constructor (renderer: any, scene: THREE.Scene) {
    super();
    this.renderer = renderer;
    this.scene = scene;
    this.initialize();
  }

  private initialize () {

    const onSelectStart = (event: any, controllerNumber: number) => {

      this.selectedController = controllerNumber;

      if (controllerNumber === 1) {
        this.controller1Ray.visible = true;
        this.controller2Ray.visible = false;
      } else {
        this.controller1Ray.visible = false;
        this.controller2Ray.visible = true;
      }

      this.emit('onSelectStart');
    };

    const onSelectEnd = () => {
      this.emit('onSelectEnd');
    };

    const onSelect = () => {
      this.emit('onSelect');
    };

    this.controller1 = this.renderer.xr.getController( 0 );
    this.controller1.addEventListener( 'selectstart', (e: any) => { onSelectStart(e, 1); } );
    this.controller1.addEventListener( 'selectend', onSelectEnd );
    this.controller1.addEventListener( 'select', onSelect );
    this.controller1.addEventListener( 'connected', function ( event: any ) {
      // @ts-ignore
      this.add( buildController( event.data ) );
    });

    this.controller1.addEventListener( 'disconnected', function () {
      // @ts-ignore
      this.remove( this.children[ 0 ] );
    });

    this.scene.add( this.controller1 );

    this.controller2 = this.renderer.xr.getController( 1 );
    this.controller2.addEventListener( 'selectstart', (e: any) => { onSelectStart(e, 2); } );
    this.controller1.addEventListener( 'selectend', onSelectEnd );
    this.controller2.addEventListener( 'select', onSelect );
    this.controller2.addEventListener( 'connected', function ( event: any ) {
      // @ts-ignore
      this.add( buildController( event.data ) );
    });
    this.controller2.addEventListener( 'disconnected', function () {
      // @ts-ignore
      this.remove( this.children[ 0 ] );
    });

    this.scene.add( this.controller2 );

    // The XRControllerModelFactory will automatically fetch controller models
    // that match what the user is holding as closely as possible. The models
    // should be attached to the object returned from getControllerGrip in
    // order to match the orientation of the held device.

    var controllerModelFactory = new XRControllerModelFactory();

    this.controllerGrip1 = this.renderer.xr.getControllerGrip( 0 );
    this.controllerGrip1.add( controllerModelFactory.createControllerModel( this.controllerGrip1 ) );

    const controller1RayGeometry = new THREE.CylinderBufferGeometry( 0.0001, 0.003, 2, 3);
    controller1RayGeometry.translate(-0.01, 1.01, 0.0105);
    const controller1RayMaterial = new THREE.MeshBasicMaterial({color: '#0044FF'});
    this.controller1Ray = new THREE.Mesh( controller1RayGeometry, controller1RayMaterial );
    this.controller1Ray.rotateX(Math.PI / 4 - Math.PI);
    this.controller1Ray.visible = false;
    this.controllerGrip1.add(this.controller1Ray);

    this.scene.add( this.controllerGrip1 );

    this.controllerGrip2 = this.renderer.xr.getControllerGrip( 1 );
    this.controllerGrip2.add( controllerModelFactory.createControllerModel( this.controllerGrip2 ) );

    const controller2RayGeometry = new THREE.CylinderBufferGeometry( 0.001, 0.003, 2, 3);
    controller2RayGeometry.translate(0.01, 1.01, 0.0105);
    const controller2RayMaterial = new THREE.MeshBasicMaterial({color: '#0044FF'});
    this.controller2Ray = new THREE.Mesh( controller2RayGeometry, controller2RayMaterial );
    this.controller2Ray.rotateX(Math.PI / 4 - Math.PI);
    this.controller2Ray.visible = false;
    this.controllerGrip2.add(this.controller2Ray);

    this.scene.add( this.controllerGrip2 );
  }
}

export default ThreeVRControllers;