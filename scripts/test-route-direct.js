"use strict";

const path = require("path");
const fs = require("fs");

console.log("=== DIRECT ROUTE EXECUTION TEST ===");

// 1. .env yukle
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i !== -1 && !process.env[t.slice(0, i).trim()]) {
      process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
    }
  }
}

// 2. chdir to standalone
const standaloneDir = path.join(__dirname, "..", ".next", "standalone");
process.chdir(standaloneDir);

console.log("CWD set to:", process.cwd());

try {
  const routePath = path.join(
    standaloneDir,
    ".next",
    "server",
    "app",
    "api",
    "health",
    "route.js"
  );
  console.log("Loading route from:", routePath);
  const routeModule = require(routePath);
  console.log("Route module loaded successfully! Keys:", Object.keys(routeModule));
  
  // Call GET handler if present
  if (routeModule.routeModule && routeModule.routeModule.userland) {
    console.log("Userland GET function found. Calling GET()...");
    const { GET } = routeModule.routeModule.userland;
    GET(new Request("http://localhost:3000/api/health"))
      .then(async (res) => {
        console.log("GET() STATUS:", res.status);
        console.log("GET() BODY:", await res.text());
        process.exit(0);
      })
      .catch((err) => {
        console.error("GET() EXECUTION ERROR:", err);
        process.exit(1);
      });
  } else {
    console.log("Calling route handler directly...");
    console.log("Exported keys:", routeModule);
  }
} catch (err) {
  console.error("FATAL ERROR LOADING ROUTE:", err);
  process.exit(1);
}
