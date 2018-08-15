var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
var camera = new THREE.OrthographicCamera( -250,250, -250, 250, 1, 1000 );

// var controls = new THREE.TrackballControls( camera );
var renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true});
renderer.setSize( 500, 500 );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 100, 100, 100 );
var texture1 = new THREE.TextureLoader().load( 'img/test1.png' );
var texture2 = new THREE.TextureLoader().load( 'img/meme1.jpg' );

var material1 = new THREE.MeshBasicMaterial( { color: 0x00ee00 } );
var material2 = new THREE.MeshBasicMaterial( { color: 0xee0000 } );
var material3 = new THREE.MeshBasicMaterial( { color: 0x0000ee } );
var material4 = new THREE.MeshBasicMaterial( { map: texture1 } );
var material5 = new THREE.MeshBasicMaterial( { map: texture2 } );

var cube = new THREE.Mesh( geometry, material1 );
var red  = new THREE.Mesh( geometry, material2 );
var blue = new THREE.Mesh( geometry, material3 );

scene.add( cube );
scene.add( red );
scene.add( blue );
// var objects = []
// objects.push(red)
// objects.push(cube)
// objects.push(blue)
camera.position.z = 0;

// var controls = new THREE.DragControls( objects, camera, renderer.domElement );

var sequence = []
// sequence.push(
//   { type:     'init',
//     interp:   '-',
//     t: 0,
//     position: {x:0,y:0,z:0},
//     scale: {x:0,y:0},
//     rotation: {x:0,y:0,z:0},
//     color: {r:0,g:0,b:0}
//   }
// )
sequence.push(
  { type:     'trans',
    interp:   '-',
    t: 250,
    position: {x:-250,y:-250,z:0},
    scale: {x:1,y:1},
    rotation: {x:0,y:0,z:0},
    color: {r:1,g:1,b:1}
  }
)
sequence.push(
  { type:     'trans',
    interp:   '-',
    t: 2500,
    position: {x:-250,y:250,z:0},
    scale: {x:3,y:3},
    rotation: {x:0,y:0,z:-3.14},
    color: {r:1,g:1,b:1}
  }
)
sequence.push(
  { type:     'trans',
    interp:   '-',
    t: 2500,
    position: {x:250,y:250,z:0},
    scale: {x:1,y:1},
    rotation: {x:0,y:0,z:0},
    color: {r:0,g:1,b:0}
  }
)
//stats
var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

// tweening
var t1 = new TWEEN.Tween(cube.position);
var t2 = new TWEEN.Tween(cube.position);
var t3 = new TWEEN.Tween(cube.position);
var t4 = new TWEEN.Tween(cube.position);
t1.onUpdate(function(object) {
	console.log(object.x);
});
t1.to({ x: -200 ,y: -200 }, 0);
t2.to({ x: -200 ,y:  200 }, 1000).easing(TWEEN.Easing.Quadratic.Out);
t3.to({ x: 200  ,y:  200 }, 1000);
t4.to({ x: 200  ,y: -200 }, 1000);

var t5 = new TWEEN.Tween(cube.rotation);
var t6 = new TWEEN.Tween(cube.rotation);
t5.to({ z: 2 }, 1000);
t6.to({ z: 0 }, 1000);

var t7 = new TWEEN.Tween(cube.scale);
var t8 = new TWEEN.Tween(cube.scale);
t7.to({ x: 2  ,y: 2 }, 1000);
t8.to({ x: 1  ,y: 1 }, 1000);

t1.chain(t2,t7)
t2.chain(t3,t6,t8)
t3.chain(t4)

var t10 = new TWEEN.Tween(red.position);
t10.to({ x: -200 },1000).easing(TWEEN.Easing.Step.Out);
var t11 = new TWEEN.Tween(red.position);
t11.to({ x: 200 },1000).easing(TWEEN.Easing.Quadratic.InOut);
var t12 = new TWEEN.Tween(red.position);
t12.to({ x: -100 },1000).easing(TWEEN.Easing.Step.In);
t10.chain(t11)
t11.chain(t12)
t12.chain(t10)

// var m1 = new TWEEN.Tween(material);
// var m2 = new TWEEN.Tween(material);
// m1.to({ color:{r:1}} , 1000);
// m2.to({ color:{r:0}}, 1000);

