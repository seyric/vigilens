const { app, BrowserWindow, dialog, session } = require("electron");
const { createHash } = require("crypto");
const { existsSync, readFileSync } = require("fs");
const { join } = require("path");
const { spawn } = require("child_process");
const http = require("http");

const isDev = !app.isPackaged;
const desktopMode = process.env.VIGILENS_DESKTOP_MODE || "operator";
const frontendUrl =
  process.env.VIGILENS_FRONTEND_URL || "http://127.0.0.1:5173";
const backendUrl = process.env.VIGILENS_BACKEND_URL || "http://127.0.0.1:8000";
let backendProcess;

function sha256File(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function usbKeyIsValid() {
  if ((process.env.USB_KEY_REQUIRED || "false").toLowerCase() !== "true")
    return true;

  const keyPath = process.env.USB_KEY_PATH;
  const expectedHash = (process.env.USB_KEY_SHA256 || "").toLowerCase();
  if (!keyPath || !expectedHash || !existsSync(keyPath)) return false;

  try {
    return sha256File(keyPath).toLowerCase() === expectedHash;
  } catch {
    return false;
  }
}

function waitForBackend(timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const probe = () => {
      const request = http.get(`${backendUrl}/`, (response) => {
        response.resume();
        if (response.statusCode && response.statusCode < 500) return resolve();
        retry();
      });
      request.on("error", retry);
      request.setTimeout(1000, () => request.destroy());
    };
    const retry = () => {
      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`Backend did not become ready at ${backendUrl}`));
      } else {
        setTimeout(probe, 250);
      }
    };
    probe();
  });
}

function startBackend() {
  if (process.env.VIGILENS_START_BACKEND !== "true") return;

  const projectRoot = join(__dirname, "..");
  const packagedServer = join(
    process.resourcesPath,
    "server",
    "vigilens-server.exe",
  );
  if (!isDev && existsSync(packagedServer)) {
    backendProcess = spawn(packagedServer, [], {
      cwd: process.resourcesPath,
      env: { ...process.env, PYTHONUNBUFFERED: "1" },
      windowsHide: true,
      stdio: "ignore",
    });
    return;
  }
  const python =
    process.env.VIGILENS_PYTHON ||
    (isDev
      ? join(projectRoot, ".venv", "Scripts", "python.exe")
      : join(
          process.resourcesPath,
          "backend",
          ".venv",
          "Scripts",
          "python.exe",
        ));
  const backendRoot =
    process.env.VIGILENS_BACKEND_ROOT ||
    (isDev ? projectRoot : join(process.resourcesPath, "backend"));
  backendProcess = spawn(
    python,
    [
      "-m",
      "uvicorn",
      "backend.main:app",
      "--host",
      "127.0.0.1",
      "--port",
      "8000",
    ],
    {
      cwd: backendRoot,
      env: { ...process.env, PYTHONUNBUFFERED: "1" },
      windowsHide: true,
      stdio: "ignore",
    },
  );
}

async function createWindow() {
  if (!usbKeyIsValid()) {
    dialog.showErrorBox(
      "Vigilens is locked",
      "Insert the authorized USB key or disable USB_KEY_REQUIRED for local development.",
    );
    app.quit();
    return;
  }

  startBackend();
  try {
    await waitForBackend();
  } catch (error) {
    if (!isDev) {
      dialog.showErrorBox("Vigilens backend unavailable", error.message);
      app.quit();
      return;
    }
  }

  const window = new BrowserWindow({
    fullscreen: true,
    kiosk: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (isDev) {
    await window.loadURL(
      `${frontendUrl}/#/${desktopMode === "admin" ? "admin" : "loading"}`,
    );
  } else {
    await window.loadFile(join(process.resourcesPath, "dist", "index.html"), {
      hash: desktopMode === "admin" ? "/admin" : "/loading",
    });
  }
}

app.whenReady().then(async () => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self' 'unsafe-inline' http://127.0.0.1:8000",
        ],
      },
    });
  });
  await createWindow();
});

app.on("window-all-closed", () => app.quit());
app.on("before-quit", () => {
  if (backendProcess && !backendProcess.killed) backendProcess.kill();
});
