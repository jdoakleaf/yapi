import https from "node:https";
import http from "node:http";

async function testUrl(url, label) {
  return new Promise((resolve) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, { headers: { "User-Agent": "test" } }, (res) => {
      resolve({ label, status: res.statusCode, location: res.headers.location ?? "" });
      res.resume();
    });
    req.on("error", (e) => resolve({ label, status: "ERROR", location: e.message }));
    req.setTimeout(5000, () => { req.destroy(); resolve({ label, status: "TIMEOUT", location: "" }); });
  });
}

const results = await Promise.all([
  testUrl("http://localhost:3000/admin", "GET /admin (yetkisiz)"),
  testUrl("http://localhost:3000/admin/login", "GET /admin/login (giriş sayfası)"),
  testUrl("http://localhost:3000/", "GET / (public)"),
  testUrl("http://localhost:3000/api/auth/session", "GET /api/auth/session"),
]);

console.log("\n=== YETKİSİZ ERİŞİM TESTİ ===");
for (const r of results) {
  const icon = (r.status === 302 || r.status === 307 || r.status === 200) ? "✅" : "⚠️ ";
  const redirect = r.location ? ` → ${r.location}` : "";
  console.log(`${icon} [${r.status}] ${r.label}${redirect}`);
}

// /admin yetkisiz → login'e yönlendirmeli
const adminResult = results[0];
const passed = adminResult.status === 302 || adminResult.status === 307;
console.log(`\n${passed ? "✅ TEST GEÇTİ" : "❌ TEST BAŞARISIZ"}: /admin yetkisiz erişim ${adminResult.status} döndürdü.`);
