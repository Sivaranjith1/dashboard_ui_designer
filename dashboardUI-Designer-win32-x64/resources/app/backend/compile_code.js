const fs = require("fs");
const path = require("path");
const { decryptCode } = require("./code_import");

function export_code(mainWindow) {
  mainWindow.webContents.send("code:export:request");
}

function saveFile(electron, data) {
  let output = data.join("\n");
  electron.dialog
    .showSaveDialog({
      title: "Save file",
      defaultPath: __dirname + "\\draw.txt",
      buttonLabel: "Save",
      filters: [
        { name: "txt", extensions: ["txt"] },
        { name: "All Files", extensions: ["*"] },
      ],
    })
    .then((filename) => {
      try {
        fs.writeFileSync(filename.filePath, output, "utf-8");
      } catch {}
    });
}

function loadFile(electron, mainWindow) {
  electron.dialog
    .showOpenDialog()
    .then((filename) => {
      if (filename === undefined) return;
      if (filename.filePaths.length == 0) return;

      if (filename.filePaths[0].match(/.txt$/g) == null) return;

      fs.readFile(filename.filePaths[0], "utf-8", (err, data) => {
        if (err) return;

        const decrypted = decryptCode(data);

        mainWindow.webContents.send("code:import", decrypted);
        mainWindow.focus();
      });
    })
    .catch((e) => {
      return;
    });
}

function loadMultipleFile(electron, mainWindow) {
  electron.dialog
    .showOpenDialog({
      title: "Open folder",
      buttonLabel: "Open folder",
      properties: ["openDirectory"],
      filters: [
        { name: "text", extensions: ["txt"] },
        { name: "All files", extensions: ["*"] },
      ],
    })
    .then((filename) => {
      if (filename === undefined) return;
      if (filename.filePaths.length == 0) return;

      const folder = filename.filePaths[0];
      fs.readdir(folder, async (err, files) => {
        if (err) return;

        let promiseArr = [];
        files.forEach((file) => {
          if (file.match(/.txt$/g) == null) return;

          const fileToLoad = path.join(folder, file);
          const promise = new Promise((resolve, reject) => {
            fs.readFile(fileToLoad, "utf-8", (err, data) => {
              if (err) return;

              const decrypted = decryptCode(data);
              resolve({ name: file.split(".")[0], code: decrypted });
            });
          });

          promiseArr.push(promise);
        });

        const multipleMenus = await Promise.all(promiseArr); //.then((values) => console.log("value", values));

        if (multipleMenus.length == 0) return;

        mainWindow.webContents.send("code:import:multiple", multipleMenus);
        mainWindow.focus();
      });
    })
    .catch((e) => console.log(e));
}

function menuChange(mainWindow, data) {
  const { compiled } = data;
  const decrypted =
    compiled == undefined ? [] : decryptCode(compiled.join(" "));
  const toSend = {
    index: data.index,
    decrypted,
  };
  mainWindow.webContents.send("menu:decrypted", toSend);
}

exports.export_code = export_code;
exports.saveFile = saveFile;
exports.loadFile = loadFile;
exports.loadMultipleFile = loadMultipleFile;
exports.menuChange = menuChange;
