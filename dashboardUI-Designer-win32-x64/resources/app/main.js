const electron = require("electron");
const url = require("url");
const path = require("path");
const { decryptCode } = require("./backend/code_import");
const { export_code, saveFile, loadFile } = require("./backend/compile_code");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let codeWindow;
let compiledWindow;

app.on("ready", () => {
  //will run when the app is ready
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    icon: __dirname + "/icon/icon.ico",
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "mainWindow.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  //Quit app when close
  mainWindow.on("closed", () => {
    app.quit();
  });

  //Build menu
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

//-----------------------------
//     Code import window
//-----------------------------
function createCodeWindow() {
  codeWindow = new BrowserWindow({
    width: 750,
    height: 600,
    title: "Import from code",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  codeWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "codeImport.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  //garbage collection
  codeWindow.on("close", () => {
    codeWindow = null;
  });
}

//Catch code:import
ipcMain.on("code:import", (e, item) => {
  decrypted = decryptCode(item);
  console.log(decrypted);

  mainWindow.webContents.send("code:import", decrypted);

  codeWindow.close();
  mainWindow.focus();
});

//-----------------------------
//     Code exprt window
//-----------------------------
function exportCodeWindow() {
  compiledWindow = new BrowserWindow({
    width: 750,
    height: 600,
    title: "Export from code",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  compiledWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "codeExport.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  //garbage collection
  compiledWindow.on("close", () => {
    compiledWindow = null;
  });
}

//catch code:export:main
let compileData;
ipcMain.on("code:export:main", (e, data) => {
  exportCodeWindow();
  compileData = data;
});

ipcMain.on("code:export:open", () => {
  compiledWindow.send("code:export:show", compileData);
});

ipcMain.on("save:data", (e, data) => {
  saveFile(electron, data);
});

//-----------------------------
//          Menu
//-----------------------------
const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Save As",
        accelerator:
          process.platform == "darwin" ? "Command+Shift+S" : "Ctrl+Shift+S",
        click() {
          // saveFile(electron);
          mainWindow.webContents.send("save:request");
        },
      },
      {
        label: "Open",
        accelerator: process.platform == "darwin" ? "Command+O" : "Ctrl+O",
        click() {
          loadFile(electron, mainWindow);
        },
      },
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q", //hotkey
        click() {
          app.quit();
        },
      },
    ],
  },
  {
    label: "Edit",
    submenu: [
      {
        label: "Delete",
        accelerator: "delete",
        click() {
          mainWindow.webContents.send("delete");
        },
      },
      {
        label: "Clear",
        click() {
          mainWindow.webContents.send("clear");
        },
      },
    ],
  },
  {
    label: "Code",
    submenu: [
      {
        label: "Import from Code",
        click() {
          createCodeWindow();
        },
      },
      {
        label: "Compile Code",
        click() {
          export_code(mainWindow);
        },
      },
    ],
  },
];

//if mac add empty object
if (process.platform == "darwin") {
  mainMenuTemplate.unshift({});
}

//add developer item
if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Developer tools",
    submenu: [
      {
        label: "Toggle Dev tools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I", //hotkey
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
    ],
  });
}
