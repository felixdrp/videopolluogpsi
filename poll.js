const React = require('react');
const ReactDOM = require('react-dom');
const {
  remote,
  ipcRenderer
} = require('electron')
// require('@babel/register');
const Poll = require('./components/Poll');
const {
  POLLING_TIME_INTERVAL,
  FAREWELL_TEXT,
} = require('./config')

// Change output path
ipcRenderer.on('changed-video-source', (event, video) => {
  console.log(':) ' + video)

  if (video === null) {
    ReactDOM.render(
      FAREWELL_TEXT,
      document.getElementById('root')
    );
    return
  }

  ReactDOM.render(
    React.createElement(
      Poll,
      {
        pollingTimeInterval: POLLING_TIME_INTERVAL,
        videoSrc: video,
        nextVideo: () => ipcRenderer.send('get-video-source'),
        submitForm: (result) => ipcRenderer.send('form-result', result),
      }
    ),
    document.getElementById('root')
  );
})

ipcRenderer.send('get-video-source')
