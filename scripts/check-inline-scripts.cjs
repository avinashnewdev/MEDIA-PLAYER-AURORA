const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const scripts = [];
const tagPattern = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
let match;

while ((match = tagPattern.exec(html)) !== null) {
  if (/\bsrc\s*=/.test(match[1])) continue;
  if (!match[2].trim()) continue;
  scripts.push(match[2]);
}

if (scripts.length === 0) {
  console.error('No inline JavaScript found in index.html.');
  process.exit(1);
}

const tempFile = path.join(os.tmpdir(), 'aurora-inline-script-check.js');
try {
  for (let i = 0; i < scripts.length; i++) {
    fs.writeFileSync(tempFile, scripts[i], 'utf8');
    const result = spawnSync(process.execPath, ['--check', tempFile], { encoding: 'utf8' });
    if (result.status !== 0) {
      console.error('Inline script #' + (i + 1) + ' in index.html has a syntax error:');
      process.stderr.write(result.stderr || result.stdout || 'node --check failed\n');
      process.exit(result.status || 1);
    }
  }
  console.log('JavaScript syntax OK: ' + scripts.length + ' inline script(s).');
} finally {
  try { fs.unlinkSync(tempFile); } catch {}
}
