const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
  // if the video is playing, pause it
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Paused";
};

const handleMute = (e) => {
  // 처음에는 음소거가 되지 않았기 때문에 false
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtn.innerText = video.muted ? "UnMute" : "Mute";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }

  if (value == 0) {
    muteBtn.innerText = "UnMute";
  } else {
    muteBtn.innerText = "Mute";
  }
  volumeValue = value;
  video.volume = value;
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange); //change 이벤트는 마우스를 놓았을 때, input 이벤트는 실시간

/**
 * 이러한 이벤트도 있다는걸 알려주는 용도
 */
// video.addEventListener("pause", handlePause);
// video.addEventListener("play", handlePlay);
