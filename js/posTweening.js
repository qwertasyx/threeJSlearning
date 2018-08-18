///////////////////////
/// THREE.js Vars   ///
///////////////////////
var cameraVisu, cameraOrth, scene, sceneAni, renderer, renderer2, r2context, controls;
var cube,cube2,gridHelper, bgmesh;
var AOmaterial, AOtexture, texture1, texture2, videoTexture
var pixelMesh, axes;
var textures = []
//tweens
var t1,t2,t3,t4,t1r,t2r
var tweenPos = { startVal:-100,endVal:100,pos:0,func:'Exponential',dir:'In'} // 0 -> 1 
///////////////////////
/// stats           ///
///////////////////////
var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

///////////////////////
/// HardwareSpecific///
///////////////////////
var sizeRenderCanvas = {w:130,h:90}
var pixels =[]
var i,j;
for (i = 8; i > 0; i--) { 
  for (j = 1; j < 13; j++) { 
    pixels.push({x:j*10,y:i*10,z:0,real:null, ani:null})    
  }  
}
var pixelValues = new Uint8Array(sizeRenderCanvas.w * sizeRenderCanvas.h * 4);

var bytearray = new Uint8Array(97);
bytearray[0] = 96; // amount of mapped LED´s

//////////////////////////////
/// Puplic Var for dat.GUI ///
/////////////////////////////
var dots = {visible:true};
var lsScale = {x:1,y:1,z:1};
var device = {connection:false,socket:null}
var pixelpicker = {x:0,y:0,c:{r:0,g:0,b:0}}
/////////////////////
///   on LOAD    ///
////////////////////
$( window ).on( "load", function() {
  
  /////////////////////
  ///  dat.GUI     ///
  ////////////////////
  gui = new dat.GUI(  );
  gui.domElement.id = 'gui';

  var f1 = gui.addFolder('Cube pos');    
    f1.add(cube.position, 'x', -500, 500);
    f1.add(cube.position, 'y', -500, 500);
    f1.add(cube.position, 'z', -500, 500);
  f1.open(); 

  var f1 = gui.addFolder('Cube rot');
    f1.add(cube, 'vrz', -0.5, 0.5);
    f1.add(cube.rotation, 'x', -2, 2);
    f1.add(cube.rotation, 'y', -2, 2);
    f1.add(cube.rotation, 'z', -2, 2);
  f1.open(); 

  var f1 = gui.addFolder('Cube scale');
    f1.add(cube.scale, 'x', 1, 20);
    f1.add(cube.scale, 'y', 1, 20);
    f1.add(cube.scale, 'z', 1, 20);
  f1.open(); 

  var f1 = gui.addFolder('Tween Pos');
    f1.add(tweenPos, 'func',[ 'Exponential', 'Bounce', 'Elastic' ] );
    f1.add(tweenPos, 'dir', [ 'In', 'Out', 'InOut' ] );
    
    var fpos = f1.add(tweenPos, 'pos', 0, 1).step(0.01);
    f1.add(tweenPos, 'startVal', -100,0).step(1)
    f1.add(tweenPos, 'endVal',   0, 100).step(1)
  f1.open();



  var f6 = gui.addFolder('Camera');
    var f6c = f6.add(cameraVisu, 'type',[ 'PerspectiveCamera', 'OrthographicCamera']);
  f6.open();
  var f7 = gui.addFolder('Helper');
    f7.add(axes, 'visible');

  fpos.onChange(function(value) {  
    var x = TWEEN['Easing'][this.object.func][this.object.dir](value)
    // var x = window["TWEEN"]["Easing"][this.object.func][this.object.dir](value);
    // var x = TWEEN.Easing.Bounce.InOut(value);
    cube.position.x = this.object.startVal + ((this.object.endVal - this.object.startVal)*x);

  });
  

  f6c.onChange(function(value) {
    var canvas = document.getElementById("renderCanvas1")
    if (cameraVisu instanceof THREE.PerspectiveCamera) {      
      cameraVisu = new THREE.OrthographicCamera(-canvas.width/8, canvas.width/8,canvas.height/8, -canvas.height/8 , -1000, 1000 );
      initCameraOrth();      
      this.perspective = "Orthographic";
    } else {
      scene.rotation.x = 0
      cameraVisu = new THREE.PerspectiveCamera( 75, canvas.width/canvas.height , 0.1, 1000 );
      initCameraPersp();

      this.perspective = "Perspective";
    }
  });
});

////////////////////
///   functions  ///
////////////////////
 
function init() {

	scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x000000 );
  
  //objects
	var geometry = new THREE.BoxGeometry( 10, 10, 10 );
	var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  cube = new THREE.Mesh( geometry, material );
  cube.vrz = 0;
  scene.add( cube );


  // axes
  axes = new THREE.AxesHelper( 100 )
  scene.add( axes );
  // grid

  gridHelper = new THREE.GridHelper( 1000, 100,'#110000','#111111' );  
  gridHelper.rotation.x=Math.PI / 2
  // gridHelper.position.z= -0.5
  // sceneAni.add(  gridHelper );
 
	renderer = new THREE.WebGLRenderer({ canvas: renderCanvas1 , antialias:true });
  renderer.setSize( window.innerWidth, 500 );
 
  // controls + camera
  var canvas = document.getElementById("renderCanvas1")
  cameraVisu = new THREE.PerspectiveCamera( 75, window.innerWidth/500, 0.1, 1000 );
  initCameraPersp();
 
  t1 = new TWEEN.Tween(cube.position);
  // t1 = new TWEEN.Tween(cube2.position);
  t2 = new TWEEN.Tween(cube.position);
  t3 = new TWEEN.Tween(cube2.position);
  // t4 = new TWEEN.Tween(cube2.position);
  // t1r = new TWEEN.Tween(cube2.rotation);
  // t2r = new TWEEN.Tween(cube2.rotation);
  t1.to({ x: -100 ,y: 0 }, 0);
  t2.to({ x: 100 ,y: 0 }, 3000).easing(TWEEN.Easing.Bounce.InOut);
  t3.to({x:0},1000).easing(TWEEN['Easing']['Bounce']['Out'])
  // t3.to({ x: -20 ,y: 45 }, 1000);
  // t4.to({ x: 150 ,y: 45 }, 1000);
  // t1r.to({ z: Math.PI  }, 1000);
  // t2r.to({ z: 0  }, 1000);

   t1.chain(t2)
  // t2.chain(t3)
  // t3.chain(t4,t2r)
  // t4.chain(t1)
  // t1.start();
} 
function animate() {
  stats.begin();
  requestAnimationFrame( animate );
  TWEEN.update();

  cube.rotation.z += cube.vrz;
  
  renderer.render( scene, cameraVisu );
  
  stats.end();
}

/// camerastuff ///
function initCameraPersp(){    
  controls  = new THREE.OrbitControls( cameraVisu, document.getElementById("renderCanvas1"));      
  cameraVisu.position.set(100,100,150);
  controls.target.x = 100
  controls.target.y = 0
  controls.target.z = 0
  controls.update()
}
function initCameraOrth(){  
  controls  = new THREE.OrbitControls( cameraVisu, document.getElementById("renderCanvas1"));
  // controls.enableRotate = false
  cameraVisu.position.set(0,0,100);
  controls.target.x = 0
  controls.target.y = 0
  controls.target.z = 0
  controls.update()
}
////////////////////
///   init       ///
////////////////////

init();
animate();