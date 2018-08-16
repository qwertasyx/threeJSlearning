var cameraPersp, cameraOrth, sceneReal, sceneAni, renderer1, renderer2, r2context;
var cube,cube2,gridHelper;
var pixelMesh;
//tweens
var t1,t2,t3,t4,t1r,t2r
//stats
var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

// pixels
var pixels =[]
pixels.push({x:15,  y:15,   z:0, real:null, ani:null})
pixels.push({x:50,  y:50,   z:0, real:null, ani:null})
pixels.push({x:75,  y:25,   z:0, real:null, ani:null})
pixels.push({x:200, y:325,  z:0, real:null, ani:null})
var i;
for (i = 0; i < 1500; i++) { 
  pixels.push({x:parseInt(Math.random()*400),y:parseInt(Math.random()*200),z:parseInt(Math.random()*50),real:null})
}
//gui
var dots = {visible:true};
var lsScale = {x:1,y:1};

var pixelpicker = {x:0,y:0,c:{r:0,g:0,b:0}}

var pixelValues = new Uint8Array(200 * 400 * 4);


// do stuff
init();
animate();
 
function init() {
	sceneReal = new THREE.Scene();
  sceneReal.background = new THREE.Color( 0x1f1f1f );
  sceneAni = new THREE.Scene();
	sceneAni.background = new THREE.Color( 0x1f1f1f );
  //cameras
	cameraPersp = new THREE.PerspectiveCamera( 75, window.innerWidth/( window.innerHeight / 2 ), 0.1, 1000 );
  cameraPersp.position.x = 249.73910288402834;
  cameraPersp.position.y = 129.50590246751955;
  cameraPersp.position.z = 195.486691899568;
  cameraPersp.rotation.x = -0.3557833534087699;
  cameraPersp.rotation.y = 0.28964203116726234;
  cameraPersp.rotation.z = 0.10573553215356102;



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
  sceneReal.add( new THREE.AxesHelper( 100 ) );
  // grid

  gridHelper = new THREE.GridHelper( 1000, 100,'#110000','#111111' );  
  gridHelper.rotation.x=Math.PI / 2
  // gridHelper.position.z= -0.5
  // sceneAni.add(  gridHelper );
 
	renderer1 = new THREE.WebGLRenderer({ canvas: renderCanvas1, antialias:true });
  renderer1.setSize( window.innerWidth, 500 );
  renderer2 = new THREE.WebGLRenderer({ canvas: renderCanvas2, preserveDrawingBuffer: true });
  renderer2.setSize( 400, 200 );
  r2context = renderer2.getContext()
  
  // controls
  controls1 = new THREE.OrbitControls( cameraPersp, document.getElementById("renderCanvas1"));
  // controls2 = new THREE.OrbitControls( cameraOrth );

  pixelMesh = new THREE.BoxGeometry( 1, 1, 1 );
  //draw pixel edges
  pixels.forEach(function(i,index,arr){ 
    var geometry = new THREE.BoxBufferGeometry( 3, 3, 3 );
    var edges = new THREE.EdgesGeometry( geometry );
    var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
    // line.position.x = i.x;
    // line.position.y = 200 - i.y;
    // line.position.z = i.z;
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3( 0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial( { size: 1, sizeAttenuation: false } );
    var dot =    new THREE.Points(dotGeometry, dotMaterial );
    dot.position.x = i.x;
    dot.position.y = 200 - i.y;
    dot.position.z = i.z;
    sceneAni.add( dot );
    i.ani = dot;
    // draw real lightsources
    // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    var ls = new THREE.Mesh( pixelMesh, material );
    ls.position.x = i.x;
    ls.position.y = i.y;
    ls.position.z = i.z;
    sceneReal.add( ls );
    i.real = ls;
  });
  // example tween
  cube2.scale.x =100
  cube2.scale.y =100
  cube2.position.z =4
  t1 = new TWEEN.Tween(cube2.position);
  t2 = new TWEEN.Tween(cube2.position);
  t3 = new TWEEN.Tween(cube2.position);
  t4 = new TWEEN.Tween(cube2.position);
  t1r = new TWEEN.Tween(cube2.rotation);
  t2r = new TWEEN.Tween(cube2.rotation);
  t1.to({ x: 0 ,y: 0 }, 1000);
  t2.to({ x: 500 ,y: 300 }, 1000);
  t3.to({ x: 400 ,y: 0 }, 1000);
  t4.to({ x: -100 ,y: 300 }, 1000);
  t1r.to({ z: Math.PI  }, 1000);
  t2r.to({ z: 0  }, 1000);

  t1.chain(t2,t1r)
  t2.chain(t3)
  t3.chain(t4,t2r)
  t4.chain(t1)
  t1.start();
}
 
function animate() {
  
  requestAnimationFrame( animate );
  TWEEN.update();
  // renderer1.clear();
  // renderer2.clear();

  cube.rotation.z += cube.vrz;
  
  renderer1.render( sceneReal, cameraPersp );
  stats.begin();
  renderer2.render( sceneAni, cameraOrth );
  stats.end();
  
  collectPixelvalues()
  setRealWorldPixels()
  
}
function collectPixelvalues(){
  r2context.readPixels(0,0, 400, 200, r2context.RGBA, r2context.UNSIGNED_BYTE, pixelValues);
}
function setRealWorldPixels(){
  
  pixels.forEach(function(pixel,index,arr){
    pixel.real.material.color.r =  pixelValues[( pixel.y*400* 4 ) + ( pixel.x*4) +0 ] / 255
    pixel.real.material.color.g =  pixelValues[( pixel.y*400* 4 ) + ( pixel.x*4) +1 ] / 255
    pixel.real.material.color.b =  pixelValues[( pixel.y*400* 4 ) + ( pixel.x*4) +2 ] / 255
  });
  
}
$( window ).on( "load", function() {
  /// DAT GUI
  gui = new dat.GUI(  );
  gui.domElement.id = 'gui';
  cameraPersp.position
  var f1 = gui.addFolder('Cube');
    f1.add(cube, 'vrz', -0.5, 0.5);
  // f1.open();
  var fc2 = gui.addFolder('Cube2');
    fc2.add(cube2.position, 'x', 0, 400);
    fc2.add(cube2.position, 'y', 0, 200);
    fc2.add(cube2.scale, 'x', 1, 100);
    fc2.add(cube2.scale, 'y', 1, 100);
  // fc2.open();
  var f2 = gui.addFolder('Pixel');
    f2.add(pixelpicker, 'x', 0, 400);
    f2.add(pixelpicker, 'y', 0, 200);
    f2.add(pixelpicker.c, 'r', 0, 255).listen();
    f2.add(pixelpicker.c, 'g', 0, 255).listen();
    f2.add(pixelpicker.c, 'b', 0, 255).listen();
  // f2.open();
 

  var f3 = gui.addFolder('Dots');
    var f3d = f3.add(dots, 'visible');
  f3.open();
  var f4 = gui.addFolder('Lightsources');
    var f4sx = f4.add(lsScale, 'x',0, 50);
    var f4sy = f4.add(lsScale, 'y',0, 50);
  f4.open();

  f3d.onChange(function(value) {
    pixels.forEach(function(pixel,index,arr){
      pixel.ani.visible = value;
    });
  }); 
  f4sx.onChange(function(value) {
    pixels.forEach(function(pixel,index,arr){
      pixel.real.scale.x = value;
    });
  });
  f4sy.onChange(function(value) {
    pixels.forEach(function(pixel,index,arr){
      pixel.real.scale.y = value;
    });
  });
});