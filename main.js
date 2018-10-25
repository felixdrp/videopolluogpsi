require('@babel/register');
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

// var csvWriter = require('csv-write-stream')
var fs = require('fs')
// var writer = csvWriter()

// writer.pipe(fs.createWriteStream('out.csv'))
// writer.write({hello: "world", foo: "bar", baz: "taco"})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

var videoPath = path.join(__dirname, 'video');
var outputPath = path.join(__dirname, 'output.csv')
var patient = {
  firstname: 'patient',
  surname: Date.now()
};

var data = {}

var videoFiles;
var videoPointer = -1;

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600})

    videoFiles = fs.readdirSync(videoPath);
    console.log(JSON.stringify(videoFiles))
    videoPointer = -1;

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

    saveAndIncrement()

    // writer.end();
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
    videoPath = newPath[0];
    videoFiles = fs.readdirSync(videoPath);
    console.log(JSON.stringify(videoFiles))
    videoPointer = -1;
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
  if ( videoPointer > -1){
    saveAndIncrement()
  }
  videoPointer++
  if (videoFiles[videoPointer] === undefined) {
    event.sender.send('changed-video-source', null)
    return
  }
  event.sender.send('changed-video-source', videoPath+"/"+videoFiles[videoPointer])
})

ipcMain.on('form-result', (event, arg) => {
  if( !data[videoFiles[videoPointer]] ){
    data[videoFiles[videoPointer]] = []
  }

  data[videoFiles[videoPointer]].push (arg)
  console.log(data[videoFiles[videoPointer]])
  // writer.write({patient : JSON.stringify(patient), data : ["ME", "LA", "COME"]})
  //event.sender.send('changed-video-source', '/home/rp/Videos/yoga/Star Wars V The Empire Strikes Back - For my ally is the Force  Force Theme Yodas Theme - YouTube.webm')
})

ipcMain.on('goto', (event, arg) => {
  console.log(arg)
  switch (arg) {
    case 'yield-patient-data':
      // writer.pipe(fs.createWriteStream(outputPath)) //open the writer stream

      data[videoFiles[videoPointer]] = [];

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

function saveAndIncrement(){
  if( !videoFiles[videoPointer] ){
    console.log("out of bound videopointer: =probably last video is finished")
    return;
  }

  var numberedData = ""
  numberedData = numberedData + (patient["firstname"] ? patient["firstname"] : "no name") +","
  numberedData = numberedData + (patient["surname"] ? patient["surname"] : "no surname") +","
  numberedData = numberedData + videoFiles[videoPointer] +","

  for ( var a = 0; a< data[videoFiles[videoPointer]].length; a++){
    numberedData = numberedData + data[videoFiles[videoPointer]][a] +","
  }

  console.log("writting: "+numberedData)

  fs.appendFileSync(outputPath, numberedData+"\n");
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
