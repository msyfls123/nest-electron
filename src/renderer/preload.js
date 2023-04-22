const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('nest', {
  getWindowSize() {
    return ipcRenderer.invoke('getWindowSize');
  },
  createWindow() {
    return ipcRenderer.send('createWindow');
  },
});
