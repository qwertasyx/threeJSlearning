var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var camera = new THREE.OrthographicCamera( -250,250, -250, 250, 1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( 500, 500 );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 10, 10,10 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;
cube.vx = 0
//stats
var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

// tweening
// TWEEN.update();

// rdy
$( document ).ready(function() {
  console.log( "ready!" );
  $('#test').on('click',function(e){
    //do something
  })
});
// load
var gui
// var position = {x:0,y:0}
$( window ).on( "load", function() {
  /// DAT GUI
  gui = new dat.GUI();
  var f3 = gui.addFolder('Speed');
    f3.add(cube, 'vx', 0, 20);
  f3.open();
  var f1 = gui.addFolder('Position');
    f1.add(cube.position, 'x', -250, 250);
    f1.add(cube.position, 'y', -250, 250).listen();
  f1.open();

  var f2 = gui.addFolder('Scale');
    f2.add(cube.scale, 'x', 0, 10);
    f2.add(cube.scale, 'y', 0, 10);
  f2.open();
  var fr = gui.addFolder('Rotation');
    fr.add(cube.rotation, 'x', -10, 10);
    fr.add(cube.rotation, 'y', -10, 10);
    fr.add(cube.rotation, 'z', -10, 10);
  f4.open();

  $('#test').on('click',function(e){
    gui.toggleHide()
  })
});

function animate() {
  stats.begin();
  requestAnimationFrame( animate );
  TWEEN.update();
  if (cube.position.y >= 250){
    cube.position.y = -250
  } else {
    cube.translateY(cube.vx)
  }
  
  // // cube.rotation.x += 0.01;
  // cube.rotation.z += 0.02;
  renderer.render( scene, camera );
  stats.end();
}
animate();
