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

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === "serial") {
      return true;
    }
    return false;
  });

  mainWindow.loadURL("http://localhost:3000");
  mainWindow.maximize();
};

const runBackup = () => {
  const isPackaged = app.isPackaged;
  let fullPath = isPackaged ? path.dirname(app.getPath("exe")) : __dirname;

  const projectRoot = fullPath
    .split(path.sep)
    .slice(0, fullPath.split(path.sep).indexOf("gestionale-wasabi") + 1)
    .join(path.sep);
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

const closeCmdProcesses = () => {
  // Run taskkill to close all CMD/PowerShell windows
  exec("taskkill /F /IM cmd.exe /T", (err, stdout, stderr) => {
    if (err) {
      console.error(`Error killing CMD processes: ${stderr}`);
    } else {
      console.log(`Successfully killed CMD processes: ${stdout}`);
    }
  });

  exec("taskkill /F /IM powershell.exe /T", (err, stdout, stderr) => {
    if (err) {
      console.error(`Error killing PowerShell processes: ${stderr}`);
    } else {
      console.log(`Successfully killed PowerShell processes: ${stdout}`);
    }
  });
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    runBackup();
    setTimeout(() => {
      closeCmdProcesses();
    }, 10 * 1000);
    app.quit();
  }
});

app.on("ready", createWindows);

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindows();
  }
});
