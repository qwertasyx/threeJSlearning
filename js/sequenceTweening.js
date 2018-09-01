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
/// sequence           ///
///////////////////////
var sequence1 = []
sequence1.push(
  { type:     'Init',
    t: 0,
    easing:   
    {
      func:'Linear',
      dir:'None'
    },
    position: {x:0,y:0,z:50},
    scale: {x:1,y:1},
    rotation: {x:0,y:0,z:0},
    color: {r:1,g:1,b:1}    
  }
)
sequence1.push(
  { type:     'Trans',
    t: 1000,
    easing:   
      {
        func:'Linear',
        dir:'None'
      },    
    position: {x:100,y:0,z:0},
    scale: {x:1,y:1},
    rotation: {x:0,y:0,z:0},
    color: {r:0,g:1,b:0}    
  }
)
sequence1.push(
  { type:     'Trans',
    t: 1000,
    easing:   
      {
        func:'Linear',
        dir:'None'
      },    
    position: {x:0,y:100,z:0},
    scale: {x:0.5,y:5},
    rotation: {x:0,y:0,z:0},
    color: {r:1,g:0,b:0}    
  }
)


var sequence2 = []
sequence2.push(
  { type:     'Init',
    t: 0,
    easing:   
    {
      func:'Linear',
      dir:'None'
    },
    position: {x:0,y:0,z:0},
    scale: {x:1,y:1},
    rotation: {x:0,y:0,z:0},
    color: {r:1,g:1,b:1}    
  }
)
sequence2.push(
  { type:     'Trans',
    t: 1000,
    easing:   
      {
        func:'Circular',
        dir:'InOut'
      },    
    position: {x:100,y:0,z:50},
    scale: {x:1,y:1},
    rotation: {x:0,y:0,z:0},
    color: {r:1,g:1,b:0}    
  }
)
sequence2.push(
  { type:     'Trans',
    t: 750,
    easing:   
      {
        func:'Linear',
        dir:'None'
      },    
    position: {x:0,y:100,z:0},
    scale: {x:0.5,y:5},
    rotation: {x:0,y:0,z:0},
    color: {r:1,g:0,b:1}    
  }
)
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
    f1.add(cube1.position, 'x', -500, 500);
    f1.add(cube1.position, 'y', -500, 500);
    f1.add(cube1.position, 'z', -500, 500);
  f1.open(); 

  var f1 = gui.addFolder('Cube rot');
    f1.add(cube1.rotation, 'x', -2, 2);
    f1.add(cube1.rotation, 'y', -2, 2);
    f1.add(cube1.rotation, 'z', -2, 2);
  f1.open(); 

  var f1 = gui.addFolder('Cube scale');
    f1.add(cube1.scale, 'x', 1, 20);
    f1.add(cube1.scale, 'y', 1, 20);
    f1.add(cube1.scale, 'z', 1, 20);
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
var tweens = [null,null]
$( document ).ready(function() {
  console.log( "ready!" );
  $('#start').on('click',function(e){
    InitPos();
    // setInitPos(cube1,sequence1)    
    tweens[0].start()
    // setInitPos(cube2,sequence2)
    tweens[1].start()
  })
  $('#build').on('click',function(e){
    
    tweens[0] = buildTweenSequernce(cube1,sequence1,true)
    tweens[1] = buildTweenSequernce(cube2,sequence2,true)
  })
  $('#stop').on('click',function(e){
    var tweens = TWEEN.getAll()
    tweens.forEach(function(t) {
      t.stop()
    });    
  })
});
////////////////////
///   functions  ///
////////////////////
 
