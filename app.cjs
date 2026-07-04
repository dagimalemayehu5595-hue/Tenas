const fs = require("node:fs");
const path = require("node:path");

const startupLog = path.join(__dirname, "data", "startup-error.log");

import("./server.js").catch((error) => {
  const details = [
    new Date().toISOString(),
    error?.stack || String(error),
    ""
  ].join("\n");

  try {
    fs.mkdirSync(path.dirname(startupLog), { recursive: true });
    fs.appendFileSync(startupLog, details);
  } catch (logError) {
    console.error("Unable to write startup error log", logError);
  }

  console.error("Tenas Gym failed to load", error);
  process.exitCode = 1;
});
