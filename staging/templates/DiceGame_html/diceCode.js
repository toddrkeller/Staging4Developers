var NUM = 2;
var NUMRANGE = [];
while (NUMRANGE.length < NUM) NUMRANGE.push(NUMRANGE.length+1);

// Bullet-interfacing code

var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
var dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
var overlappingPairCache = new Ammo.btDbvtBroadphase();
var solver = new Ammo.btSequentialImpulseConstraintSolver();
var dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
dynamicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));

var groundShape = new Ammo.btBoxShape(new Ammo.btVector3(50, 50, 50));

var bodies = [];

var groundTransform = new Ammo.btTransform();
groundTransform.setIdentity();
groundTransform.setOrigin(new Ammo.btVector3(0, -56, 0));

var wallShape = new Ammo.btBoxShape(new Ammo.btVector3(30,30, 30));
var wallTransform = new Ammo.btTransform();
wallTransform.setIdentity();
wallTransform.setOrigin(new Ammo.btVector3(0, 0, -40));
var wallBody = new Ammo.btRigidBody(
					new Ammo.btRigidBodyConstructionInfo(0, 
							new Ammo.btDefaultMotionState(wallTransform), 
							wallShape, 
							new Ammo.btVector3(0, 0, 0)
					)
				);
dynamicsWorld.addRigidBody(wallBody);

wallTransform.setIdentity();
wallTransform.setOrigin(new Ammo.btVector3(0, 0, 40));
var wallBody2 = new Ammo.btRigidBody(
					new Ammo.btRigidBodyConstructionInfo(0, 
							new Ammo.btDefaultMotionState(wallTransform), 
							wallShape, 
							new Ammo.btVector3(0, 0, 0)
					)
				);
dynamicsWorld.addRigidBody(wallBody2);

wallTransform.setIdentity();
wallTransform.setOrigin(new Ammo.btVector3(44, 0, 0));
var wallBody3 = new Ammo.btRigidBody(
					new Ammo.btRigidBodyConstructionInfo(0, 
							new Ammo.btDefaultMotionState(wallTransform), 
							wallShape, 
							new Ammo.btVector3(0, 0, 0)
					)
				);
dynamicsWorld.addRigidBody(wallBody3);

wallTransform.setIdentity();
wallTransform.setOrigin(new Ammo.btVector3(-43.5, 0, 0));
var wallBody4 = new Ammo.btRigidBody(
					new Ammo.btRigidBodyConstructionInfo(0, 
							new Ammo.btDefaultMotionState(wallTransform), 
							wallShape, 
							new Ammo.btVector3(0, 0, 0)
					)
				);
dynamicsWorld.addRigidBody(wallBody4);

//bodies.push(body);


(function() {
  var mass = .1;
  var localInertia = new Ammo.btVector3(0, 0, 0);
  var myMotionState = new Ammo.btDefaultMotionState(groundTransform);
  var rbInfo = new Ammo.btRigidBodyConstructionInfo(0, myMotionState, groundShape, localInertia);
  var body = new Ammo.btRigidBody(rbInfo);

  dynamicsWorld.addRigidBody(body);
  bodies.push(body);
})();

var boxShape = new Ammo.btBoxShape(new Ammo.btVector3(1, 1, 1));

NUMRANGE.forEach(function(i) {
  var startTransform = new Ammo.btTransform();
  startTransform.setIdentity();
  var mass = 1.8;
  var localInertia = new Ammo.btVector3(0, 0, 0);
  boxShape.calculateLocalInertia(mass, localInertia);

  var myMotionState = new Ammo.btDefaultMotionState(startTransform);
  var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, boxShape, localInertia);
  var body = new Ammo.btRigidBody(rbInfo);

  ////body.applyTorqueImpulse(new Ammo.btVector3(5,5,5));
  dynamicsWorld.addRigidBody(body);
  bodies.push(body);
});

function resetPositions() {
  NUMRANGE.forEach(function(i) {
    var body = bodies[i];
    
    ////if(reportedNoneActive){ //The dice still have some torque
    	body.applyTorqueImpulse(new Ammo.btVector3(15,15,15));
    ////}
    
    var origin = body.getWorldTransform().getOrigin();
    origin.setX( Math.random() *i*-5.5);
    origin.setY(7+i*3);
    origin.setZ( Math.random() *i*5.5);
    body.activate();
  });
  
  reportedNoneActive = false;
  lastInactivity = Date.now();
}

function setDiceOnStage(){
 NUMRANGE.forEach(function(i) {
    var body = bodies[i];
    var origin = body.getWorldTransform().getOrigin();
    origin.setX(0);
    origin.setY(0);
    origin.setZ(0);
    body.activate();
  });
 	
}

////setDiceOnStage();

//resetPositions();

