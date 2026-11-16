"use strict";

const fs = require("fs");
const path = require("path");

function walk(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(full));
    } else if (entry.isFile() && /\.(tsx|ts)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const allFiles = walk(path.join(__dirname, "..", "src", "app"));
let count = 0;

for (const file of allFiles) {
  let content = fs.readFileSync(file, "utf8");
  if (content.includes("export const instant = false;")) {
    content = content.replace(/export const instant = false;\r?\n?/g, "");
    fs.writeFileSync(file, content, "utf8");
    console.log("Updated:", file);
    count++;
  }
}

console.log(`Total files cleaned: ${count}`);
