const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Use Node's built-in zlib + tar approach via archiver if available
// Or just use 7-zip or robocopy + compress

const src = path.join(__dirname, '..', '.next');
const dst = path.join(__dirname, '..', 'next-build.zip');
const exclude = new Set(['cache', 'dev', 'turbopack', 'trace', 'trace-build', 'diagnostics', 'node_modules']);

// Try using archiver npm package (might be in devDeps)
try {
  const archiver = require('archiver');
  
  if (fs.existsSync(dst)) fs.unlinkSync(dst);
  
  const output = fs.createWriteStream(dst);
  const archive = archiver('zip', { zlib: { level: 6 } });
  
  output.on('close', () => {
    const mb = (archive.pointer() / 1024 / 1024).toFixed(1);
    console.log(`ZIP TAMAM: ${mb} MB`);
  });
  
  archive.on('error', (err) => { throw err; });
  archive.pipe(output);
  
  // Add .next contents excluding specified dirs
  function addDir(dirPath, zipPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (exclude.has(entry.name)) continue;
      const full = path.join(dirPath, entry.name);
      const zip = zipPath + '/' + entry.name;
      if (entry.isDirectory()) {
        addDir(full, zip);
      } else {
        archive.file(full, { name: zip });
      }
    }
  }
  
  addDir(src, '.next');
  archive.finalize();
  
} catch(e) {
  // archiver not available, use ZIP via child_process with 7z if available
  console.log('archiver not found, trying alternative...');
  
  // Try Windows built-in compress-archive via inline script
  const files = [];
  function walk(dir, rel) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (exclude.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      const relPath = rel ? rel + '/' + entry.name : entry.name;
      if (entry.isDirectory()) {
        walk(fullPath, relPath);
      } else {
        files.push({ full: fullPath, rel: relPath });
      }
    }
  }
  walk(src, '.next');
  
  // Write list to temp file for 7z
  const listFile = path.join(__dirname, 'filelist.txt');
  fs.writeFileSync(listFile, files.map(f => f.full).join('\n'));
  console.log(`${files.length} dosya bulundu`);
  
  // Try 7z
  try {
    if (fs.existsSync(dst)) fs.unlinkSync(dst);
    execSync(`"C:\\Program Files\\7-Zip\\7z.exe" a -tzip "${dst}" @"${listFile}"`, { stdio: 'inherit' });
    console.log('7-zip ile ZIP TAMAM');
  } catch(e2) {
    console.error('7-zip de bulunamadı:', e2.message);
    console.log('Lütfen 7-Zip kurun veya manuel zip oluşturun');
  }
  
  fs.unlinkSync(listFile);
}
