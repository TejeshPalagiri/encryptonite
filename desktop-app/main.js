const { app, BrowserWindow } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('./views/index.html');
}

app.whenReady().then(() => {
    console.log("App is ready to launch 🚀.");
    createWindow()
})

app.on('window-all-closed', () => {
    // close on close button.
    // if(process.platform != "darwin") {
        app.quit();
    // }
})