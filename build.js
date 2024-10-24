///////Imports

import * as THREE from './three.js-master/three.js-master/build/three.module.js';
import { GLTFLoader } from './three.js-master/three.js-master/loaders/GLTFLoader.js';
import { OrbitControls } from './three.js-master/three.js-master/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// render

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.setClearColor('rgb(82, 84, 92)');
document.body.appendChild(renderer.domElement);

// render miniMap
// var miniMap = document.getElementById("miniMap");

// const miniRenderer = new THREE.WebGLRenderer();
// miniRenderer.setSize(200, 200);
// miniRenderer.setAnimationLoop(animate);
// miniMap.appendChild(miniRenderer.domElement);
// miniRenderer.setClearColor('rgb(184, 242, 241)');

// lights

const pointLight = new THREE.PointLight(0x404040, 3, 30);
pointLight.position.set(0, .25, 0);
scene.add(pointLight);

// const pointLightHelper = new THREE.PointLightHelper( pointLight,0.1);
// scene.add( pointLightHelper );


//3d modles ***********************
// Read before you ask yahir stuff 
// this loads the gltf modles which can be found in the three.js-master/three.js-master/loaders/GLTF folder
// to change modle you have to change the path in the code below
// you cant create const varibles with the same name  
// you cant create new GLTFLoader() with the same name
// const floor = new GLTFLoader();
// floor.load('./three.js-master/three.js-master/loaders/GLTF/floor.gltf',
//   function(gltf) {
//     gltf.scene.position.setX(0);
//     gltf.scene.position.setY(0);
//     gltf.scene.position.setZ(0);
//     gltf.scene.rotation.x = -Math.PI / 2;
//     gltf.scene.rotation.z = Math.PI / 2;
//     scene.add(gltf.scene);


//     gltf.animations; // Array<THREE.AnimationClip>
//     gltf.scene; // THREE.Group
//     gltf.scenes; // Array<THREE.Group>
//     gltf.cameras; // Array<THREE.Camera>
//     gltf.asset; // Object

//   },
// );


const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


// Camera and orbit controls

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(1,1,1);



// stolen function ---------------------------------------------------------------------------------------------------------------------------------------------------------



//  three.js animate  ---------------------------------------------------------------------------------------------------------------------------------------------------------

var currentCamera = camera;
var buildModeBool = false;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, currentCamera);
  // if (buildModeBool) {
  //   miniRenderer.render(scene, camera);
  //  }
}



// not three js -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------





// real stuff ----------------------------------------------------------------------------------------------------
var allFloorList = [];
// combines all the wall objects into one list index 0 represents allWall1 index 1 represents allWall2 etc
var allWallList = [];
// x axis positive
var allWall1 = [];
// x axis negative
var allWall2 = [];
// z axis positive
var allWall3 = [];
// z axis negative
var allWall4 = [];


function wallMaker(xpos, ypos, zpos, xrot, yrot, zrot){
  return new Promise((resolve) => {
    let wall = new GLTFLoader();
    wall.load('./three.js-master/three.js-master/loaders/GLTF/wall.gltf',
      function(gltf) {
        // Set the position and rotation of the loaded model
        gltf.scene.position.set(xpos, ypos, zpos);
        gltf.scene.rotation.set(xrot, yrot, zrot);

        gltf.scene.traverse(function(node) {
          if (node.isMesh) {
            // Set the material to be transparent
            node.material.transparent = false;

            // Adjust the opacity level (0 = fully transparent, 1 = fully opaque)
            node.material.opacity = 1; // Adjust this value for more or less transparency
          }
        });

        // Add the model to the scene
        scene.add(gltf.scene);

        resolve(gltf.scene);

      }
    );
  });
}

var listOfCamPos = [];
// x axis positive
var camPosWall1 = [];
// x axis negative
var camPosWall2 = [];
// z axis positive
var camPosWall3 = [];
// z axis negative
var camPosWall4 = [];

