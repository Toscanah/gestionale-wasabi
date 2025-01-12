const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let win;

function createWindow() {
  // Create the browser window
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Allows Node.js in renderer (if necessary)
      preload: path.join(__dirname, "preload.js"), // Preload script if needed
    },
  });

  // Load your Next.js app, either from the development server or production build
  // win.loadURL("http://localhost:3000/home"); // If running the Next.js app in dev mode
  win.loadFile(path.join(__dirname, '/build')) // For production build
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
