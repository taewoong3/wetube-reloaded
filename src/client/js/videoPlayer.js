const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let timelineTimeout = null;
let controlsMovementTimeout = null;
let constrolsMovementTimeline = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (event) => {
  event.stopPropagation(); // 이벤트 버블링 현상 막기
  // if the video is playing, pause it
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = (event) => {
  event.stopPropagation();
  // 처음에는 음소거가 되지 않았기 때문에 false
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtnIcon.classList = "fas fa-volume-mute";
  }

  if (value == 0) {
    muteBtnIcon.classList = "fas fa-volume-mute";
  } else {
    muteBtnIcon.classList = "fas fa-volume-up";
  }
  volumeValue = value;
  video.volume = value;
};

// const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(14, 19);
const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(14, 19);

// UI 업데이트
const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration)); //<video> 요소의 총 재생 시간을 초 단위로 나타내는 속성
  timeline.max = Math.floor(video.duration); // 오직 메타데이터로 로드 되었을 때만, 비디오의 길이를 알 수 있다.
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime)); //현재 video가 실행되는 시간을 말함.
  timeline.value = Math.floor(video.currentTime);

  if (parseInt(timeline.value) == Math.floor(video.duration)) {
    playBtnIcon.classList = "fas fa-play";
  }
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullScreen = (event) => {
  event.stopPropagation();
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const hideControls = () => videoControls.classList.remove("showing");
const hideTimeline = () => timeline.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (timelineTimeout) {
    clearTimeout(timelineTimeout);
    timelineTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  if (constrolsMovementTimeline) {
    clearTimeout(constrolsMovementTimeline);
    constrolsMovementTimeline = null;
  }
  videoControls.classList.add("showing");
  timeline.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000); // Timeout을 생성할 때 고유한ID 를 반환한다.
  constrolsMovementTimeline = setTimeout(hideTimeline, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
  timelineTimeout = setTimeout(hideTimeline, 3000);
};

// 스페이스바를 눌렀을 때 버튼 클릭 이벤트 발생시키는 코드
document.addEventListener("keydown", function (event) {
  if (event.code == "Space") {
    handlePlayClick(event);
  }
});

// videoControls 바 클릭 시 발생하는 버블링 현상 차단
const handleNothingAnyBody = (event) => {
  event.stopPropagation();
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange); //change 이벤트는 마우스를 놓았을 때, input 이벤트는 실시간
//video.addEventListener("loadedmetadata", handleLoadedMetadata); // 예: 비디오의 너비, 높이, 지속 시간 등 해당 데이터를 메타데이터라 하고, 해당 데이터로 로드 되었을 때 발생하는 이벤트
video.addEventListener("loadeddata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate); // 비디오 시간이 변경되는걸 감지하는 event.
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
videoContainer.addEventListener("click", handlePlayClick);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
videoControls.addEventListener("click", handleNothingAnyBody);
/**
 * 이러한 이벤트도 있다는걸 알려주는 용도
 */
// video.addEventListener("pause", handlePause);
// video.addEventListener("play", handlePlay);