// this function should only be called once ***********************
var floorTileWidth = 0.178;
var zposOfCam = 0.15;
function allCameraPos(width,length){
  const floor = new GLTFLoader();
  floor.load('./three.js-master/three.js-master/loaders/GLTF/floor.gltf',
    function(gltf) {
      gltf.scene.position.setX(0);
      gltf.scene.position.setY(0);
      gltf.scene.position.setZ(0);
      gltf.scene.rotation.x = -Math.PI / 2;
      gltf.scene.rotation.z = Math.PI / 2;
      scene.add(gltf.scene);

      // loop to add more floor tiles
      for (var i = 0; i < width; i++){
          var xpos = i * floorTileWidth;
            listOfCamPos.push([]);
            allFloorList.push([]);
          for (var j = 0; j < length; j++){
            var ypos = j * floorTileWidth;
            listOfCamPos[i].push([(-xpos - 0.178) + (floorTileWidth / 2), zposOfCam + 0.14 ,(-ypos - 0.178) + (floorTileWidth / 2) ]);
            allFloorList[i].push([]);

            for (var k = 0; k < 10; k++){
              allFloorList[i][j].push([]);
              for (var m = 0; m < 10; m++){
                allFloorList[i][j][k][m] = null;
              }
            }


            // clone tile after first initalizing it 
              const clone = gltf.scene.clone();

              clone.position.set((-xpos - 0.178),0,-ypos);


              scene.add(clone);

            // z index pair
            if(width == 1){
              allWall1.push(wallMaker( xpos , 0.13, -ypos - 0.178 + 0.004, Math.PI / 2, 0, Math.PI));
              camPosWall1.push([ zposOfCam , 0.13/2 , (-ypos - 0.178) + (floorTileWidth / 2) ]);

              allWall2.push(wallMaker( (-xpos - floorTileWidth) - 0.006, 0.13, -ypos - 0.178 + 0.004, Math.PI / 2, 0, Math.PI ));
              camPosWall2.push([ (-xpos - floorTileWidth) - zposOfCam , 0.13/2 , (-ypos - 0.178) + (floorTileWidth / 2) ]);
            }else if(i == 0){
              allWall1.push(wallMaker( xpos , 0.13, -ypos - 0.178 + 0.004, Math.PI / 2, 0, Math.PI));
              camPosWall1.push([ zposOfCam , 0.13/2 , (-ypos - 0.178) + (floorTileWidth / 2) ]);
            }else if(i == (width - 1)){
              allWall2.push(wallMaker( (-xpos - floorTileWidth) - 0.006, 0.13, -ypos - 0.178 + 0.004, Math.PI / 2, 0, Math.PI ));
              camPosWall2.push([ (-xpos - floorTileWidth) - zposOfCam , 0.13/2 , (-ypos - 0.178) + (floorTileWidth / 2) ]);
            }


            // x index pair
            if(length == 1){
              allWall3.push(wallMaker((-xpos - floorTileWidth), 0.13, -ypos + 0.006 + 0.004, Math.PI / 2, 0, Math.PI/2));
              camPosWall3.push([((-xpos - floorTileWidth) + (floorTileWidth / 2)), 0.13/2 , zposOfCam]);


              allWall4.push(wallMaker((-xpos - floorTileWidth), 0.13, -ypos-0.178 + 0.004, Math.PI / 2, 0, Math.PI/2));
              camPosWall4.push([((-xpos - floorTileWidth) + (floorTileWidth / 2)), 0.13/2 , -ypos -0.178 - zposOfCam]);

            }else if(j==0){
              allWall3.push(wallMaker((-xpos - floorTileWidth), 0.13, -ypos + 0.006 + 0.004, Math.PI / 2, 0, Math.PI/2));
              camPosWall3.push([((-xpos - floorTileWidth) + (floorTileWidth / 2)), 0.13/2 , zposOfCam]);

            }else if(j==(length-1)){
              allWall4.push(wallMaker((-xpos - floorTileWidth), 0.13, -ypos-0.178 + 0.004, Math.PI / 2, 0, Math.PI/2));
              camPosWall4.push([((-xpos - floorTileWidth) + (floorTileWidth / 2)), 0.13/2 , -ypos -0.178 - zposOfCam]);

            }
          }
      }
      // after for loops 
      // fixing up allWall 3 and 4
      camPosWall3.unshift([null]);
      camPosWall3.push([null]);

      camPosWall4.unshift([null]);
      camPosWall4.push([null]);

      // adding the cam positions for the walls
      listOfCamPos.unshift(camPosWall1);
      listOfCamPos.push(camPosWall2);
      for(var i = 0; i < listOfCamPos.length; i++){
        listOfCamPos[i].unshift(camPosWall3[i]);
        listOfCamPos[i].push(camPosWall4[i]);
      }

      // combing the wall objects into one (allWall1, allWall2, allWall3, allWall4))

      allWallList.push(allWall1);
      allWallList.push(allWall2);
      allWallList.push(allWall3);
      allWallList.push(allWall4);

      // deleting copy refrence
      scene.remove(gltf.scene);
    },
  );


};

