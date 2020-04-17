const Konva = require( 'konva')
const electron = require('electron')

const { ipcRenderer } = electron;


let stage
init()

let backgroundLayer = new Konva.Layer()

let group = new Konva.Group({
    draggable: true
})

draw_background()

//-------------------------
//      Drags
//-------------------------
function groupDrag(e){
    if(e.target == group) {
        console.log('group')
        if (!e.evt.shiftKey){
            group.stopDrag()
        }
    }
}
group.on('dragstart', groupDrag)

function elemDrag(e){
    if (e.evt.shiftKey){
        e.target.stopDrag()
    }
}


backgroundLayer.add(group)
stage.add(backgroundLayer)

//-------------------------
//      Functions
//-------------------------
function init(){
    let topDiv = document.querySelector('.top')
    var width = topDiv.offsetWidth 
    var height = topDiv.offsetHeight
    
    stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height
    }) 
}

function draw_background(){
    let background = new Konva.Rect({
        x: 20,
        y: 20,
        width: 480,
        height: 272,
        fill: '#1c1c1c',
        strokeWidth: 2
    })
    group.add(background)
}


//-------------------------
//      On code import
//-------------------------
ipcRenderer.on('code:import', code_import)
//-------------------------
//      resize
//-------------------------
function fitStageIntoParentContainer() {
    //width calc
    let width = window.innerWidth 
    width = width * 0.3 >= 500 ? width - 500 : width*0.7 
    
    //height calc
    let height = window.innerHeight 
    height = height * 0.22 >= 150 ? height - 150 : height * (1-0.22)

    stage.width(width) 
    stage.height(height)
    stage.draw() 
  }

fitStageIntoParentContainer() 
// adapt the stage on any window resize
window.addEventListener('resize', fitStageIntoParentContainer) 




//-------------------------
//      Scroll
//-------------------------
function zoom(e){
    var scaleBy = 1.075;
    e.evt.preventDefault();
    var oldScale = stage.scaleX();

    var mousePointTo = {
        x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
        y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
    };

    var newScale =
        e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    stage.scale({ x: newScale, y: newScale });

    var newPos = {
        x:
        -(mousePointTo.x - stage.getPointerPosition().x / newScale) *
        newScale,
        y:
        -(mousePointTo.y - stage.getPointerPosition().y / newScale) *
        newScale
    };
    stage.position(newPos);
    stage.batchDraw();
}
stage.on('wheel', zoom);