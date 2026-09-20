const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("vigilensDesktop", {
  isDesktop: true,
  version: process.env.npm_package_version || "0.0.0",
});