// waits till wall if found loaded
// par 1 - allWallList
// par 2 - which wall side ( 0 = allWall1, 1 = allWall2, 2 = allWall3, 3 = allWall4)
// par 2 - the index for the list
// par 3 - will callback the object found in the list
// Ex. if you want to go to allWallList[0][7] , wallList = allWallsList, wallIndex = 0, index = 7, returned = function(obj){}
function waitForWall(wallList,wallIndex, index, returned) {
  const checkInterval = setInterval(() => { 
    if (wallList[wallIndex]) {
      if(wallList[wallIndex][index])
      clearInterval(checkInterval); 
      returned(wallList[wallIndex][index]); 
    }
  }, 100); 
}

// starting cam position
var currentCamXPos = 1;
var currentCamYPos = 0;


// tells you if you are next to a wall if you are it tells you what wall if not it returns null
// Ex. if return [0,7] means the wall is found in allWallList[0][7]
function nextToWall(x,y){
  if(x == 0){
    if((y-1) < 0 || (y) > (roomLength)){
      return null
    }else{
      return [0,y-1]; 
    }
  }else if(x == (roomWidth + 1)){
    if((y-1) < 0 || (y) > (roomLength)){
      return null
    }else{
      return [1,y-1]; 
    }
  }else if(y == 0){
    if((x-1) < 0 || (x) > (roomWidth)){
      return null
    }else{
      return [2,x-1]; 
    }
  }else if(y == (roomLength + 1)){
    if((x-1) < 0 || (x) > (roomWidth)){
      return null
    }else{
      return [3,x-1]; 
    }
  }else{
    return null
  }
}

var roomWidth = 1;
var roomLength = 2;
allCameraPos(roomWidth, roomLength);

controls.target = new THREE.Vector3( (-roomWidth * floorTileWidth)/2 ,0, (-roomLength * floorTileWidth)/2);

//   // how to turn the wall transparent
// waitForWall(allWallList, 2, 0, function(wall){
//   // since I saved the walls as a promise you have to call then then use that to do stuff
//   wall.then((gltf)=>{

//     gltf.traverse((node) => {
//       if (node.isMesh) {
//         node.material.transparent = true;
//       }
//     });

//   });
// });

// adding objects to the scene --------------------------------------------------------------------------------------------------------------------
const allAddedGLTFObjects = [];
const allGLTFObjects = [];
var selectedGLTFObject = 0;
allGLTFObjects.push([3,2,'./three.js-master/three.js-master/loaders/GLTF/nightStand.gltf', "pics/swagNightstand.png"]);
allGLTFObjects.push([3,2,'./three.js-master/three.js-master/loaders/GLTF/closet.gltf', "pics/yahirCloest.png"]);
allGLTFObjects.push([3,5,'./three.js-master/three.js-master/loaders/GLTF/bed.gltf', "pics/bed.png"]);


