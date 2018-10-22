/*
const electron = require('electron');
const {app, BrowserWindow} = electron;

app.on('ready', ()=> {
    let win = new BrowserWindow({with: 800, height:600});
//    win.loadURL('google.com')
    win.loadURL(`file://${__dirname}/index.html`);
    win.webContents.openDevTools();

});
 */
const electron = require('electron')
// app Module to control application life.
// BrowserWindow Module to create native browser window.
// dialog Display native system dialogs for opening and saving files, alerting, etc.
const {
  app,
  BrowserWindow,
  dialog,
  Menu,
  MenuItem,
  ipcMain
} = electron

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

var videoPath = path.join(__dirname, 'video');
var outputPath = path.join(__dirname, 'output.csv')
var patient = {
  firstname: 'patient',
  surename: Date.now()
};

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600})

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
    	pathname: path.join(__dirname, 'index.html'),
    	protocol: 'file:',
    	slashes: true
    }))

    // Menu.insert(13, new MenuItem({label: 'MenuItem1', click() { console.log('item 1 clicked') }}))
    let mnu = Menu.getApplicationMenu()
    // console.log(mnu.items[1])
    // console.log(dialog.showOpenDialog({
    //   properties: ['openFile', 'openDirectory', 'multiSelections']
    // }))

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
    	// Dereference the window object, usually you would store windows
    	// in an array if your app supports multi windows, this is the time
    	// when you should delete the corresponding element.
    	mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
	app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
    	createWindow()

    }
})

// Change video path
ipcMain.on('set-video-path', (event, arg) => {
  let newPath = ''
  console.log(event)
  console.log(arg)
  console.log('prev' + videoPath)
  newPath = dialog.showOpenDialog(
    mainWindow,
    {properties: ['openFile', 'openDirectory', 'multiSelections']}
  )
  console.log('alter' + newPath)
  if (newPath) {
    videoPath = newPath;
  }
  event.sender.send('changed-video-path', videoPath)
})
// Change video path
ipcMain.on('set-output-path', (event, arg) => {
  let newPath = ''
  newPath = dialog.showSaveDialog(mainWindow, {})
  if (newPath) {
    outputPath = newPath;
  }
  event.sender.send('changed-output-path', outputPath)
})
ipcMain.on('set-patient', (event, arg) => {
  const {key, value} = arg
  patient[key] = value
  console.log(patient)
})
ipcMain.on('get-video-source', (event, arg) => {
  event.sender.send('changed-video-source', '/home/rp/Videos/yoga/Star Wars V The Empire Strikes Back - For my ally is the Force  Force Theme Yodas Theme - YouTube.webm')
})


ipcMain.on('goto', (event, arg) => {
  console.log(arg)
  switch (arg) {
    case 'yield-patient-data':

      mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'poll.html'),
        protocol: 'file:',
        slashes: true
      }))
      break;
    default:

  }
  // 'yield-patient-data'
  // newPath = dialog.showSaveDialog(mainWindow,
  //   {}
  // )
  // if (newPath) {
  //   outputPath = newPath;
  // }
  // event.sender.send('changed-output-path', outputPath)
})
exports.videoPath = videoPath
exports.outputPath = outputPath

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
