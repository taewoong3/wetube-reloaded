const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");

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

const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(14, 19);

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration)); //<video> 요소의 총 재생 시간을 초 단위로 나타내는 속성
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime)); //현재 video가 실행되는 시간을 말함.

  if (video.currentTime == video.duration) {
    playBtn.innerText = "Play";
  } else {
    playBtn.innerText = "Paused";
  }
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange); //change 이벤트는 마우스를 놓았을 때, input 이벤트는 실시간
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);

/**
 * 이러한 이벤트도 있다는걸 알려주는 용도
 */
// video.addEventListener("pause", handlePause);
// video.addEventListener("play", handlePlay);