function objectAdd(obj, x, y, objx, objy, roty){
    const objLoader = new GLTFLoader();
    objLoader.load(obj[2],
      function(gltf) {
        if(roty == 90){
          if (selectedGLTFObject == 2){
            var rotXFix = (floorTileWidth / 10) * (obj[1]);
            var rotYFix = -(obj[0] / 2 ) * (floorTileWidth / 10);
          }
          else{
            var rotXFix = (floorTileWidth / 10) * (obj[1]) - (floorTileWidth / 20);
            var rotYFix = (obj[1] / 2 ) * (floorTileWidth / 10);
          }
        }else if(roty == 180){
          var rotXFix = (floorTileWidth / 10) * obj[0]  - (floorTileWidth / 20);
          var rotYFix = -(floorTileWidth / 10) * obj[1] + (floorTileWidth / 20);
        }else if(roty == 270){
          var rotXFix = (floorTileWidth / 100);
          var rotYFix = -(floorTileWidth / 10) * obj[1];
        }else{
          var rotXFix = 0;
          var rotYFix = 0;
        }
        var positionOfFloorX = x * floorTileWidth;
        var positionOfFloorY = y * floorTileWidth;
        var positionOfObjectX = -floorTileWidth  - positionOfFloorX + (objx * (floorTileWidth / 10)) + (rotXFix);
        var positionOfObjectY = -floorTileWidth - positionOfFloorY + (obj[1] * (floorTileWidth / 10)) - (objy * (floorTileWidth / 10)) + (rotYFix) - (floorTileWidth/20);

        gltf.scene.rotation.set(-Math.PI/2,0,(roty*(Math.PI/180)));

        gltf.scene.position.set( positionOfObjectX, 0,  positionOfObjectY);


        scene.add(gltf.scene) 
        for(var i = 0; i < gridObjectWidth; i++){
          for(var j = 0; j < gridObjectHeight; j++){
            allFloorList[x][y][objx+i][objy+j] = selectedGLTFObject;
          }
        }

        allAddedGLTFObjects.push([obj, x, y, objx, objy, roty]);

      }
    );
}
// Math.PI places at bottom right 
// objectAdd(allGLTFObjects[0], 0, 0, 1, -1, Math.PI);

// get saved layout
function getSavedLayout(listOfSavedObj){
  for(var i in listOfSavedObj){
    objectAdd(i[0], i[1], i[2], i[3], i[4], i[5]);
  }
}

function saveLayout(){
  // save layout in folder
  // allAddedGLTFObjects
}



