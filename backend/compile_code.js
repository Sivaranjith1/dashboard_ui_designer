const fs = require("fs");
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

exports.export_code = export_code;
exports.saveFile = saveFile;
exports.loadFile = loadFile;
