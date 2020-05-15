const addMenuBtn = document.querySelector(".add");
const menuBar = document.querySelector(".bottom");
let menuIndex = 0;

addMenuBtn.addEventListener("click", () => addNewMenu(menuIndex + 1));

function addNewMenu(name = "") {
  const div = document.createElement("div");
  div.innerHTML = name;
  div.classList.add("menu");
  div.setAttribute("data-index", menuIndex);
  div.addEventListener("click", menuClick);

  menuIndex++;

  menuBar.insertBefore(div, addMenuBtn);
  menus.push({ name, code: [] });

  return menuIndex - 1;
}

function menuClick({ target }) {
  const index = target.getAttribute("data-index");

  changeMenu(index);
}

function changeMenu(indexToChangeTo) {
  if (selectedMenu == indexToChangeTo) return;
  if (selectedMenu != null) {
    const compiled = compile_code();
    const data = {
      index: selectedMenu,
      compiled,
    };
    ipcRenderer.send("menu:compiled", data);
  }

  clearCanvas();
  selectedMenu = indexToChangeTo;
  code_import(null, menus[selectedMenu].code);
}

function saveMenu(e, data) {
  menus[data.index].code = data.decrypted;
}

function loadMultipleMenus(evt, data) {
  data.forEach((elem) => {
    const { code, name } = elem;

    const index = addNewMenu(name);

    clearCanvas();

    menus[index].code = code;
    code_import(null, code);
    selectedMenu = index;
  });
}