//  camera movement -----------------------------------------------------------------------------------------------------------------------------------------
var angleOfLooking = 0;
function moveCamera(cameraEffected,x,y){
  let wallImNextTo = nextToWall(x,y);
  if(wallImNextTo != null){
    // get rid of bottom arrow if you shouldent be able to go down
    varBottomArrow.style.display = "none";
    document.getElementById("placementGridCont").style.display = "none";

    // disables button if you shouldent be able to rotate

    varLeftRotate.style.display = "none";
    varRightRotate.style.display = "none";
    selectorUi.style.display = "none"
    // make wall transparent
    waitForWall(allWallList, wallImNextTo[0], wallImNextTo[1], function(wall){
      wall.then((gltf)=>{
        gltf.traverse((node) => {
          if (node.isMesh) {
            node.material.transparent = true;
            node.material.opacity = 0.3;
          }
        });
      });
    });

    // moves the camera to wall
    if(x == 0){
      cameraEffected.position.set(listOfCamPos[x][y][0], listOfCamPos[x][y][1], listOfCamPos[x][y][2]);

      angleOfLooking = 90;
      let lookAtVar = new THREE.Vector3(listOfCamPos[x][y][0]  - zposOfCam - (floorTileWidth/2),listOfCamPos[x][y][1],listOfCamPos[x][y][2]);
      cameraEffected.lookAt(lookAtVar);

    }else if(x == (roomWidth + 1)){
      cameraEffected.position.set(listOfCamPos[x][y][0], listOfCamPos[x][y][1], listOfCamPos[x][y][2]);

      angleOfLooking = 270;
      let lookAtVar = new THREE.Vector3(listOfCamPos[x][y][0]  + zposOfCam + (floorTileWidth/2),listOfCamPos[x][y][1],listOfCamPos[x][y][2]);
      cameraEffected.lookAt(lookAtVar);
    }else if(y == 0){
      cameraEffected.position.set(listOfCamPos[x][y][0], listOfCamPos[x][y][1], listOfCamPos[x][y][2]);

      angleOfLooking = 0;
      let lookAtVar = new THREE.Vector3(listOfCamPos[x][y][0],listOfCamPos[x][y][1],listOfCamPos[x][y][2] - zposOfCam - (floorTileWidth/2));
      cameraEffected.lookAt(lookAtVar);

    }else if(y == (roomLength + 1)){
      cameraEffected.position.set(listOfCamPos[x][y][0], listOfCamPos[x][y][1], listOfCamPos[x][y][2]);

      angleOfLooking = 180;
      let lookAtVar = new THREE.Vector3(listOfCamPos[x][y][0],listOfCamPos[x][y][1],listOfCamPos[x][y][2] + zposOfCam + (floorTileWidth/2));
      cameraEffected.lookAt(lookAtVar);
    }

  }else{
    cameraEffected.position.set(listOfCamPos[x][y][0], listOfCamPos[x][y][1], listOfCamPos[x][y][2]);

    let lookAtVar = new THREE.Vector3(listOfCamPos[x][y][0],listOfCamPos[x][y][1] - zposOfCam - (floorTileWidth/2),listOfCamPos[x][y][2]);
    cameraEffected.lookAt(lookAtVar);

    // makes the camera keep the right orintaion since lookat makes rotates the camera towreds 0deg

    // if(angleOfLooking == 90){
    //   dummyCamera.rotation.z += Math.PI / 2;
    // }else if(angleOfLooking == 180){
    //   dummyCamera.rotation.z += Math.PI;
    // }else if(angleOfLooking == 270){
    //   dummyCamera.rotation.z -= Math.PI / 2;
    // }

    angleOfLooking = 0;

    // enables button if you can move down
    varBottomArrow.style.display = "block";
    document.getElementById("placementGridCont").style.display = "flex";

    // enables buttons if you can rotate
    varLeftRotate.style.display = "block";
    varRightRotate.style.display = "block";
    selectorUi.style.display = "flex";

    if(listOfCamPos[x][y][0] == null){
        topArrowFunc();
    }
  }

}


var varArrowBox = document.getElementById("arrowBox");
var varTopArrow = document.getElementById("topArrow");
var varRightArrow = document.getElementById("rightArrow");
var varBottomArrow = document.getElementById("bottomArrow");
var varLeftArrow = document.getElementById("leftArrow");
var varLeftRotate = document.getElementById("leftRotate");
var varRightRotate = document.getElementById("rightRotate");

var objectAngle = 0;

var dummyCamera;
var helper;

