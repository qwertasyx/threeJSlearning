///////////////////////
/// THREE.js Vars   ///
///////////////////////
var cameraVisu, cameraOrth, sceneReal, sceneAni, renderer1, renderer2, r2context, controls;
var cube,cube2,grid, bgmesh;
var AOmaterial, AOtexture, texture1, texture2, videoTexture
var pixelMesh, axes;
var textures = []
var materials =[]
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

//////////////////////////////
/// Puplic Var for dat.GUI ///
/////////////////////////////
var dots = {visible:true};
var lsScale = {x:1,y:1,z:1};
/////////////////////
///   on LOAD    ///
////////////////////
$( window ).on( "load", function() {
  
  /////////////////////
  ///  dat.GUI     ///
  ////////////////////
  gui = new dat.GUI(  );
  gui.domElement.id = 'gui';
  var f1 = gui.addFolder('Cube');
    f1.add(cube.scale, 'x', 0.1, 20);
    f1.add(cube.scale, 'y', 0.1, 20);
    f1.add(cube.scale, 'z', 0.1, 20);
  f1.open();
  var f6 = gui.addFolder('Camera');
    var f6c = f6.add(cameraVisu, 'type',[ 'PerspectiveCamera', 'OrthographicCamera']);
  f6.open();
  var f7 = gui.addFolder('Helper');
    f7.add(axes, 'visible');
    f7.add(grid, 'visible');

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
/////////////////////
///   on rdy    ///
////////////////////
$( document ).ready(function() {
  console.log( "ready!" );
  $('#start').on('click',function(e){
    t1.start()
  })
  // $('#build').on('click',function(e){
  //   // t1.start()
  //   supertween = buildTweenSequernce(blue,sequence,true)
  // })
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
  // laoding textures
  const loader = new THREE.TextureLoader();

  textures[0] = loader.load( 'img/rnd.png' );
  textures[1] = loader.load( 'img/rndcol.png' );
  textures[2] = loader.load( 'img/cross.png' );

  textures.forEach(function(t){
    t.minFilter = THREE.NearestFilter
    t.magFilter = THREE.NearestFilter
  })  

  materials[0] = new THREE.MeshBasicMaterial( { map: textures[0] } );
  materials[1] = new THREE.MeshBasicMaterial( { map: textures[1] } );
  materials[2] = new THREE.MeshBasicMaterial( { map: textures[2] } );
  materials[3] =  new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  // vaar AOtexture = new THREE.MeshBasicMaterial( { map: texture} );
  // cube2 = new THREE.Mesh( geometry2, AOtexture );
  // cube2.position.z = 1
  // sceneAni.add( cube2 );

	sceneReal = new THREE.Scene();
  sceneReal.background = new THREE.Color( 0x000000 );


  cameraOrth = new THREE.OrthographicCamera( 0, sizeRenderCanvas.w, 0, sizeRenderCanvas.h, 0.1, 1000 );
  cameraOrth.position.z = 5;
  cameraOrth.zoom = 1
  cameraOrth.updateProjectionMatrix()
  //objects
	var geometry = new THREE.BoxGeometry( 8, 8, 8 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  cube = new THREE.Mesh( geometry, materials[2] );
  sceneReal.add( cube );
  // var geometry2 = new THREE.BoxGeometry( 1, 1, 1 );
  // var AOmaterial = new THREE.MeshBasicMaterial( { color: 0x00f00f } );
  // var texture = new THREE.Texture( generateTexture() );
	// texture.needsUpdate = true; // important!
  // var AOtexture = new THREE.MeshBasicMaterial( { map: texture} );
  // cube2 = new THREE.Mesh( geometry2, AOtexture );
  // cube2.position.z = 1
  // sceneAni.add( cube2 );

  // axes
  axes = new THREE.AxesHelper( 100 )
  sceneReal.add( axes );
  // grid
  grid = new THREE.GridHelper( 1000, 100,'#110000','#111111' );  
  // gridHelper.rotation.x=Math.PI / 2
  sceneReal.add(  grid );
 
	renderer1 = new THREE.WebGLRenderer({ canvas: renderCanvas1, antialias:true });
  renderer1.setSize( window.innerWidth, 500 );
  
  // controls + camera
  var canvas = document.getElementById("renderCanvas1")
  cameraVisu = new THREE.PerspectiveCamera( 75, window.innerWidth/500, 0.1, 1000 );
  initCameraPersp();

  // tweening
  t1 = new TWEEN.Tween(cube.position);
  t2 = new TWEEN.Tween(cube.position);
  t3 = new TWEEN.Tween(cube.position);
  t4 = new TWEEN.Tween(cube.position);
  t1.to({ x: 50   ,y: 0  ,z: 0   }, 500).onComplete(function(){cube.material = materials[0]});
  t2.to({ x: 0    ,y: 50 ,z: 0   }, 500).onComplete(function(){cube.material = materials[1]});
  t3.to({ x: 0    ,y: 0  ,z: 50  }, 500).onComplete(function(){cube.material = materials[2]});
  t4.to({ x: 0    ,y: 0  ,z: 0   }, 500).onComplete(function(){cube.material = materials[3]});;

  t1.chain(t2)
  t2.chain(t3)
  t3.chain(t4)
  t4.chain(t1)
} 

function animate() {
  stats.begin();
  requestAnimationFrame( animate );
  TWEEN.update();

  renderer1.render( sceneReal, cameraVisu );
  stats.end();
}

function generateTexture() {
	var size = 16;
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
  cameraVisu.position.set(50,50,50);
  controls.target.x = 0
  controls.target.y = 0
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