var transform = new Ammo.btTransform(); // taking this out of readBulletObject reduces the leaking
function readBulletObject(i, pos, quat) {
  var body = bodies[i];
  body.getMotionState().getWorldTransform(transform);
  var origin = transform.getOrigin();
  pos[0] = origin.x();
  pos[1] = origin.y();
  pos[2] = origin.z();
  var rotation = transform.getRotation();
  quat.x = rotation.x();
  quat.y = rotation.y();
  quat.z = rotation.z();
  quat.w = rotation.w();
}

var lastInactivity = Date.now();
var reportedNoneActive = false;
function noneActive() {
  if(reportedNoneActive){
  	return true;
  }
  
  var num = 0;
  NUMRANGE.forEach(function(i) {
    var body = bodies[i];
    num += body.isActive();
  });
  
  if(num == 0 && !reportedNoneActive){
  	reportedNoneActive = true;
  	return true;
  }
  
  if ((Date.now() - lastInactivity) >= 10000) { // consider none active also if enough time passed
    lastInactivity = Date.now();
    return true;
  }
  
  return false;
}

// Main demo code

var boxes = [];

var position = [0,0,0];
var quaternion = new CubicVR.Quaternion;

function simulate(dt) {
  if(reportedNoneActive){
  	return;
  }
  
  dynamicsWorld.stepSimulation(dt, 2);

  // Read bullet data into JS objects
  for (var i = 0; i < NUM; i++) {
    readBulletObject(i+1, position, quaternion);
    var renderObject = boxes[i];
    renderObject.position[0] = position[0];
    renderObject.position[1] = position[1];
    renderObject.position[2] = position[2];
    renderObject.rotation = quaternion.toEuler();
  }

  if (noneActive()){
  	rollFinished();
  }
}

var fpsInfo = {
  dts: 0,
  num: 0,
  lastHUD: Date.now()
};

function showFPS(dt) {
  var now = Date.now();
  fpsInfo.dts += dt;
  fpsInfo.num++;
  if (now - fpsInfo.lastHUD > 333) {
    document.getElementById('out').innerHTML = '<b>FPS: ' + Math.ceil(1/(fpsInfo.dts/fpsInfo.num)) + '</b>';
    fpsInfo.lastHUD = now;
    fpsInfo.dts = 0;
    fpsInfo.num = 0;
  }
}

function restart() {
  totalTime = 0;
  //resetPositions();
}

var FLOOR_SIZE = 100;
var FLOOR_HEIGHT = -56

// CubicVR code

function roundBox(arr){
	var output = new Array();
	output[0] = Math.round(arr[0]);
	output[1] = Math.round(arr[2]);
	
	if(output[0] < 0){
		output[0] = output[0] + 360;
	}
	
	if(output[1] < 0){
		output[1] = output[1] + 360;
	}
	
	if(output[0] != 0 && 
		output[0] != 90 &&
		output[0] != 180 &&
		output[0] != 270){
			
		if(output[0] < 45){
			output[0] = 0;
		}else if(output[0] < 135){
			output[0] = 90;
		}else if(output[0] < 225){
			output[0] = 180;
		}else{
			output[0] = 270;
		}
	}
	
	if(output[1] != 0 && 
		output[1] != 90 &&
		output[1] != 180 &&
		output[1] != 270){
			
		if(output[1] < 45){
			output[1] = 0;
		}else if(output[1] < 135){
			output[1] = 90;
		}else if(output[1] < 225){
			output[1] = 180;
		}else{
			output[1] = 270;
		}
	}
	
	return output;
}

function setDieOrientation(index, randInfinitiveValue ){
	switch(randInfinitiveValue){
		case 1: 
			boxes[index].rotation = [270,boxes[index].rotation[1],0];
			break;
		case 2:
			boxes[index].rotation = [90,boxes[index].rotation[1],0];
			break;
		case 3:
			boxes[index].rotation = [0,boxes[index].rotation[1],90];
			break;
		case 4:
			boxes[index].rotation = [0,boxes[index].rotation[1],0];
			break;
		case 5:
			boxes[index].rotation = [0,boxes[index].rotation[1],270];
			break;
		case 6:
			boxes[index].rotation = [0,boxes[index].rotation[1],180];
			break;
	}
}