// start edit mode button --------------------------------------------------------------------------------
var button = document.getElementById('lockCameraButton');
button.addEventListener('click', function() {

  if (button.classList.contains("notActive")) {

    button.classList.add("active");
    button.classList.remove("notActive");

    dummyCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); 
    // dummyCamera = new THREE.OrthographicCamera( (floorTileWidth + 0.05) / - 2, (floorTileWidth + 0.05) / 2, (floorTileWidth + 0.05) / 2, (floorTileWidth + 0.05) / - 2, 0, 0.15  );
    helper = new THREE.CameraHelper(dummyCamera);
    scene.add(dummyCamera);
    moveCamera(dummyCamera,currentCamXPos,currentCamYPos);
    scene.add(helper);

    currentCamera = dummyCamera;
    buildModeBool = true;



    varArrowBox.style.zIndex = "1";
    // miniMap.style.zIndex = "1";


  } else if (button.classList.contains("active")) {
    button.classList.add("notActive");
    button.classList.remove("active");

    currentCamera = camera;
    buildModeBool = false;

    scene.remove(dummyCamera);
    scene.remove(helper);
    dummyCamera = null;
    document.getElementById("placementGridCont").style.display = "none";
    varArrowBox.style.zIndex = "-1";
    // miniMap.style.zIndex = "-1";

    // make wall not transparent if next to wall 
    let wallImB = nextToWall(currentCamXPos, currentCamYPos);

    if(wallImB != null){
      waitForWall(allWallList, wallImB[0], wallImB[1], function(wall){
        wall.then((gltf)=>{
          gltf.traverse((node) => {
            if (node.isMesh) {
              node.material.transparent = false;
              node.material.opacity = 1;
            }
          });
        });
      });
    }

  }
});




// camera arrow movement ---------------------------------------------------------------------

varTopArrow.addEventListener("click", topArrowFunc);

function topArrowFunc(){
    // makes wall you get off transparent
    let wallImB = nextToWall(currentCamXPos, currentCamYPos);
    if(wallImB != null){
      waitForWall(allWallList, wallImB[0], wallImB[1], function(wall){
        wall.then((gltf)=>{
          gltf.traverse((node) => {
            if (node.isMesh) {
              node.material.transparent = false;
              node.material.opacity = 1;
            }
          });
        });
      });
    }


    if(angleOfLooking == 90){
      currentCamXPos += 1;
    }else if(angleOfLooking == 270){
      currentCamXPos -= 1;
    }else if(angleOfLooking == 180){
      currentCamYPos -= 1;
    }else if(angleOfLooking == 0){
      currentCamYPos += 1;
    }

    moveCamera(dummyCamera,currentCamXPos,currentCamYPos);
}



varRightArrow.addEventListener("click", function(){
  // makes wall you get off transparent
  let wallImB = nextToWall(currentCamXPos, currentCamYPos);
  if(wallImB != null){
    waitForWall(allWallList, wallImB[0], wallImB[1], function(wall){
      wall.then((gltf)=>{
        gltf.traverse((node) => {
          if (node.isMesh) {
            node.material.transparent = false;
            node.material.opacity = 1;
          }
        });
      });
    });
  }

  if(angleOfLooking == 90){
    currentCamYPos += 1;
  }else if(angleOfLooking == 270){
    currentCamYPos -= 1;
  }else if(angleOfLooking == 180){
    currentCamXPos += 1;
  }else if(angleOfLooking == 0){
    currentCamXPos -= 1;
  }

  moveCamera(dummyCamera,currentCamXPos,currentCamYPos);
});

varBottomArrow.addEventListener("click", function(){
  if(angleOfLooking == 90){
    currentCamXPos -= 1;
  }else if(angleOfLooking == 270){
    currentCamXPos += 1;
  }else if(angleOfLooking == 180){
    currentCamYPos += 1;
  }else if(angleOfLooking == 0){
    currentCamYPos -= 1;
  }

  moveCamera(dummyCamera,currentCamXPos,currentCamYPos);
});






varLeftArrow.addEventListener("click", function(){
  // makes wall you get off transparent
  let wallImB = nextToWall(currentCamXPos, currentCamYPos);
  if(wallImB != null){
    waitForWall(allWallList, wallImB[0], wallImB[1], function(wall){
      wall.then((gltf)=>{
        gltf.traverse((node) => {
          if (node.isMesh) {
            node.material.transparent = false;
            node.material.opacity = 1;
          }
        });
      });
    });
  }

  if(angleOfLooking == 90){
    currentCamYPos -= 1;
  }else if(angleOfLooking == 270){
    currentCamYPos += 1;
  }else if(angleOfLooking == 180){
    currentCamXPos -= 1;
  }else if(angleOfLooking == 0){
    currentCamXPos += 1;
  }
  moveCamera(dummyCamera,currentCamXPos,currentCamYPos);
});




