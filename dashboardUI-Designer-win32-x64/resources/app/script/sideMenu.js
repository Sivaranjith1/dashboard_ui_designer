const inputFields = document.querySelectorAll(".input-field");
const inputs = {
  x: document.querySelector("#x"),
  y: document.querySelector("#y"),
  width: document.querySelector("#width"),
  height: document.querySelector("#height"),
  fill: document.querySelector("#color"),
  strokeWidth: document.querySelector("#stroke"),
  text: document.querySelector("#text"),
  fontSize: document.querySelector("#size"),
  z: document.querySelector("#z"),
};

hideAll();

function hideAll() {
  inputFields.forEach((e) => e.classList.add("hide"));
}

function show(array = []) {
  array.forEach((e) => {
    try {
      inputs[e].parentNode.classList.remove("hide");
    } catch {}
  });
}

function showMenu({ target }) {
  hideAll();
  let { attrs } = target;
  if (target instanceof Konva.Group) {
    attrs = {
      ...target.children[0].attrs,
      fontSize: target.children[1].attrs.fontSize,
      text: target.children[1].attrs.text,
      x: target.attrs.x,
      y: target.attrs.y,
    };
    console.log(attrs, target);
  }
  let keys = Object.keys(attrs);
  let index = keys.indexOf("stroke");
  let obj = [];
  if (index != -1) {
    keys[index] = "fill";
    obj.push({
      name: "fill",
      value: attrs.stroke,
    });
  }

  obj.push({
    name: "z",
    value: target.zIndex(),
  });

  keys.forEach((key) => {
    try {
      if (attrs[key] == undefined) throw Error;

      obj.push({
        name: key,
        value: attrs[key],
      });
    } catch {}
  });

  keys.push("z");
  show(keys);
  setValue(obj);
}

function setValue(array = []) {
  array.forEach((elem) => {
    try {
      inputs[elem.name].value = elem.value;
    } catch {}
  });
}

function inputChange(e) {
  let keys = Object.keys(inputs);
  let { value } = e.target;
  keys.forEach((key) => {
    if (inputs[key] == e.target) {
      switch (key) {
        case "x":
          selectedElement.x(parseInt(value));
          break;

        case "y":
          selectedElement.y(parseInt(value));
          break;

        case "width":
          if (selectedElement instanceof Konva.Group) {
            const width = parseInt(value);
            const text = selectedElement.children[1];
            text.x(width / 2 - text.width() / 2);

            selectedElement.children[0].width(width);
          } else {
            selectedElement.width(parseInt(value));
          }
          break;

        case "height":
          if (selectedElement instanceof Konva.Group) {
            const height = parseInt(value);
            const text = selectedElement.children[1];
            text.y(height / 2 - text.height() / 2);

            selectedElement.children[0].height(height);
          } else {
            selectedElement.height(parseInt(value));
          }
          break;

        case "fill":
          if (selectedElement instanceof Konva.Group) {
            const rect = selectedElement.children[0];
            rect.fill(value);
          } else if (selectedElement.attrs.stroke != null) {
            selectedElement.stroke(value);
          } else {
            selectedElement.fill(value);
          }
          break;

        case "strokeWidth":
          selectedElement.strokeWidth(parseInt(value));
          break;

        case "fontSize":
          if (selectedElement instanceof Konva.Group) {
            const text = selectedElement.children[1];
            const rect = selectedElement.children[0];
            text.fontSize(value);

            text.y(rect.height() / 2 - text.height() / 2);
            text.x(rect.width() / 2 - text.width() / 2);
          } else {
            selectedElement.fontSize(value);
          }
          break;

        case "z":
          selectedElement.zIndex(parseInt(value));
          break;

        case "text":
          if (selectedElement instanceof Konva.Group) {
            const text = selectedElement.children[1];
            const rect = selectedElement.children[0];
            text.text(value);

            text.y(rect.height() / 2 - text.height() / 2);
            text.x(rect.width() / 2 - text.width() / 2);
          } else {
            selectedElement.text(value);
          }
          break;

        default:
          break;
      }
    }
  });

  backgroundLayer.draw();
}

Object.keys(inputs).forEach((key) => {
  inputs[key].addEventListener("change", inputChange);
});
