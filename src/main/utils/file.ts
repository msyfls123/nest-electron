import fs from 'fs';

export function ensureSync(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}