//Grid awesome sauce ---------------------------------------------------------------------------------------------------------------------------------------




var placementGrid = document.getElementById("placementGrid");
var grids = document.querySelectorAll(".grids");
var k;
var gridObjectWidth = allGLTFObjects[selectedGLTFObject][0];
var gridObjectHeight = allGLTFObjects[selectedGLTFObject][1];
var shouldYouBeAbleToPlace = true;

function gridClick(e) {
  var clickedGridPosition = getGridElementsPosition(k);
  if(shouldYouBeAbleToPlace){
    objectAdd(allGLTFObjects[selectedGLTFObject], currentCamXPos - 1, currentCamYPos - 1, clickedGridPosition[0], -clickedGridPosition[1], objectAngle);
    for(var i = 0; i < grids.length; i++){
      if(grids[i].style.border == "2px solid rgb(92, 247, 57)"){
        grids[i].style.border = "2px solid red";
        shouldYouBeAbleToPlace = false;
      }
    } 
  }
}

function gridHover(e) {
    var grid = e.target;
    for(var i = 0; i < grids.length; i++){
      if(grids[i] == grid){
        k = i;
      }
    }
    var widthStartMod = k % 10;
    var widthEndMod = (k + (gridObjectWidth - 1)) % 10;



    if(widthEndMod < widthStartMod || grids[k + ((gridObjectHeight  - 1) * 10)] == undefined || isOverItem){
      for(var i = 0; i < grids.length; i++){
        if(grids[i].style.border == "2px solid rgb(92, 247, 57)"){
          grids[i].style.border = "2px solid red";
          shouldYouBeAbleToPlace = false;
        }
      }
    }else{
      var clickedGridPosition = getGridElementsPosition(k);
      var isOverItem = false;
      for(var i = 0; i < gridObjectWidth; i++){
        for(var j = 0; j < gridObjectHeight; j++){
          if(allFloorList[currentCamXPos - 1][currentCamYPos - 1][clickedGridPosition[0]+i][(-clickedGridPosition[1])+j] != null){
            isOverItem = true;
          }
        }
      }

      for(var j = 0; j < grids.length; j++){
        grids[j].style.border = "2px solid black";
      } 
      for(var i = 0; i < gridObjectHeight; i++){
        for(var j = 0; j < gridObjectWidth; j++){
          if(isOverItem == true){
            grids[k + (i*10) + j].style.border = "2px solid red";
            shouldYouBeAbleToPlace = false;
          }else{
            grids[k + (i*10) + j].style.border = "2px solid rgb(92, 247, 57)";
            shouldYouBeAbleToPlace = true;
          }

        }
      }
    } 
}

for(var i = 0; i < grids.length; i++){
  grids[i].addEventListener("click", (e)=>{
    gridClick(e);

  });
  grids[i].addEventListener("mouseenter", (e)=>{
    gridHover(e);
  });

}

placementGrid.addEventListener("mouseleave", ()=>{
  for(var j = 0; j < grids.length; j++){
    grids[j].style.border = "2px solid black";
  } 
})

function getGridElementsPosition(index) {
  const gridEl = document.getElementById("placementGrid");

  // our indexes are zero-based but gridColumns are 1-based, so subtract 1
  let offset = Number(window.getComputedStyle(gridEl.children[0]).gridColumnStart) - 1; 

  // if we haven't specified the first child's grid column, then there is no offset
  if (isNaN(offset)) {
    offset = 0;
  }
  const colCount = window.getComputedStyle(gridEl).gridTemplateColumns.split(" ").length;

  const rowPosition = Math.floor((index + offset) / colCount);
  const colPosition = (index + offset) % colCount;

  //Return an object with properties row and column
  return [colPosition, rowPosition ];
}

