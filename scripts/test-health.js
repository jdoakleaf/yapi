"use strict";

const http = require("http");

console.log("=== HEALTH ENDPOINT TESTI ===");

// 1. Standalone uygulamasının portunu kontrol et
const port = process.env.PORT || 3000;
console.log("Hedef port:", port);

const req = http.get(
  {
    hostname: "127.0.0.1",
    port: port,
    path: "/api/health",
    headers: { host: "lagan.com.tr" },
  },
  (res) => {
    console.log("STATUS:", res.statusCode);
    console.log("HEADERS:", JSON.stringify(res.headers, null, 2));

    let body = "";
    res.on("data", (chunk) => (body += chunk));
    res.on("end", () => {
      console.log("BODY:", body);
      process.exit(0);
    });
  }
);

req.on("error", (err) => {
  console.error("HTTP GET HATASI:", err.message);
  process.exit(1);
});

req.setTimeout(5000, () => {
  console.error("TIMEOUT 5s");
  req.destroy();
  process.exit(1);
});
