import os from 'os';

export function getSocketPath(socketName: string) {
  if (os.platform() === 'win32') {
    return `//./pipe/${socketName}`;
  }
  return `/tmp/${socketName}.sock`;
}

export function getSocketUrl(socketName: string, pathname = '') {
  if (os.platform() === 'win32') {
    return `unix:////./pipe/${socketName}:${pathname}`;
  }
  return `unix:///tmp/${socketName}.sock:${pathname}`;
}