// rdy
var supertween = null
$( document ).ready(function() {
  console.log( "ready!" );
  $('#start').on('click',function(e){
    // t1.start()
    blue.position.x  = 50
    blue.position.y  = -50
    blue.rotation.z   = 0
    blue.scale.x     = 1
    blue.scale.y     = 1
    blue.material.color.r = 0;
    blue.material.color.g = 0;
    blue.material.color.b = 1;
    supertween.start()
  })
  $('#build').on('click',function(e){
    // t1.start()
    supertween = buildTweenSequernce(blue,sequence,true)
  })
  $('#stop').on('click',function(e){
    var tweens = TWEEN.getAll()
    tweens.forEach(function(t) {
      t.stop()
    });    
  })
});
// load
var gui
// var position = {x:0,y:0}
$( window ).on( "load", function() {
  /// DAT GUI
  gui = new dat.GUI();
  var f1 = gui.addFolder('Position');
    f1.add(cube.position, 'x', -250, 250);
    f1.add(cube.position, 'y', -250, 250).listen();
  f1.open();

  var f2 = gui.addFolder('Scale');
    f2.add(cube.scale, 'x', 0, 10);
    f2.add(cube.scale, 'y', 0, 10);
  f2.open();
  var r = gui.addFolder('Rotation');
    r.add(cube.rotation, 'x', -10, 10)
    r.add(cube.rotation, 'y', -10, 10)
    r.add(cube.rotation, 'z', -10, 10)
    r.open()
  var c = gui.addFolder('color');
    c.add(cube.material.color, 'r', 0, 1)
    c.add(cube.material.color, 'g', 0, 1)
    c.add(cube.material.color, 'b', 0, 1)
    c.open()

  $('#test').on('click',function(e){
    gui.toggleHide()
  })
});

var gl = renderer.getContext()
var pixels = new Uint8Array(1 * 1 * 4);

function animate() {
  stats.begin();
  requestAnimationFrame( animate );
  TWEEN.update();
  renderer.clear();
  // controls.update();
  renderer.render( scene, camera );
  // gl.readPixels(250,10, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  // console.log(pixels)
  stats.end();
}
animate();

// functions

function buildTweenSequernce(obj,sequence,endless){
  //init step
  var baseTween     = new TWEEN.Tween(obj.position);
  // var rotationTween = new TWEEN.Tween(obj.rotation);
  // var scalingTween  = new TWEEN.Tween(obj.scale);
  // var colorTween    = new TWEEN.Tween(obj.material.color);
  
  baseTween.to({       } , 0 )
  // rotationTween.to({ z:0           } , 0 )
  // scalingTween.to( { x:1 ,y:1      } , 0 )
  // colorTween.to(   { r:0 ,g:0, b:0 } , 0 )

  // baseTween.chain(colorTween);

  var lastTween = baseTween;

  sequence.forEach(function(seq){

    var positionTween = new TWEEN.Tween(obj.position);
    var rotationTween = new TWEEN.Tween(obj.rotation);
    var scalingTween  = new TWEEN.Tween(obj.scale);
    var colorTween    = new TWEEN.Tween(obj.material.color);

    positionTween.to({ x:seq.position.x ,y:seq.position.y      } , seq.t )
    rotationTween.to({ z:seq.rotation.z           } , seq.t )
    scalingTween.to( { x:seq.scale.x ,y:seq.scale.y      } , seq.t )
    colorTween.to(   { r:seq.color.r ,g:seq.color.g, b:seq.color.b } , seq.t )
    lastTween.chain(positionTween,rotationTween,scalingTween,colorTween)
    // positiontween is the basetween for the next
    lastTween = positionTween;    
  });
  lastTween.onComplete(function(e){
    console.log('... done:' ,e)
    t1.start();
  });
  if(endless){
    lastTween.chain(baseTween)
  }
  return baseTween
}

// function setupTween() {
//   var tween = new TWEEN.Tween({x: 0, y: 1.25, z: 0, rot: 0}) // start values
//           .to({x: 5, y: 15, z: 0, rot: 2 * Math.PI}, 5000) // end values and time
//           .easing(TWEEN.Easing.Elastic.InOut)
//           .onUpdate(function () {
//               blue.position.set(this.x, this.y, this.z);
//               blue.rotation.set(this.rot, this.rot, this.rot);
//           })
//           .repeat(Infinity)
//           .yoyo(true)
//           .start();
//   return tween;
// }
// function setupTween(obj) {
//   var tween = new TWEEN.Tween({x: 0, y: 0, r: 0 ,sx:1,sy:1}) // start values
//           .to({x: -200, y: -200, r: 1,sx:2,sy:2}, 1000)            // end values and time
//           .onUpdate(function () {
//             obj.position.set(this.x, this.y, this.z);
//             obj.rotation.z = this.r
//           })
//   return tween;
// }
