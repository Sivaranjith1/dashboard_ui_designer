const { MSICreator } = require("electron-wix-msi");
const path = require("path");

const APP_DIR = path.resolve(__dirname, "./dashboardUI-Designer-win32-x64");
// outputDirectory: "C:\\Users\sdkca\Desktop\windows_installer",
const OUT_DIR = path.resolve(__dirname, "./windows_installer");

const msiCreator = new MSICreator({
  appDirectory: APP_DIR,
  outputDirectory: OUT_DIR,

  description: "A ui design tool for the dashboard",
  exe: "dashboardUI-Designer",
  name: "Dashboard UI Designer",
  manufacturer: "Revolve NTNU",
  version: "1.0.0",
  ui: {
    chooseDirectory: true,
  },
});

msiCreator.create().then(() => {
  msiCreator.compile();
});
