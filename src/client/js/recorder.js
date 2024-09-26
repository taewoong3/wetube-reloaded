// 사용자의 미디어 장치 권한을 얻어오기(카메라, 오디오)
const startBtn = document.getElementById("startBtn");

const handleRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });

  console.log(stream);
};

startBtn.addEventListener("click", handleRecording);
