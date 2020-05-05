function code_import(evt, item) {
  listOfElements = [];
  console.log(item);
  item.forEach((elem) => {
    switch (elem.type) {
      case "line":
        break;
      case "rect":
        draw_rect(elem);
        break;
      case "rectFill":
        draw_rectFill(elem);
        break;
      case "text":
        draw_text(elem);
        break;
      case "float":
        break;
      case "button":
        draw_button(elem);
        break;
      case "buttonFlat":
        draw_buttonFlat(elem);
        break;
      default:
        break;
    }
  });
  backgroundLayer.draw();
}

function draw_rect({ x, y, length, height, lineWidth, color }) {
  let rect = new Konva.Rect({
    x: x,
    y: y,
    width: length,
    height: height,
    id: globalIndexCounter,
    stroke: convert_color(color),
    strokeWidth: lineWidth,
    draggable: true,
  });

  group.add(rect);
  rect.zIndex(1);
  listOfElements.push(rect);
  globalIndexCounter++;

  rect.on("dragstart", elemDrag);
  rect.on("dragend", elemDrag);
  rect.on("click", elemClick);

  return rect;
}

function draw_rectFill({ x1, y1, x2, y2, color }) {
  let rect = new Konva.Rect({
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1,
    id: globalIndexCounter,
    fill: convert_color(color),
    draggable: true,
  });

  group.add(rect);
  rect.zIndex(1);
  listOfElements.push(rect);
  globalIndexCounter++;

  rect.on("dragstart", elemDrag);
  rect.on("dragend", elemDrag);
  rect.on("click", elemClick);

  return rect;
}

function draw_text({ x, y, textSize, string, color, centerAlignment }) {
  let text = new Konva.Text({
    x,
    y,
    fontSize: textSize / fontScaler,
    text: string,
    fill: convert_color(color),
    id: globalIndexCounter,
    draggable: true,
  });

  if (centerAlignment == "OPT_CENTER") {
    text.x(text.x() - text.width() / 2);
    text.y(text.y() - text.height() / 2);
  } else if (centerAlignment == "OPT_CENTERX") {
    text.x(text.x() - text.width() / 2);
  } else if (centerAlignment == "OPT_RIGHTX") {
    text.x(text.x() - text.width());
  }

  group.add(text);
  text.zIndex(3);
  listOfElements.push(text);
  globalIndexCounter++;

  text.on("dragstart", elemDrag);
  text.on("dragend", elemDrag);
  text.on("click", elemClick);
  return text;
}

function draw_buttonFlat({
  x,
  y,
  length,
  height,
  buttonColor,
  textSize,
  textColor,
  string,
}) {
  let button = new Konva.Group({
    draggable: true,
    id: globalIndexCounter,
    x: x - length / 2,
    y: y - height / 2,
  });
  let rect = new Konva.Rect({
    x: 0,
    y: 0,
    width: length,
    height: height,
    fill: convert_color(buttonColor),
  });
  let text = new Konva.Text({
    x: length / 2,
    y: height / 2,
    fontSize: textSize / fontScaler,
    text: string,
    fill: convert_color(textColor),
  });

  text.x(text.x() - text.width() / 2);
  text.y(text.y() - text.height() / 2);

  button.add(rect);
  button.add(text);

  group.add(button);
  button.zIndex(2);
  listOfElements.push(button);
  globalIndexCounter++;

  button.on("dragstart", elemDrag);
  button.on("dragend", elemDrag);
  button.on("click", elemClick);

  return button;
}

function draw_button({
  x,
  y,
  length,
  height,
  buttonColor,
  textSize,
  textColor,
  string,
}) {
  let button = new Konva.Group({
    draggable: true,
    id: globalIndexCounter,
    x: x - length / 2,
    y: y - height / 2,
  });
  let rect = new Konva.Rect({
    x: 0,
    y: 0,
    width: length,
    height: height,
    fill: convert_color(buttonColor),
  });
  let text = new Konva.Text({
    x: length / 2,
    y: height / 2,
    fontSize: textSize / fontScaler,
    text: string,
    fill: convert_color(textColor),
  });

  text.x(text.x() - text.width() / 2);
  text.y(text.y() - text.height() / 2);

  button.add(rect);
  button.add(text);

  group.add(button);
  button.zIndex(2);
  listOfElements.push(button);
  globalIndexCounter++;

  button.on("dragstart", elemDrag);
  button.on("dragend", elemDrag);
  button.on("click", elemClick);

  return button;
}