function init() {

	scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x000000 );
  
  //objects
	var geometry1 = new THREE.BoxGeometry( 10, 10, 10 );
	var material1 = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  cube1 = new THREE.Mesh( geometry1, material1 );
  scene.add( cube1 );
  var geometry2 = new THREE.BoxGeometry( 10, 10, 10 );
	var material2 = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  cube2 = new THREE.Mesh( geometry2, material2 );
  scene.add( cube2 );


  // axes
  axes = new THREE.AxesHelper( 100 )
  scene.add( axes );
  // grid

  gridHelper = new THREE.GridHelper( 1000, 100,'#110000','#111111' );  
  gridHelper.rotation.x=Math.PI / 2
 
	renderer = new THREE.WebGLRenderer({ canvas: renderCanvas1 , antialias:true });
  renderer.setSize( window.innerWidth, 500 );
 
  // controls + camera
  var canvas = document.getElementById("renderCanvas1")
  cameraVisu = new THREE.PerspectiveCamera( 75, window.innerWidth/500, 0.1, 1000 );
  initCameraPersp();
} 
function animate() {
  stats.begin();
  requestAnimationFrame( animate );
  TWEEN.update();
  
  renderer.render( scene, cameraVisu );
  
  stats.end();
}
function setInitPos(obj,sequence){
  // console.log(obj,sequence);
  obj.position.x = sequence[0].position.x;
  obj.position.y = sequence[0].position.y;
  obj.position.z = sequence[0].position.z;

  obj.scale.x = sequence[0].scale.x;
  obj.scale.y = sequence[0].scale.y;
  
  obj.rotation.z = sequence[0].rotation.z;

  obj.material.color.r = sequence[0].color.r;
  obj.material.color.g = sequence[0].color.g;
  obj.material.color.b = sequence[0].color.b;
}
function InitPos(){
  cube1.position.x = sequence1[0].position.x;
  cube1.position.y = sequence1[0].position.y;
  cube1.position.z = sequence1[0].position.z;

  cube1.scale.x = sequence1[0].scale.x;
  cube1.scale.y = sequence1[0].scale.y;

  cube1.rotation.z = sequence1[0].rotation.z;

  cube1.material.color.r = sequence1[0].color.r;
  cube1.material.color.g = sequence1[0].color.g;
  cube1.material.color.b = sequence1[0].color.b;
  ///
  cube2.position.x = sequence2[0].position.x;
  cube2.position.y = sequence2[0].position.y;
  cube2.position.z = sequence2[0].position.z;

  cube2.scale.x = sequence2[0].scale.x;
  cube2.scale.y = sequence2[0].scale.y;

  cube2.rotation.z = sequence2[0].rotation.z;

  cube2.material.color.r = sequence2[0].color.r;
  cube2.material.color.g = sequence2[0].color.g;
  cube2.material.color.b = sequence2[0].color.b;
}
function buildTweenSequernce(obj,sequence,endless){
  var baseTween = new TWEEN.Tween();
  baseTween._duration=0;
  var lastTween = baseTween;
  sequence.forEach(function(seq){
    // if (seq.type=="Init") {
    //   return true
    // }
    var positionTween = new TWEEN.Tween(obj.position);
    var rotationTween = new TWEEN.Tween(obj.rotation);
    var scalingTween  = new TWEEN.Tween(obj.scale);
    var colorTween    = new TWEEN.Tween(obj.material.color);

    positionTween.to({ x:seq.position.x ,y:seq.position.y,z:seq.position.z           } , seq.t ).easing(TWEEN['Easing'][seq.easing.func][seq.easing.dir]);
    rotationTween.to({ z:seq.rotation.z                             } , seq.t ).easing(TWEEN['Easing'][seq.easing.func][seq.easing.dir]);
    scalingTween.to( { x:seq.scale.x ,y:seq.scale.y                 } , seq.t ).easing(TWEEN['Easing'][seq.easing.func][seq.easing.dir]);
    colorTween.to(   { r:seq.color.r ,g:seq.color.g, b:seq.color.b  } , seq.t ).easing(TWEEN['Easing'][seq.easing.func][seq.easing.dir]);
    
    lastTween.chain(positionTween,rotationTween,scalingTween,colorTween)
    // colorTween is the basetween for the next
    lastTween = colorTween;    
  });
  
  if(endless){
    if(lastTween._duration!=1000){
      var delayTween = new TWEEN.Tween();
      delayTween._duration=250;
      lastTween.chain(delayTween);
      lastTween=delayTween;
    }
    lastTween.onComplete(function(){
      // setInitPos(obj,sequence);
    });
    lastTween.chain(baseTween);
  }

  return baseTween
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