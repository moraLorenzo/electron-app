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
  }
  
  if(!isDev){
    autoUpdater.checkForUpdates();
  }
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

