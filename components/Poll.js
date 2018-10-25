const React = require('react');
const {
  TAGS1,
  TAGS2,
} = require('../config')

module.exports = class Poll extends React.Component {
  constructor(props) {
    super(props)
    this.videoRef = React.createRef();
    this.videoStopRef = React.createRef();

    this.INITIAL_STATE = {
      videoWidth: 560,
      pollCounter: 0,
      showForm: false,
    }

    this.state = this.INITIAL_STATE

    this.makeBig = this.makeBig.bind(this)
    this.makeSmall = this.makeSmall.bind(this)
    this.makeNormal = this.makeNormal.bind(this)
    this.playVideo = this.playVideo.bind(this)
    this.pauseVideo = this.pauseVideo.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  makeBig() {
    this.setState({videoWidth: 560});
  }

  makeSmall() {
    this.setState({videoWidth: 320});
  }

  makeNormal() {
    this.setState({videoWidth: 420});
  }

  pauseVideo() {
    const {
      pollingTimeInterval,
    } = this.props
    const video = this.videoRef.current
    const videoStop = this.videoStopRef.current

    // Set z-index video
    video.style.zIndex = 1
    videoStop.style.zIndex = 2

    video.pause()
    // Seek
    video.currentTime = (this.state.pollCounter + 1) * (pollingTimeInterval / 1e3)

    // Show form and increment pollCounter
    this.setState((state) => ({
      showForm: true,
      pollCounter: state.pollCounter + 1,
    }))
  }

  playVideo() {
    // debugger
    const {
      pollingTimeInterval,
    } = this.props
    const video = this.videoRef.current
    const videoStop = this.videoStopRef.current
    // Set z-index video
    video.style.zIndex = 2
    videoStop.style.zIndex = 1
    // Seek next video Pause
    videoStop.currentTime = (this.state.pollCounter + 1) * (pollingTimeInterval / 1e3)
    video.play()
    this.timer = setTimeout(() => this.pauseVideo(), pollingTimeInterval);
  }

  handleSubmit(e) {
    e.preventDefault();
    // debugger
    const radioList = e.target.firstElementChild.children
    const radioChecked = Array.from(radioList)
      .filter(radio => radio.firstElementChild.checked)[0]

    // No value selected
    if (radioChecked === undefined) {
      return
    }

    const value = radioChecked.firstElementChild.value

    this.props.submitForm(`"${value}@${this.videoStopRef.current.currentTime}"`)

    if (this.lastPoll) {
      this.props.nextVideo()

      // Init component!
      this.lastPoll = false
      this.setState(this.INITIAL_STATE)
      return null
    }

    this.playVideo()

    this.setState(() => ({
      showForm: false,
    }))
  }

  render() {
    const {
      videoSrc,
    } = this.props
    const {
      videoWidth,
      showForm,
    } = this.state
    const {
      playVideo,
      makeBig,
      makeNormal,
      makeSmall,
      handleSubmit,
    } = this
    let questions = TAGS1
    if (videoSrc && !videoSrc.includes("fight")) {
      questions = TAGS2
    }
    return (
      <div style={{textAlign: 'center'}}>
        <button id="playPause" onClick={playVideo}>Play/Pause</button>
        <button onClick={makeBig}>Big</button>
        <button onClick={makeNormal}>Normal</button>
        <button onClick={makeSmall}>Small</button>
        <br /><br />
        <div className="video-container">
          <video
            ref={this.videoRef}
            id="videoMain"
            className="video-main"
            width={videoWidth}
            onClick={playVideo}
            onEnded={() => {
              clearTimeout(this.timer)
              this.lastPoll = true;
              this.pauseVideo()
            }}
            src={videoSrc}
          >
      	    Your browser does not support HTML5 video.
          </video>
          <video
            ref={this.videoStopRef}
            className="video-shadow"
            width={videoWidth}
            onClick={playVideo}
            src={videoSrc}
          >
          </video>
        </div>
        <br />
        {
          showForm
            ? (
              <form
                id="pollForm"
                onSubmit={handleSubmit}
              >
                {/* Radio Poll */}
                <div>
                  {questions.map(question => (
                    <div key={question}>
                      <input type="radio" name="poll" value={question}/>
                      {question}
                    </div>
                  ))}
                </div>
                <input id="submitButton" type="submit" />
              </form>
            )
            : null
        }
      </div>
    );
  }
}
