function code_import(evt, item){
    console.log(item)
    item.forEach(elem => {
        switch (elem.type) {
            case "line":
                
                break;
            case "rect":
                draw_rect(elem)
                break;
            case "rectFill":
                draw_rectFill(elem)
                break;
            case "text":
                
                break;
            case "float":
                
                break;
            case "button":
                
                break;
            case "buttonFlat":
                
                break;
            default:
                break;
        }
    });
}

function draw_rect({x,y,length, height, lineWidth}){
    console.log(x,y)
    let rect = new Konva.Rect({
        x: x,
        y: y,
        width: length,
        height: height,
        fill: '#FF0000',
        strokeWidth: lineWidth,
        draggable: true
    })
    group.add(rect)

    rect.on('dragstart', elemDrag)
}

function draw_rectFill({x1,y1,x2,y2,color, alpha}) {
    draw_rect({
        x: x1,
        y: y1,
        length: x2 - x1,
        height: y2 - y1,
        color,
        alpha,
        lineWidth: 6
    })
}