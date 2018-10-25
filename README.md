Run server dev:
npm run test:server
./node_modules/.bin/chromedriver

<!DOCTYPE html>
<html>
<body>

<button onclick="playVid()" type="button">Play Video</button>
<button onclick="pauseVid()" type="button">Pause Video</button><br>

<video id="myVideo" width="320" height="176">
  <source src="https://addpipe.com/sample_vid/short.mp4" type="video/mp4">
  Your browser does not support HTML5 video.
</video>

<script>
var vid = document.getElementById("myVideo");

function playVid() {
    vid.play();
}

function pauseVid() {
    vid.pause();
}

vid.ontimeupdate = (e) => {
	if (Math.floor(e.target.currentTime) % 2 == 0) {
    	e.target.pause()
    }
    console.log(e.target.currentTime)
}
</script>

<p>Video courtesy of <a href="https://www.bigbuckbunny.org/" target="_blank">Big Buck Bunny</a>.</p>

</body>
</html>
