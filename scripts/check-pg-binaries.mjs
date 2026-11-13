import https from "node:https";

https.get("https://registry.npmjs.org/embedded-postgres/17.11.0-beta.19", { headers: { "User-Agent": "node/24" } }, (res) => {
  let data = "";
  res.on("data", (c) => (data += c));
  res.on("end", () => {
    const j = JSON.parse(data);
    console.log("Description:", j.description);
    console.log("Dependencies:", JSON.stringify(j.dependencies, null, 2));
    console.log("Bin:", JSON.stringify(j.bin, null, 2));
  });
}).on("error", (e) => console.error(e));
