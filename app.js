// const { app, BrowserWindow, ipcMain } = require('electron');
// const { autoUpdater } = require('electron-updater');

// let mainWindow;

// function createWindow () {
//   mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       nodeIntegration: true,
//     },
//   });
//   mainWindow.loadFile('dist/electron-app/index.html');
//   mainWindow.on('closed', function () {
//     mainWindow = null;
//   });

//   mainWindow.once('ready-to-show', () => {
//     autoUpdater.checkForUpdatesAndNotify();
//   });
// }

// app.on('ready', () => {
//   createWindow();
// });

// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// app.on('activate', function () {
//   if (mainWindow === null) {
//     createWindow();
//   }
// });

// ipcMain.on('app_version', (event) => {
//   event.sender.send('app_version', { version: app.getVersion() });
// });

// autoUpdater.on('update-available', () => {
//   mainWindow.webContents.send('update_available');
// });
// autoUpdater.on('update-downloaded', () => {
//   mainWindow.webContents.send('update_downloaded');
// });
const path = require("path");
const { app, dialog, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");
const isDev = require("electron-is-dev");

const createWindow = () => {

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
  });

  // win.loadURL(
  //   isDev ? "http://localhost:4200" : `file://${path.join(__dirname, "dist/electron-app/index.html")}`
  // );

  win.loadFile(path.join(__dirname, 'dist/electron-app/index.html'))

  if(isDev){
    win.webContents.openDevTools({mode: "detach"});
    // require()
  };
  
  if(!isDev){
    autoUpdater.checkForUpdates();
  };
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if(process.platform !== "darwin"){
    app.quit();
  }
});

app.on("activate", () => {
  if(BrowserWindow.getAllWindows().length === 0){
    createWindow();
  }
});

autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
	const dialogOpts = {
		type: 'info',
		buttons: ['Ok'],
		title: 'Application Update',
		message: process.platform === 'win32' ? releaseNotes : releaseName,
		detail: 'A new version is being downloaded. Please do not close the system.'
	}
	dialog.showMessageBox(dialogOpts, (response) => {

	});
})

autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been installed. Restart the application to apply the updates.'
  }
  dialog.showMessageBox(dialogOpts, (returnValue) => {
    if(returnValue.response === 0) autoUpdater.quitAndInstall();
  })

});

