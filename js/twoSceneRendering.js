var cameraPersp, cameraOrth, scene, renderer1, renderer2;
var cube,gridHelper;
//stats
var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );


// do stuff
init();
animate();
 
function init() {
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x010101 );
  //cameras
	cameraPersp = new THREE.PerspectiveCamera( 75, window.innerWidth/( window.innerHeight / 2 ), 0.1, 1000 );
  cameraPersp.position.z = 5;
  cameraOrth = new THREE.OrthographicCamera( -window.innerWidth/2,window.innerWidth/2, -100, 100, 1, 1000 );
  cameraOrth.position.z = 5;
  cameraOrth.zoom = 40
  cameraOrth.updateProjectionMatrix()
  //objects
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  cube = new THREE.Mesh( geometry, material );
  cube.vrz = 0.005;
  scene.add( cube );
  // axes
  scene.add( new THREE.AxesHelper( 2 ) );
  // grid

  gridHelper = new THREE.GridHelper( 1000, 100,'#110000','#111111' );
  scene.add( gridHelper );
  gridHelper.rotation.x=Math.PI / 2
 
	renderer1 = new THREE.WebGLRenderer({ canvas: renderCanvas1, antialias:true });
  renderer1.setSize( window.innerWidth, 500 );
  renderer2 = new THREE.WebGLRenderer({ canvas: renderCanvas2 });
  renderer2.setSize( window.innerWidth, 200 );
  
  // controls
  controls1 = new THREE.OrbitControls( cameraPersp );
  // controls2 = new THREE.OrbitControls( cameraOrth );
}
 
function animate() {
  stats.begin();
	requestAnimationFrame( animate );
  renderer1.clear();
  renderer2.clear();
	// cube.rotation.x += 0.05;
  cube.rotation.z += cube.vrz;

  renderer1.render( scene, cameraPersp );
  renderer2.render( scene, cameraOrth );
  stats.end();
}

$( window ).on( "load", function() {
  /// DAT GUI
  gui = new dat.GUI();
  cameraPersp.position
  var f1 = gui.addFolder('Cubee');
    f1.add(cube, 'vrz', -0.5, 0.5);
    f1.add(cube, 'vcr', 0, 0.5);
  f1.open();
});