function matchDice(rotArr){
	var roundedArr = roundBox(rotArr);
	var out = 0;
	
	if(roundedArr[0] == 0 && roundedArr[1] == 0){
		out = 4; 	
	}
	
	if(roundedArr[0] == 0 && roundedArr[1] == 90){
		out = 3; 	
	}

	if(roundedArr[0] == 0 && roundedArr[1] == 180){
		out = 6; 	
	}

	if(roundedArr[0] == 0 && roundedArr[1] == 270){
		out = 5; 	
	}
	
	if(roundedArr[0] == 90 && roundedArr[1] == 0){
		out = 2; 	
	}

	if(roundedArr[0] == 90 && roundedArr[1] == 90){
		out = 3; 	
	}	
	
	if(roundedArr[0] == 90 && roundedArr[1] == 180){
		out = 1; 	
	}

	if(roundedArr[0] == 90 && roundedArr[1] == 270){
		out = 5; 	
	}
	if(roundedArr[0] == 180 && roundedArr[1] == 0){
		out = 6; 	
	}

	if(roundedArr[0] == 180 && roundedArr[1] == 90){
		out = 3; 	
	}

	if(roundedArr[0] == 180 && roundedArr[1] == 180){
		out = 4; 	
	}

	if(roundedArr[0] == 180 && roundedArr[1] == 270){
		out = 5; 	
	}

	if(roundedArr[0] == 270 && roundedArr[1] == 0){
		out = 1; 	
	}

	if(roundedArr[0] == 270 && roundedArr[1] == 90){
		out = 3; 	
	}

	if(roundedArr[0] == 270 && roundedArr[1] == 180){
		out = 2; 	
	}

	if(roundedArr[0] == 270 && roundedArr[1] == 270){
		out = 5; 	
	}
	
	return out;
}

function startUp() {
  var canvas = document.getElementById("canvas");
  canvas.width = screen.width*0.70;
  canvas.height = screen.height*0.80;

  var gl = CubicVR.GLCore.init(canvas);

  if (!gl) {
    alert("Sorry, no WebGL support :(");
    return;
  };

  var scene = new CubicVR.Scene(canvas.width, canvas.height, 70);

  var light = new CubicVR.Light({
    type:CubicVR.enums.light.type.AREA,
    intensity: 0.9,
    areaCeiling: 80,
    areaFloor: FLOOR_HEIGHT,
    areaAxis: [15, 10],
    distance: 60,
    mapRes: 1024
  });
  scene.bindLight(light);
  CubicVR.setSoftShadows(false);

  scene.camera.position = [0, 10, .1];
  scene.camera.target = [0, 0, 0];

  /*var boxMaterials = NUMRANGE.map(function(i) {
    return new CubicVR.Material({
      textures: {
        color: new CubicVR.Texture("cube" + (i) + ".jpg")
      }
    });
  });*/
  
  var boxMaterial1 = new CubicVR.Material({
      textures: { color: new CubicVR.Texture("cube1.jpg")  }
  });

  var boxMaterial2 = new CubicVR.Material({
      textures: { color: new CubicVR.Texture("cube2.jpg" ) }
  });  

  var boxMaterial3 = new CubicVR.Material({
      textures: { color: new CubicVR.Texture("cube3.jpg")  }
  });

  var boxMaterial4 = new CubicVR.Material({
      textures: { color: new CubicVR.Texture("cube4.jpg" ) }
  });  
  
  var boxMaterial5 = new CubicVR.Material({
      textures: { color: new CubicVR.Texture("cube5.jpg")  }
  });

  var boxMaterial6 = new CubicVR.Material({
      textures: { color: new CubicVR.Texture("cube6.jpg" ) }
  });  

 
 var boxMeshes = NUMRANGE.map(function(i) {
    var boxMesh = new CubicVR.primitives.box({
      size: 2.0,
      material: boxMaterial1,
      uvmapper: {
        projectionMode: CubicVR.enums.uv.projection.CUBIC,
        scale: [2, 2, 2]
      } 
    });
    
    boxMesh.setFaceMaterial(boxMaterial1,0);
    boxMesh.setFaceMaterial(boxMaterial2,1);
    boxMesh.setFaceMaterial(boxMaterial3,2);
    boxMesh.setFaceMaterial(boxMaterial4,3);
    boxMesh.setFaceMaterial(boxMaterial5,4);
    boxMesh.setFaceMaterial(boxMaterial6,5);
    
    ////boxMesh.prepare();
    boxMesh.calcNormals().triangulateQuads().compile().clean();
    
    return boxMesh;
  });

  for (var i = 0; i < NUM; i++) {
    boxes[i] = new CubicVR.SceneObject({ mesh: boxMeshes[i], position: [0, -10000, 0] });
    scene.bindSceneObject(boxes[i], true);
  }

  var floorMaterial = new CubicVR.Material({
    textures: {
      color: new CubicVR.Texture("platform.jpg")
    }
  });
  var floorMesh = new  CubicVR.primitives.box({
    size: FLOOR_SIZE,
    material: floorMaterial,
    uvmapper: {
        projectionMode: CubicVR.enums.uv.projection.CUBIC,
        scale: [4, 4, 4]
    }
  }).calcNormals().triangulateQuads().compile().clean();

  var floor_ = new CubicVR.SceneObject({ mesh: floorMesh, position: [0, FLOOR_HEIGHT, 0] });
  scene.bindSceneObject(floor_, true);

  ////var mvc = new CubicVR.MouseViewController(canvas, scene.camera);
  scene.updateShadows();
  
  CubicVR.MainLoop(function(timer, gl) {
    var dt = timer.getLastUpdateSeconds();
    simulate(dt);
    ////scene.updateShadows();
    scene.render();
    //showFPS(dt);
  });
}