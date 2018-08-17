///////////////////////
/// THREE.js Vars   ///
///////////////////////
var cameraVisu, cameraOrth, sceneReal, sceneAni, renderer1, renderer2, r2context, controls;
var cube,cube2,gridHelper, bgmesh;
var pixelMesh, axes;
//tweens
var t1,t2,t3,t4,t1r,t2r
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
  cameraVisu.position.set(sizeRenderCanvas.w/2,sizeRenderCanvas.h/2,100);
  controls.target.x = sizeRenderCanvas.w/2
  controls.target.y = sizeRenderCanvas.h/2
  controls.target.z = 0
  controls.update()
  
  /////////////////////
  ///  dat.GUI     ///
  ////////////////////
  gui = new dat.GUI(  );
  gui.domElement.id = 'gui';
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
    var f4sx = f4.add(lsScale, 'x',0, 20);
    var f4sy = f4.add(lsScale, 'y',0, 20);
    var f4sz = f4.add(lsScale, 'z',0, 20);
  f4.open();
  var f5 = gui.addFolder('Device');
    var f5c = f5.add(device, 'connection');
  f5.open();
  var f6 = gui.addFolder('Camera');
    var f6c = f6.add(cameraVisu, 'type',[ 'PerspectiveCamera', 'OrthographicCamera']);
  f6.open();
  var f7 = gui.addFolder('Helper');
    f7.add(axes, 'visible');


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
  f4sz.onChange(function(value) {
    pixels.forEach(function(pixel,index,arr){
      pixel.real.scale.z = value;
    });
  });  
  f5c.onChange(function(value) {
    if( value ){
      device.socket = new WebSocket("ws://127.0.0.1:9000");
      device.socket.binaryType = "arraybuffer";
      device.socket.onopen = function() {
        console.log("Connected!");     
      }
      device.socket.onmessage = function(e) {
          if (typeof e.data == "string") {
              console.log("Text message received: " + e.data);
          } else {
              var arr = new Uint8Array(e.data);
              var hex = '';
              for (var i = 0; i < arr.length; i++) {
              hex += ('00' + arr[i].toString(16)).substr(-2);
              }
              console.log("Binary message received: " + hex);
          }
      }
      device.socket.onclose = function(e) {
          console.log("Connection closed.");
          device.socket = null;     
      } 
      } else {
        device.socket.close()
    }
  });
  f6c.onChange(function(value) {
    var canvas = document.getElementById("renderCanvas1")
    if (cameraVisu instanceof THREE.PerspectiveCamera) {      
      cameraVisu = new THREE.OrthographicCamera(-canvas.width/8, canvas.width/8,canvas.height/8, -canvas.height/8 , -1000, 1000 );
      initCameraOrth();      
      this.perspective = "Orthographic";
    } else {
      sceneReal.rotation.x = 0
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
	sceneReal = new THREE.Scene();
  sceneReal.background = new THREE.Color( 0x1f1f1f );
  sceneAni = new THREE.Scene();
	sceneAni.background = new THREE.Color( 0x000000 );
  

  cameraOrth = new THREE.OrthographicCamera( 0, sizeRenderCanvas.w, 0, sizeRenderCanvas.h, 0.1, 1000 );
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
  // var material2 = new THREE.MeshBasicMaterial( { color: 0xffffff } );
  var texture = new THREE.Texture( generateTexture() );
	texture.needsUpdate = true; // important!
  var material2 = new THREE.MeshBasicMaterial( { map: texture} );
  cube2 = new THREE.Mesh( geometry2, material2 );
  cube2.position.z = 1
  sceneAni.add( cube2 );

  // axes
  axes = new THREE.AxesHelper( 100 )
  sceneReal.add( axes );
  // grid

  gridHelper = new THREE.GridHelper( 1000, 100,'#110000','#111111' );  
  gridHelper.rotation.x=Math.PI / 2
  // gridHelper.position.z= -0.5
  // sceneAni.add(  gridHelper );
 
	renderer1 = new THREE.WebGLRenderer({ canvas: renderCanvas1, antialias:true });
  renderer1.setSize( window.innerWidth, 500 );
  renderer2 = new THREE.WebGLRenderer({ canvas: renderCanvas2, preserveDrawingBuffer: true });
  renderer2.setSize( sizeRenderCanvas.w, sizeRenderCanvas.h );
  r2context = renderer2.getContext()
  
  // controls + camera
  var canvas = document.getElementById("renderCanvas1")
  cameraVisu = new THREE.PerspectiveCamera( 75, window.innerWidth/500, 0.1, 1000 );
  initCameraPersp();
  // cameraVisu = new THREE.OrthographicCamera(-canvas.width/8, canvas.width/8,-canvas.height/8, canvas.height/8 , -200, 500 );
  // initCameraOrth();

  //draw lightsources and pixel edges
  lightSourcesMesh = new THREE.BoxGeometry( 5, 5, 1 );
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
    dot.position.y = i.y;
    dot.position.z = i.z;
    sceneAni.add( dot );
    i.ani = dot;
    // draw real lightsources
    // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    var ls = new THREE.Mesh( lightSourcesMesh, material );
    ls.position.x = i.x;
    ls.position.y = i.y;
    ls.position.z = i.z;
    sceneReal.add( ls );
    i.real = ls;
  });
  // draw  backgound
  var vertices = []
  vertices.push(new THREE.Vector3( 0, 0, 0));
  vertices.push(new THREE.Vector3( 0, 90, 0));
  vertices.push(new THREE.Vector3( 130, 90, 0));
  vertices.push(new THREE.Vector3( 130, 0, 0));
  var bggeometry = new THREE.ConvexBufferGeometry( vertices );
  var bgmaterial = new THREE.MeshBasicMaterial( {color: 0x001000} );
  bgmesh = new THREE.Mesh( bggeometry, bgmaterial );
  sceneReal.add( bgmesh );

  // example tweens
  cube2.scale.x =30
  cube2.scale.y =30
  cube2.position.z =4
  t1 = new TWEEN.Tween(cube2.position);
  t2 = new TWEEN.Tween(cube2.position);
  t3 = new TWEEN.Tween(cube2.position);
  t4 = new TWEEN.Tween(cube2.position);
  t1r = new TWEEN.Tween(cube2.rotation);
  t2r = new TWEEN.Tween(cube2.rotation);
  t1.to({ x: 0 ,y: 0 }, 1000);
  t2.to({ x: 140 ,y: 100 }, 1000);
  t3.to({ x: 140 ,y: 0 }, 1000);
  t4.to({ x: -20 ,y: 50 }, 1000);
  t1r.to({ z: Math.PI  }, 1000);
  t2r.to({ z: 0  }, 1000);

  t1.chain(t2,t1r)
  t2.chain(t3)
  t3.chain(t4,t2r)
  t4.chain(t1)
  // t1.start();
} 
function animate() {
  stats.begin();
  requestAnimationFrame( animate );
  TWEEN.update();
  // renderer1.clear();
  // renderer2.clear();

  cube.rotation.z += cube.vrz;
  
  renderer1.render( sceneReal, cameraVisu );
  
  renderer2.render( sceneAni, cameraOrth );
    
  collectPixelvalues()
  setRealWorldPixels()
  //send udp
  if(device.socket!=null){
    device.socket.send(bytearray)
  }  
  stats.end();
}
///  PixelStuff   ///
function collectPixelvalues(){
  r2context.readPixels(0,0, sizeRenderCanvas.w, sizeRenderCanvas.h, r2context.RGBA, r2context.UNSIGNED_BYTE, pixelValues);
}
function setRealWorldPixels(){  
  pixels.forEach(function(pixel,index,arr){
    pixel.real.material.color.r = pixelValues[( pixel.y*sizeRenderCanvas.w* 4 ) + ( pixel.x*4) +0 ] / 255
    pixel.real.material.color.g = pixelValues[( pixel.y*sizeRenderCanvas.w* 4 ) + ( pixel.x*4) +1 ] / 255
    pixel.real.material.color.b = pixelValues[( pixel.y*sizeRenderCanvas.w* 4 ) + ( pixel.x*4) +2 ] / 255
    bytearray[index+1] = pixelValues[( pixel.y*sizeRenderCanvas.w* 4 ) + ( pixel.x*4) +0 ]
    //0 = Amount of LED´s , 1== channel1
  });  
}
function generateTexture() {
	var size = 20;
	// create canvas
	canvas = document.createElement( 'canvas' );
	canvas.width = size;
	canvas.height = size;
	// get context
	var context = canvas.getContext( '2d' );
	// draw gradient
	context.rect( 0, 0, size, size );
	var gradient = context.createLinearGradient( 0, 0, size, size );
	gradient.addColorStop(0,   '#000000'); 
  gradient.addColorStop(0.5, '#ffffff'); 
  gradient.addColorStop(1,   '#000000'); 
	context.fillStyle = gradient;
	context.fill();
	return canvas;
}
/// camerastuff ///
function initCameraPersp(){    
  controls  = new THREE.OrbitControls( cameraVisu, document.getElementById("renderCanvas1"));      
  cameraVisu.position.set(sizeRenderCanvas.w/2,sizeRenderCanvas.h/2,100);
  controls.target.x = sizeRenderCanvas.w/2
  controls.target.y = sizeRenderCanvas.h/2
  controls.target.z = 0
  controls.update()
}
function initCameraOrth(){  
  controls  = new THREE.OrbitControls( cameraVisu, document.getElementById("renderCanvas1"));
  // controls.enableRotate = false
   cameraVisu.position.set(sizeRenderCanvas.w/2,sizeRenderCanvas.h/2,100);
  controls.target.x = sizeRenderCanvas.w/2
  controls.target.y = sizeRenderCanvas.h/2
  controls.target.z = 0
  controls.update()
}
////////////////////
///   init       ///
////////////////////

init();
animate();