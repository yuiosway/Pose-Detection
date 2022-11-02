//selectors
const start = document.querySelector(".green");
const end = document.querySelector(".red");
var canvas = document.getElementById('canvas');
canvas.width  = 640;
canvas.height = 480;
var ctx = canvas.getContext('2d');
const video = document.getElementById('video');
var detector = null;

start.addEventListener("click", function() {
  navigator.mediaDevices.getUserMedia({
    video: {
      width: 640,
      height: 480,
      frameRate: 30
    }
  }).then(async function(stream) {
    video.srcObject = stream;
    detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER});
    video.play();
  }).catch(function(err) {});
});

end.addEventListener("click", function() {
  video.pause();
});

video.addEventListener('play', function () {
  var $this = this; 
  (function loop() {
      if (!$this.paused && !$this.ended) {
          ctx.drawImage($this, 0, 0, 640, 480);
          detect(detector);
          setTimeout(loop, 1000 / 30); 
      }
  })();
}, 0);



const detect = async (detector) => {
  var pose = await detector.estimatePoses(video);
  if(pose!=null) {
    console.log('Output:');
    console.log(pose);
    console.log(pose[0].keypoints);
    drawCanvas(pose[0]);
  }
};

const drawCanvas = (pose) => {
  drawKeypoints(pose["keypoints"], 0.6);
  drawSkeleton(pose["keypoints"], 0.7);
};

const drawKeypoints = (keypoints, minConfidence, scale = 1) => {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];
    if (keypoint.score < minConfidence) {
      continue;
    }
    drawPoint(keypoint.y * scale, keypoint.x * scale, 7, "red");
  }
}

const drawPoint = (y, x, r, color) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}







