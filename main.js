const { app, BrowserWindow } = require('electron')
const path = require('path')

// Port dedie a l'API du mode 301 pour eviter les conflits avec un autre service local.
process.env.GAME301_API_PORT = process.env.GAME301_API_PORT || '3010'

const { startServer, stopServer } = require('./API/joueur/server')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Flechette",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // Page d'accueil chargee au demarrage de l'application Electron.
  win.loadFile(path.join(__dirname, 'frontend/home/home.html'))
}

app.whenReady().then(() => {
  // On demarre d'abord l'API, puis l'interface.
  startServer()
  createWindow()
})

app.on('window-all-closed', () => {
  // On ferme aussi le serveur quand l'application se ferme.
  stopServer()
  if (process.platform !== 'darwin') app.quit()
})
