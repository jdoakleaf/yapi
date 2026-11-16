"use strict";

const { spawn } = require("child_process");
const http = require("http");

console.log("=== STARTING SERVER ON PORT 3001 FOR DEBUG ===");

const serverProcess = spawn("node", ["server.js"], {
  env: Object.assign({}, process.env, { PORT: "3001", HOSTNAME: "127.0.0.1" }),
  cwd: "/var/www/vhosts/lagan.com.tr/httpdocs",
});

let serverLogs = "";
serverProcess.stdout.on("data", (d) => {
  const s = d.toString();
  serverLogs += s;
  process.stdout.write("[SERVER] " + s);
});

serverProcess.stderr.on("data", (d) => {
  const s = d.toString();
  serverLogs += s;
  process.stderr.write("[ERROR] " + s);
});

// 3 saniye bekle, server baslasin, sonra istek at
setTimeout(() => {
  console.log("\n--> ISTEK GONDERILIYOR: http://127.0.0.1:3001/api/health ...");
  
  const req = http.get("http://127.0.0.1:3001/api/health", (res) => {
    console.log("RESPONSE STATUS:", res.statusCode);
    console.log("RESPONSE HEADERS:", JSON.stringify(res.headers, null, 2));
    let body = "";
    res.on("data", (c) => (body += c));
    res.on("end", () => {
      console.log("RESPONSE BODY:", body);
      setTimeout(() => {
        serverProcess.kill();
        process.exit(0);
      }, 1000);
    });
  });

  req.on("error", (e) => {
    console.error("ISTEK HATASI:", e.message);
    serverProcess.kill();
    process.exit(1);
  });
}, 3000);
