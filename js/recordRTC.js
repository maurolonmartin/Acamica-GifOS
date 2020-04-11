var recorder;
var stream;
var video;

// Taken from https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia and https://recordrtc.org/
function startVideoRecording() {
  validateAndPrepareNavigator();

  navigator.mediaDevices
    .getUserMedia(videoConstraints)
    .then(async function(stream) {
      this.stream = stream;
      showVideoRecording(stream);

      recorder = RecordRTC(stream, {
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,

        onGifRecordingStarted: function() {
          console.log("started");
        }
      });
      recorder.startRecording();
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    });
}

function validateAndPrepareNavigator() {
  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }
  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      // First get ahold of the legacy getUserMedia, if present
      var getUserMedia =
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        return Promise.reject(
          new Error("getUserMedia is not implemented in this browser")
        );
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }
}

function showVideoRecording(stream) {
  video = document.getElementById("videoRecord");
  // Older browsers may not have srcObject
  if ("srcObject" in video) {
    video.srcObject = stream;
  } else {
    // Avoid using this in new browsers, as it is going away.
    video.src = window.URL.createObjectURL(stream);
  }
  video.onloadedmetadata = function(e) {
    video.play();
  };
}

function stopVideoRecording() {
  recorder.stopRecording(function() {
    const tracks = stream.getTracks();
    let blob = recorder.getBlob();
    invokeSaveAsDialog(blob);
    tracks.forEach(track => track.stop());
    
  });
}