const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // Dialog operations
    showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
    showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),

    // Database path
    getDbPath: () => ipcRenderer.invoke('get-db-path'),

    // App info
    appVersion: '1.1.0',
    platform: process.platform
});

// Notify when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Colony Complaints App Loaded');
});
