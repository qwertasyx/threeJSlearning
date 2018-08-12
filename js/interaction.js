var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var camera = new THREE.OrthographicCamera( -250,250, -250, 250, 1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( 500, 500 );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 10, 10,10 );
var texture = new THREE.TextureLoader().load( 'img/test2.png' );
texture.anisotropy = 0
var material = new THREE.MeshBasicMaterial( { map: texture } );
// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;
cube.vx = 0
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
	// console.log(object.x);
});
t1.to({ x: -200 ,y: -200 }, 1000);
t2.to({ x: -200 ,y: 200 }, 1000);
t3.to({ x: 200  ,y: 200 }, 1000);
t4.to({ x: 200  ,y: -200 }, 1000);

var t5 = new TWEEN.Tween(cube.rotation);
var t6 = new TWEEN.Tween(cube.rotation);
t5.to({ z: 2 }, 1000);
t6.to({ z: 0 }, 1000);

var t7 = new TWEEN.Tween(cube.scale);
var t8 = new TWEEN.Tween(cube.scale);
t7.to({ x: 10  ,y: 10 }, 1000);
t8.to({ x: 1  ,y: 1 }, 1000);

t1.chain(t2,t5,t7)
t2.chain(t3,t6,t8)
t3.chain(t4)

// var m1 = new TWEEN.Tween(material);
// var m2 = new TWEEN.Tween(material);
// m1.to({ color:{r:1}} , 1000);
// m2.to({ color:{r:0}}, 1000);

// rdy
$( document ).ready(function() {
  console.log( "ready!" );
  $('#start').on('click',function(e){
    t1.start()
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
  var r = gui.addFolder('Rotation');
    r.add(cube.rotation, 'x', -10, 10)
    r.add(cube.rotation, 'y', -10, 10)
    r.add(cube.rotation, 'z', -10, 10)
    r.open()

  $('#test').on('click',function(e){
    gui.toggleHide()
  })
});

function animate() {
  stats.begin();
  requestAnimationFrame( animate );
  TWEEN.update();
  renderer.render( scene, camera );
  stats.end();
}
animate();
