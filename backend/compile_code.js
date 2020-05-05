const fs = require("fs");

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

exports.export_code = export_code;
exports.saveFile = saveFile;
