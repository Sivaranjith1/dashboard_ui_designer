function export_code() {
  listOfElements = listOfElements.sort((a, b) => {
    if (a instanceof Konva.Text && !(b instanceof Konva.Text)) {
      return 1;
    } else if (b instanceof Konva.Text && !(a instanceof Konva.Text)) {
      return -1;
    }
  });
  const output = compile_code();

  if (output.length === 0) return;

  ipcRenderer.send("code:export:main", output);
}

function compile_code() {
  output = [];
  listOfElements.forEach((elem) => {
    switch (true) {
      case elem instanceof Konva.Rect:
        output.push(exportRect(elem));
        break;

      case elem instanceof Konva.Text:
        output.push(exportText(elem));
        break;

      case elem instanceof Konva.Group:
        output.push(exportButton(elem));
        break;

      default:
        break;
    }
  });

  if (output.length == 0) return;

  return output;
}

function exportRect(element) {
  if (element.attrs.stroke != null) {
    return exportRectangel(element);
  } else {
    return exportRectangelFill(element);
  }
}

function exportRectangel(elem) {
  const { attrs } = elem;
  return `draw_rectangle(${parseInt(attrs.x)}, ${parseInt(attrs.y)},${parseInt(
    attrs.width
  )}, ${parseInt(attrs.height)}, ${hexToColor(
    attrs.stroke
  )}, MAX_ALPHA, ${parseInt(attrs.strokeWidth)});`;
}

function exportRectangelFill(elem) {
  const { attrs } = elem;
  let x2 = parseInt(attrs.x + attrs.width);
  let y2 = parseInt(attrs.y + attrs.height);
  return `draw_rectangleWithFill(${parseInt(attrs.x)}, ${parseInt(
    attrs.y
  )}, ${x2}, ${y2},  ${hexToColor(attrs.fill)}, MAX_ALPHA);`;
}

function exportText(elem) {
  const { attrs } = elem;

  return `draw_text(${parseInt(attrs.x)}, ${parseInt(attrs.y)}, ${parseInt(
    attrs.fontSize * fontScaler
  )}, OPT_LEFTX, "${attrs.text}", ${hexToColor(attrs.fill)}, MAX_ALPHA);`;
}

function exportButton(elem) {
  let rect;
  let text;
  elem.children.forEach((child) => {
    console.log("child", child);
    if (child instanceof Konva.Rect) {
      rect = child;
    } else if (child instanceof Konva.Text) {
      text = child;
    }
  });

  if (rect == null || text == null) {
    console.error("This is not a button", elem, rect, text);
    return;
  }

  const { attrs } = rect;
  const textAtters = text.attrs;
  const x = parseInt(elem.attrs.x + attrs.width / 2);
  const y = parseInt(elem.attrs.y + attrs.height / 2);

  return `draw_button_flat(${x}, ${y}, ${parseInt(attrs.width)}, ${parseInt(
    attrs.height
  )}, ${parseInt(textAtters.fontSize * fontScaler)}, "${
    textAtters.text
  }", ${hexToColor(textAtters.fill)},${hexToColor(attrs.fill)}, MAX_ALPHA);`;
}
