const { app, BrowserWindow, screen } = require("electron");
const path = require("path");
const { exec } = require("child_process");

let mainWindow;
let secondWindow;

const createWindows = () => {
  const displays = screen.getAllDisplays();
  const primaryDisplay = screen.getPrimaryDisplay();
  const secondaryDisplay = displays.find((d) => d.id !== primaryDisplay.id);

  // Create the main window on the primary monitor
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:3000");
  mainWindow.maximize();

  // if (secondaryDisplay) {
  //   secondWindow = new BrowserWindow({
  //     width: 1920,
  //     height: 1080,
  //     x: secondaryDisplay.bounds.x,
  //     y: secondaryDisplay.bounds.y,
  //     webPreferences: {
  //       preload: path.join(__dirname, "preload.js"),
  //       contextIsolation: true,
  //       nodeIntegration: false,
  //     },
  //   });

  //   secondWindow.loadURL("http://youtube.com");
  //   secondWindow.maximize();
  // }
};

const runBackup = () => {
  const isPackaged = app.isPackaged;
  let fullPath = isPackaged ? path.dirname(app.getPath("exe")) : __dirname;

  const projectRoot = fullPath.split(path.sep).slice(0, fullPath.split(path.sep).indexOf("gestionale-wasabi") + 1).join(path.sep);
  const backupScript = path.join(projectRoot, "scripts", "Backup-Database.ps1");
  const backupDir = path.dirname(backupScript);

  exec(
    `start powershell -ExecutionPolicy Bypass -Command "& { $host.UI.RawUI.BackgroundColor = 'Black'; Clear-Host; & '${backupScript}' }"`,
    {
      cwd: backupDir,
      detached: true,
      stdio: "ignore",
    }
  );
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    runBackup();
    app.quit();
  }
});

app.on("ready", createWindows);

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindows();
  }
});
