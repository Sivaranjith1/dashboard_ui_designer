function decryptCode(code) {
  /* 
        {
            type: rectangle,
            x: int,
            y: int,
            length: int,
            ...
        }
    */

  code = compile_code(code);

  //draw_line
  line = findRegex(code, "draw_line");
  line = decryptLine(line);

  //draw_rect
  rect = findRegex(code, "draw_rectangle");
  rect = decryptRect(rect);

  //draw_rectangleWithFill
  rectfi = findRegex(code, "draw_rectangleWithFill");
  rectfi = decryptRectFill(rectfi);

  //draw_text
  text = findRegex(code, "draw_text");
  text = decryptText(text);

  //draw_number
  numb = findRegex(code, "draw_number");
  numb = decryptText(numb);

  //draw_float
  flot = findRegex(code, "draw_float");
  flot = decryptFloat(flot);

  //draw_float2f
  flot2 = findRegex(code, "draw_float2f");
  flot2 = decryptFloat(flot2);

  //draw_button
  btn = findRegex(code, "draw_button");
  btn = decryptButton(btn);

  //draw_button_flat
  flat = findRegex(code, "draw_button_flat");
  flat = decryptButtonFlat(flat);

  return [
    ...line,
    ...rect,
    ...rectfi,
    ...text,
    ...numb,
    ...flot,
    ...flot2,
    ...btn,
    ...flat,
  ];
}

function findRegex(code, regex) {
  const regex_line = new RegExp(`${regex}\\(([^;]+)`, "g");
  //regex + /\(([^)]+)\)/g
  // console.log(regex_line)
  let lines = [...code.matchAll(regex_line)];

  return lines.map((elem) =>
    elem[1]
      .replace(regex, "")
      // .substring(1)
      .slice(0, -1)
      .split(",")
      .map((sub) => sub.replace(/ /g, "").replace(/\"/g, ""))
  );
}

function decryptLine(arr) {
  let output = [];
  arr.forEach((elem) => {
    if (elem.length === 7) {
      try {
        output.push({
          type: "line",
          x1: eval(elem[0]),
          y1: eval(elem[1]),
          x2: eval(elem[2]),
          y2: eval(elem[3]),
          color: elem[4],
          alpha: elem[5],
          lineWidth: eval(elem[6]),
        });
      } catch (error) {}
    }
  });
  return output;
}

function decryptRect(arr) {
  let output = [];
  arr.forEach((elem) => {
    if (elem.length === 7) {
      try {
        // console.log(elem)
        output.push({
          type: "rect",
          x: eval(elem[0]),
          y: eval(elem[1]),
          length: eval(elem[2]),
          height: eval(elem[3]),
          color: elem[4],
          alpha: elem[5],
          lineWidth: eval(elem[6] == "RECT_WIDTH" ? 2 : elem[6]),
        });
      } catch (error) {}
    }
  });
  return output;
}

function decryptRectFill(arr) {
  let output = [];
  arr.forEach((elem) => {
    if (elem.length === 6) {
      try {
        output.push({
          type: "rectFill",
          x1: eval(elem[0]),
          y1: eval(elem[1]),
          x2: eval(elem[2]),
          y2: eval(elem[3]),
          color: elem[4],
          alpha: elem[5],
        });
      } catch (error) {}
    }
  });
  return output;
}

function decryptText(arr) {
  let output = [];
  arr.forEach((elem) => {
    if (elem.length === 7) {
      try {
        output.push({
          type: "text",
          x: eval(elem[0]),
          y: eval(elem[1]),
          textSize: eval(elem[2]),
          centerAlignment: elem[3],
          string: elem[4],
          color: elem[5],
          alpha: elem[6],
        });
      } catch (error) {}
    }
  });
  return output;
}

function decryptFloat(arr) {
  let output = [];
  arr.forEach((elem) => {
    if (elem.length === 6) {
      try {
        output.push({
          type: "float",
          x: eval(elem[0]),
          y: eval(elem[1]),
          textSize: eval(elem[2]),
          number: elem[3],
          color: elem[4],
          alpha: elem[5],
        });
      } catch (error) {}
    }
  });
  return output;
}

function decryptButton(arr) {
  let output = [];
  arr.forEach((elem) => {
    if (elem.length === 10) {
      try {
        output.push({
          type: "button",
          x: eval(elem[0]),
          y: eval(elem[1]),
          length: eval(elem[2]),
          height: eval(elem[3]),
          textSize: eval(elem[4]),
          buttonStatus: elem[5],
          string: elem[6],
          textColor: elem[7],
          buttonColor: elem[8],
          alpha: elem[9],
        });
      } catch (error) {}
    }
  });
  return output;
}

function decryptButtonFlat(arr) {
  let output = [];
  arr.forEach((elem) => {
    if (elem.length === 9) {
      try {
        output.push({
          type: "buttonFlat",
          x: eval(elem[0]),
          y: eval(elem[1]),
          length: eval(elem[2]),
          height: eval(elem[3]),
          textSize: eval(elem[4]),
          string: elem[5],
          textColor: elem[6],
          buttonColor: elem[7],
          alpha: elem[8],
        });
      } catch (error) {}
    }
  });
  return output;
}

function compile_code(code) {
  let output = code.split(/(;[\s]+)/g);
  let vars = [];

  output.forEach((elem) => {
    if (elem.match(/([\s]*=[\s]*[0-9]+)/g)) {
      let matched = elem.match(/([a-z0-9._]+[\s]*=[\s]*[0-9]+)/g);
      if (matched) {
        let variables = matched[0].split(/([\s]*=[\s]*)/g);

        if (!isNaN(variables[2])) {
          vars.push({
            name: variables[0],
            value: variables[2],
          });
        }
      }
    }
  });
  code = replace_vars(code, vars);
  return code;
}

function replace_vars(code, vars) {
  if (vars.length == 0) return code;

  vars.forEach((elem) => {
    // console.log(elem.name)
    code = code.split(elem.name).join(elem.value);
  });

  return code;
}

exports.decryptCode = decryptCode;
