function convert_color(color) {
  switch (color) {
    case "BLACK":
      return rgbToHex(0, 0, 0);
      break;
    case "NICE_BLACK":
      return rgbToHex(100, 100, 100);
      break;
    case "BG_BLACK":
      return rgbToHex(28, 28, 28);
      break;
    case "GREY":
      return rgbToHex(100, 100, 100);
      break;
    case "TEXT_GREY":
      return rgbToHex(150, 150, 150);
      break;
    case "BG_GREY":
      return rgbToHex(89, 89, 89);
      break;
    case "WHITE":
      return rgbToHex(255, 255, 255);
      break;
    case "RED":
      return rgbToHex(255, 0, 0);
      break;
    case "GREEN":
      return rgbToHex(0, 255, 0);
      break;
    case "DARK_GREEN":
      return rgbToHex(0, 130, 0);
      break;
    case "FINE_GREEN":
      return rgbToHex(40, 200, 65);
      break;
    case "HV_ORANGE":
      return rgbToHex(243, 146, 0);
      break;
    case "GLV_BLUE":
      return rgbToHex(12, 109, 255);
      break;
    case "BLUE":
      return rgbToHex(0, 0, 255);
      break;
    case "YELLOW":
      return rgbToHex(255, 255, 0);
      break;
    case "DARK_YELLOW":
      return rgbToHex(130, 130, 0);
      break;
    case "SELECT_YELLOW":
      return rgbToHex(243, 202, 62);
      break;
    case "PURPLE":
      return rgbToHex(255, 0, 255);
      break;
    case "NICE_RED":
      return rgbToHex(227, 0, 0);
      break;
    case "NICE_BLUE":
      return rgbToHex(8, 81, 107);
      break;
    case "NICE_ORANGE":
      return rgbToHex(255, 145, 6);
      break;
    case "NICE_GREEN":
      return rgbToHex(126, 174, 39);
      break;
    case "ROSE":
      return rgbToHex(234, 80, 118);
      break;
    case "BROWN":
      return rgbToHex(139, 69, 19);
      break;
    default:
      return rgbToHex(0, 0, 0);
      break;
  }
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function hexToColor(hex) {
  let rgb = hexToRgb(hex);
  return `COLOR(${rgb.r},${rgb.g},${rgb.b})`;
}
