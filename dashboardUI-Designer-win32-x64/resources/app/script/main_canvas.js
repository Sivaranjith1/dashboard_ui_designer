const Konva = require("konva");
const electron = require("electron");

const fontScaler = 1.9;
let globalIndexCounter = 0;
let selectedElement = null;

let listOfElements = [];

const { ipcRenderer } = electron;

let stage;
init();

let backgroundLayer = new Konva.Layer();

let group = new Konva.Group({
  x: 20,
  y: 20,
  draggable: true,
});

draw_background();

//-------------------------
//      Drags
//-------------------------
function groupDrag(e) {
  if (e.target == group) {
    if (!e.evt.shiftKey) {
      group.stopDrag();
    }
  }
}
group.on("dragstart", groupDrag);

function elemDrag(e) {
  if (e.evt.shiftKey) {
    e.target.stopDrag();
  }
  selectedElement = e.target;
  showMenu(e);
}

function elemClick(e) {
  selectedElement = e.target;
  showMenu(e);
}

backgroundLayer.add(group);
stage.add(backgroundLayer);

//-------------------------
//      Functions
//-------------------------
function init() {
  let topDiv = document.querySelector(".top");
  var width = topDiv.offsetWidth;
  var height = topDiv.offsetHeight;

  stage = new Konva.Stage({
    container: "container",
    width: width,
    height: height,
  });
}

function draw_background() {
  let background = new Konva.Rect({
    x: 0,
    y: 0,
    width: 480,
    height: 272,
    fill: "#1c1c1c",
    strokeWidth: 2,
  });
  group.add(background);
}

//-------------------------
//      On code import and ipcRenderer
//-------------------------
ipcRenderer.on("code:import", code_import);

ipcRenderer.on("code:export:request", export_code);

ipcRenderer.on("delete", deleteSelected);

ipcRenderer.on("clear", clearCanvas);

ipcRenderer.on("save:request", saveRequest);

//-------------------------
//      resize
//-------------------------
function fitStageIntoParentContainer() {
  //width calc
  let width = window.innerWidth;
  width = width * 0.3 >= 500 ? width - 500 : width * 0.7;

  //height calc
  let height = window.innerHeight;
  height = height * 0.22 >= 150 ? height - 150 : height * (1 - 0.22);

  stage.width(width);
  stage.height(height);
  stage.draw();
}

fitStageIntoParentContainer();
// adapt the stage on any window resize
window.addEventListener("resize", fitStageIntoParentContainer);

//-------------------------
//      Scroll
//-------------------------
function zoom(e) {
  var scaleBy = 1.075;
  e.evt.preventDefault();
  var oldScale = stage.scaleX();

  var mousePointTo = {
    x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
    y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
  };

  var newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
  stage.scale({ x: newScale, y: newScale });

  var newPos = {
    x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
    y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
  };
  stage.position(newPos);
  stage.batchDraw();
}
stage.on("wheel", zoom);

//-------------------------
//      delete selected
//-------------------------
function deleteSelected() {
  if (selectedElement == null) return;
  const index = listOfElements.indexOf(selectedElement);
  listOfElements.splice(index, 1);

  selectedElement.destroy();
  backgroundLayer.draw();
  selectedElement = null;
  hideAll();
}

function clearCanvas() {
  while (listOfElements.length > 0) {
    selectedElement = listOfElements[0];
    deleteSelected();
  }
}

function saveRequest() {
  if (listOfElements.length === 0) return;

  const data = compile_code();
  if (data.length === 0) return;

  ipcRenderer.send("save:data", data);
}
