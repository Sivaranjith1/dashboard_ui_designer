const btns = document.querySelectorAll(".add-btns");

btns.forEach((elem) => {
  elem.addEventListener("click", addBtnClick);
});

function addBtnClick(e) {
  const { id } = e.target;

  switch (id) {
    case "rect":
      draw_rect({
        x: 470,
        y: 280,
        length: 100,
        height: 100,
        lineWidth: 2,
        color: "FINE_GREEN",
      });
      break;

    case "rectWithFill":
      draw_rectFill({
        x1: 470,
        y1: 280,
        x2: 470 + 100,
        y2: 280 + 100,
        color: "FINE_GREEN",
      });
      break;

    case "text":
      draw_text({
        x: 470,
        y: 280,
        textSize: 28,
        string: "text",
        centerAlignment: "OPT_LEFTX",
        color: "WHITE",
      });
      break;

    case "button":
      draw_buttonFlat({
        x: 470,
        y: 270,
        length: 100,
        height: 25,
        buttonColor: "RED",
        textSize: 28,
        textColor: "WHITE",
        string: "text",
      });
      break;

    default:
      break;
  }

  backgroundLayer.draw();
}
