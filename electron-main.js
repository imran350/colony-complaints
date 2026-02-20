const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');

// Keep a global reference of the window object
let mainWindow;
let serverModule;

// Use project folder database (same as web app)
const dbPath = path.join(__dirname, 'complaints.db');

// Create database if doesn't exist
if (!fs.existsSync(dbPath)) {
    console.log('Creating new database...');
    fs.writeFileSync(dbPath, '');
}

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1000,
        minHeight: 700,
        title: 'Colony Complaints Management',
        icon: path.join(__dirname, 'icon-256.png'),
        show: false, // Don't show until loaded
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false // Allow local files
        }
    });

    // Remove menu bar
    mainWindow.setMenuBarVisibility(false);

    // Wait for content to load then show
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });

    // Load the app
    mainWindow.loadURL('http://localhost:3000');

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Check if server is ready
function waitForServer(callback, retries = 30) {
    if (retries === 0) {
        console.error('Server failed to start');
        app.quit();
        return;
    }

    const req = http.get('http://localhost:3000/api/stats', (res) => {
        if (res.statusCode === 200) {
            console.log('Server is ready!');
            callback();
        } else {
            setTimeout(() => waitForServer(callback, retries - 1), 500);
        }
    });

    req.on('error', () => {
        console.log('Waiting for server...');
        setTimeout(() => waitForServer(callback, retries - 1), 500);
    });

    req.setTimeout(1000, () => {
        req.abort();
    });
}

// Create window when Electron is ready
app.whenReady().then(async () => {
    // Set database path before loading server
    process.env.COMPLAINTS_DB_PATH = dbPath;

    // Check if server is already running
    const checkServer = () => {
        return new Promise((resolve) => {
            const req = http.get('http://localhost:3000/api/stats', (res) => {
                resolve(res.statusCode === 200);
            });
            req.on('error', () => resolve(false));
            req.setTimeout(1000, () => {
                req.abort();
                resolve(false);
            });
        });
    };

    const serverRunning = await checkServer();

    if (!serverRunning) {
        // Start the Express server only if not running
        console.log('Starting server...');
        serverModule = require('./server.js');
        await serverModule.startServer();
    } else {
        console.log('Server already running, connecting to it...');
    }

    // Wait for server then create window
    waitForServer(() => {
        createWindow();
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
    console.log('App closing - creating backup...');
    if (serverModule && serverModule.createBackup) {
        serverModule.createBackup();
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle app quit
app.on('before-quit', () => {
    console.log('Creating final backup before quit...');
    if (serverModule && serverModule.createBackup) {
        serverModule.createBackup();
    }
});

// IPC handlers for native dialogs
ipcMain.handle('show-save-dialog', async (event, options) => {
    const result = await dialog.showSaveDialog(mainWindow, options);
    return result;
});

ipcMain.handle('show-open-dialog', async (event, options) => {
    const result = await dialog.showOpenDialog(mainWindow, options);
    return result;
});

ipcMain.handle('get-db-path', () => {
    return dbPath;
});
