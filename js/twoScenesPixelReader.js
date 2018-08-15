var cameraPersp, cameraOrth, sceneReal, sceneAni, renderer1, renderer2, r2context;
var cube,cube2,gridHelper;
//stats
var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

// pixels
var pixels =[]
pixels.push({x:15,y:15,z:0,real:null})
pixels.push({x:50,y:50,z:0,real:null})
pixels.push({x:75,y:25,z:0,real:null})
pixels.push({x:15,y:55,z:0,real:null})

var pixelpicker = {x:0,y:0,c:{r:0,g:0,b:0}}

var pixelValues = new Uint8Array(200 * 400 * 4);


// do stuff
init();
animate();
 
function init() {
	sceneReal = new THREE.Scene();
  sceneReal.background = new THREE.Color( 0x010101 );
  sceneAni = new THREE.Scene();
	sceneAni.background = new THREE.Color( 0x020202 );
  //cameras
	cameraPersp = new THREE.PerspectiveCamera( 75, window.innerWidth/( window.innerHeight / 2 ), 0.1, 1000 );
  cameraPersp.position.z = 5;
  cameraOrth = new THREE.OrthographicCamera( 0,400, 0, 200, 0.1, 1000 );
  cameraOrth.position.z = 5;
  cameraOrth.zoom = 1
  cameraOrth.updateProjectionMatrix()
  //objects
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  cube = new THREE.Mesh( geometry, material );
  cube.vrz = 0.005;
  sceneReal.add( cube );
  var geometry2 = new THREE.BoxGeometry( 1, 1, 1 );
	var material2 = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
  cube2 = new THREE.Mesh( geometry2, material2 );
  cube2.position.z = 1
  sceneAni.add( cube2 );

  // axes
  sceneReal.add( new THREE.AxesHelper( 2 ) );
  // grid

  gridHelper = new THREE.GridHelper( 1000, 100,'#110000','#111111' );  
  gridHelper.rotation.x=Math.PI / 2
  // gridHelper.position.z= -0.5
  sceneAni.add(  gridHelper );
 
	renderer1 = new THREE.WebGLRenderer({ canvas: renderCanvas1, antialias:true });
  renderer1.setSize( window.innerWidth, 500 );
  renderer2 = new THREE.WebGLRenderer({ canvas: renderCanvas2, preserveDrawingBuffer: true });
  renderer2.setSize( 400, 200 );
  r2context = renderer2.getContext()
  
  // controls
  controls1 = new THREE.OrbitControls( cameraPersp, document.getElementById("renderCanvas1"));
  // controls2 = new THREE.OrbitControls( cameraOrth );

  //draw pixel edges
  pixels.forEach(function(i,index,arr){ 
    var geometry = new THREE.BoxBufferGeometry( 3, 3, 3 );
    var edges = new THREE.EdgesGeometry( geometry );
    var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
    line.position.x = i.x;
    line.position.y = i.y;
    line.position.z = i.z;
    sceneAni.add( line );
    // draw real lightsources
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    var ls = new THREE.Mesh( geometry, material );
    ls.position.x = i.x;
    ls.position.y = i.y;
    ls.position.z = i.z;
    sceneReal.add( ls );
    i.real = ls;
  });
}
 
function animate() {
  stats.begin();
	requestAnimationFrame( animate );
  renderer1.clear();
  // renderer2.clear();

  cube.rotation.z += cube.vrz;

  renderer1.render( sceneReal, cameraPersp );
  renderer2.render( sceneAni, cameraOrth );


  collectPixelvalues()
  setRealWorldPixels()
  stats.end();
}
function collectPixelvalues(){
  r2context.readPixels(0,0, 400, 200, r2context.RGBA, r2context.UNSIGNED_BYTE, pixelValues);
}
function setRealWorldPixels(){
  pixels.forEach(function(pixel,index,arr){
    // pixel.real.material.color.r = pixelValues[(pixel.x+(pixel.y*400))*4]
    pixel.real.material.color.r = pixelValues[5]
  });
}
$( window ).on( "load", function() {
  /// DAT GUI
  gui = new dat.GUI(  );
  gui.domElement.id = 'gui';
  cameraPersp.position
  var f1 = gui.addFolder('Cube');
    f1.add(cube, 'vrz', -0.5, 0.5);
  f1.open();
  var fc2 = gui.addFolder('Cube2');
    fc2.add(cube2.position, 'x', 0, 400);
    fc2.add(cube2.position, 'y', 0, 200);
    fc2.add(cube2.scale, 'x', 1, 100);
    fc2.add(cube2.scale, 'y', 1, 100);
  fc2.open();
  var f2 = gui.addFolder('Pixel');
    f2.add(pixelpicker, 'x', 0, 400);
    f2.add(pixelpicker, 'y', 0, 200);
    f2.add(pixelpicker.c, 'r', 0, 255).listen();
    f2.add(pixelpicker.c, 'g', 0, 255).listen();
    f2.add(pixelpicker.c, 'b', 0, 255).listen();
  f2.open();
});