// object rotation button 
varLeftRotate.addEventListener("click", function() {
  objectAngle -= 90;
  if(objectAngle < 0){
    objectAngle = objectAngle + 360;
  }else if(objectAngle >= 360){
    objectAngle = objectAngle - 360;
  }

  if(objectAngle == 90 || objectAngle == 270){
    gridObjectWidth = allGLTFObjects[selectedGLTFObject][1];
    gridObjectHeight = allGLTFObjects[selectedGLTFObject][0];
  }else{
    gridObjectWidth = allGLTFObjects[selectedGLTFObject][0];
    gridObjectHeight = allGLTFObjects[selectedGLTFObject][1];
  }



  // dummyCamera.rotation.z -= Math.PI / 2;
  // angleOfLooking -= 90;
  // if(angleOfLooking < 0){
  //   angleOfLooking = 360 + angleOfLooking;
  // }else if(angleOfLooking >= 360){
  //   angleOfLooking = angleOfLooking - 360;
  // }
});

varRightRotate.addEventListener("click", function() {
  objectAngle += 90;
  if(objectAngle < 0){
    objectAngle = objectAngle + 360;
  }else if(objectAngle >= 360){
    objectAngle = objectAngle - 360;
  }

  if(objectAngle == 90 || objectAngle == 270){
    gridObjectWidth = allGLTFObjects[selectedGLTFObject][1];
    gridObjectHeight = allGLTFObjects[selectedGLTFObject][0];
  }else{
    gridObjectWidth = allGLTFObjects[selectedGLTFObject][0];
    gridObjectHeight = allGLTFObjects[selectedGLTFObject][1];
  }

  // dummyCamera.rotation.z += Math.PI / 2;
  // angleOfLooking += 90;
  // if(angleOfLooking < 0){
  //   angleOfLooking = 360 + angleOfLooking;
  // }else if(angleOfLooking >= 360){
  //   angleOfLooking = angleOfLooking - 360;
  // }

});

//selectedGLTFObject
// selecting objects ui

var selectorUi = document.getElementById("selectorUi");

// function nightstandClick() {
//   selectedGLTFObject = 0;
//   for(var j = 1; j < selectorUi.children.length; j++){
//     selectorUi.children[j].remove();
//     console.log(selectorUi.children[j]);
//   }
// }

function gltfSelectorFun(e) {
  var gltfImage = e.target;

  for(var j = 0; j < selectorUi.children.length; j++){
    if(selectorUi.children[j].children[0] == gltfImage){
      selectedGLTFObject = j;

      if(objectAngle == 90 || objectAngle == 270){
        gridObjectWidth = allGLTFObjects[selectedGLTFObject][1];
        gridObjectHeight = allGLTFObjects[selectedGLTFObject][0];
      }else{
        gridObjectWidth = allGLTFObjects[selectedGLTFObject][0];
        gridObjectHeight = allGLTFObjects[selectedGLTFObject][1];
      }

    } 
  }
  selectorUi.innerHTML = "";

  selectorUi.append(gltfImage);
  selectorUi.style.width = "100px";
  setTimeout(function(){
    selectorUi.addEventListener( "click", selectorUiFun);
  }, 1);

}

function selectorUiFun(){
  selectorUi.innerHTML = "";
  selectorUi.style.width = allGLTFObjects.length * 100 + "px";
  for(var i = 0; i < allGLTFObjects.length; i++){
    selectorUi.appendChild(createElement(allGLTFObjects[i][3]));
    selectorUi.children[i].addEventListener("click" , (e) =>{
      gltfSelectorFun(e);
    });
  }
  selectorUi.removeEventListener( "click", selectorUiFun);
}

selectorUi.addEventListener( "click", selectorUiFun);



function createElement(img) {
  var element = document.createElement("div");
  element.classList.add("element");
  element.style.backgroundImage = "url('" + img + "')";

  element.style.border = "2px solid black";
  // <div style="background-image: url('pics/swagNightstand.png'); background-size: cover; background-repeat: no-repeat; background-position: center center;  width: 100px; height: 100px;"></div>
  // element.appendChild(image);
  return element;
}