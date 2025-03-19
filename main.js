const { app, BrowserWindow, screen } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");

let mainWindow;

function createWindows() {
  const displays = screen.getAllDisplays();
  const primaryDisplay = screen.getPrimaryDisplay();

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
    return details.deviceType === "serial";
  });

  mainWindow.loadURL("http://localhost:3000");
  mainWindow.maximize();
}

/**
 * Executes a command in a Promise-based way
 * @param {string} command - The command to execute
 * @returns {Promise<string>}
 */
function executeCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        console.error(`[ERRORE] ${stderr}`);
        reject(stderr);
      } else {
        console.log(`[SUCCESSO] ${stdout}`);
        resolve(stdout);
      }
    });
  });
}

/**
 * Runs the backup script asynchronously.
 * @returns {Promise<void>}
 */
async function runBackup() {
  console.log("[INFO] Avvio del backup del database.");

  const isPackaged = app.isPackaged;
  const fullPath = isPackaged ? path.dirname(app.getPath("exe")) : __dirname;

  const projectRoot = fullPath
    .split(path.sep)
    .slice(0, fullPath.split(path.sep).indexOf("gestionale-wasabi") + 1)
    .join(path.sep);
  const backupScript = path.join(projectRoot, "scripts", "Backup-Database.ps1");
  const backupDir = path.dirname(backupScript);

  try {
    await executeCommand(`powershell -ExecutionPolicy Bypass -File "${backupScript}"`, {
      cwd: backupDir,
    });
    console.log("[SUCCESSO] Backup completato con successo.");
  } catch {
    console.warn("[WARN] Il backup del database potrebbe non essere stato completato.");
  }
}

/**
 * Stops the server gracefully by freeing port 3000 and killing the process
 * @returns {Promise<void>}
 */
async function killServer() {
  console.log("[INFO] Arresto del server Next.js");

  const projectRoot = path.join(__dirname, "..");
  const pidFile = path.join(projectRoot, "gestionale-wasabi", "scripts", "server.pid");

  if (!fs.existsSync(pidFile)) {
    console.log("[ERRORE] Il file PID non esiste:", pidFile);
    return;
  }

  const pid = fs.readFileSync(pidFile, "utf8").trim();

  if (!pid || isNaN(pid)) {
    console.log("[ERRORE] PID non valido:", pid);
    return;
  }

  console.log(`[INFO] Arresto del server sulla porta 3000 e con PID: ${pid}`);

  try {
    await executeCommand("npx kill-port 3000");
    console.log("[SUCCESSO] Porta 3000 liberata.");
  } catch {
    console.warn("[WARN] Impossibile liberare la porta 3000. Potrebbe non essere in uso.");
  }

  try {
    await executeCommand(`taskkill /F /PID ${pid}`);
    console.log("[SUCCESSO] Server terminato correttamente.");
    fs.unlinkSync(pidFile); // Remove PID file after termination
  } catch {
    console.warn("[WARN] Impossibile terminare il server. Potrebbe essere già chiuso.");
  }
}

app.on("window-all-closed", async () => {
  if (process.platform !== "darwin") {
    console.log("[INFO] Chiusura dell'applicazione in corso...");

    await runBackup(); // Ensure backup completes before killing server
    await killServer(); // Ensure server is killed before quitting

    console.log("[INFO] Chiusura dell'applicazione dopo il completamento dei processi.");
    app.quit();
  }
});

app.on("ready", createWindows);

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindows();
  }
});
