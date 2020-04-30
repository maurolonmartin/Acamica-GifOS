var recorder;
var stream;
var video;
var urlBlobGif;
var blob;
const idVideoRecord = document.getElementById('videoRecord');
const clipboard = new Clipboard();

function startVideoRecording() {

  addRemoveClass('principalBox', 'hide', 'show');
  addRemoveClass('videoPreview', 'show', 'hide');
  addRemoveClass('videoRecord', 'show', 'hide');

  validateAndPrepareNavigator();

  navigator.mediaDevices.getUserMedia(videoConstraints)
    .then(async function(stream) {
      this.stream = stream;
      showVideoRecording(stream);

      recorder = RecordRTC(stream, {
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 832,
        height: 434,

        onGifRecordingStarted: function() {
          takeScreenshotFromRecord();
        }
      });
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    });
}

function captureGif(){
  addRemoveClass('captureGif', 'hide', 'show');
  addRemoveClass('camaraSvg', 'hide', 'show');
  addRemoveClass('spanCheckbefore', 'hide', 'show');
  addRemoveClass('spanRecording', 'show', 'hide');
  addRemoveClass('chronometerGif', 'show2', 'hide');
  addRemoveClass('recordingSvg', 'show2', 'hide');
  addRemoveClass('readyGif', 'show', 'hide');
  recorder.startRecording();

}

function readyGif(){
  addRemoveClass('spanRecording', 'hide', 'show');
  addRemoveClass('chronometerGif', 'hide', 'show');
  addRemoveClass('recordingSvg', 'hide', 'show2');
  addRemoveClass('readyGif', 'hide', 'show');
  addRemoveClass('spanPreview', 'show', 'hide');
  addRemoveClass('chronometerGif2', 'show', 'hide');
  addRemoveClass('btn-play-preview-gif', 'show2', 'hide');
  addRemoveClass('preview-progress-bar-gif', 'show2', 'hide');
  addRemoveClass('repeatCapture', 'show', 'hide');
  addRemoveClass('uploadGif', 'show', 'hide');
  stopVideoRecording();
}

async function uploadGif() {
  addRemoveClass('spanPreview', 'hide', 'show');
  addRemoveClass('chronometerGif2', 'hide', 'show');
  addRemoveClass('btn-play-preview-gif', 'hide', 'show2');
  addRemoveClass('preview-progress-bar-gif', 'hide', 'show2');
  addRemoveClass('repeatCapture', 'hide', 'show');
  addRemoveClass('uploadGif', 'hide', 'show');
  addRemoveClass('videoRecord', 'hide', 'show');
  addRemoveClass('gifPreview', 'hide', 'show');
  addRemoveClass('spanUploading', 'show', 'hide');
  addRemoveClass('contentUploadingGif', 'show2', 'hide');
  addRemoveClass('div-upload-progress-bar-gif', 'show2', 'hide');
  addRemoveClass('btns-uploading-gif', 'show', 'hide');
  addRemoveClass('btns-uploading-gif', 'show', 'hide');
  let formdata = new FormData();
  formdata.append('api_key', apiKey);
  formdata.append('username', userName);
  formdata.append('file', blob );

  const uploadGif = await requestFetch(
    'POST',
    urlUpload,
    formdata,
    true
  );

  if (uploadGif?.data) {
    addRemoveClass('videoPreview', 'hide', 'show');
    addRemoveClass('spanUploading', 'hide', 'show');
    addRemoveClass('contentUploadingGif', 'hide', 'show2');
    addRemoveClass('div-upload-progress-bar-gif', 'hide', 'show2');
    addRemoveClass('btns-uploading-gif', 'hide', 'show');
    addRemoveClass('btns-uploading-gif', 'hide', 'show');
    addRemoveClass('successfullyUploadedGif', 'show', 'hide');


    let uploadedGifs = localStorage.getItem(keyUploadedGifs);
    if(uploadedGifs) {
      uploadedGifs += ','+ uploadGif.data.id; 
      localStorage.setItem(keyUploadedGifs, uploadedGifs);
    } else {
      localStorage.setItem(keyUploadedGifs, uploadGif.data.id);
    }
    await getMyGifOS();
    await getGifByIDFromLocalStorage(uploadGif.data.id);
  }
};

const getMyGifOS = async () => {
  const uploadedGifs = localStorage.getItem(keyUploadedGifs);

  if (uploadedGifs) {
    myGifosFromLocalStorage = await requestFetch(
      'GET',
      `${urlGetGifById}${uploadedGifs}&api_key=${apiKey}`
    );
  }

  drawGif(myGifosFromLocalStorage?.data, 'div-my-gifos-gif', false, false);
};

const getGifByIDFromLocalStorage = async (id) => {
  const gifById = myGifosFromLocalStorage.data.filter((gif) => gif.id === id)[0];
  let {
    images: {
      fixed_height: { url }
    }
  } = gifById;
  urlGif = url;
};

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
  document.getElementById('gifPreview').setAttribute('src', urlBlobGif);
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
    blob = recorder.getBlob();
    urlBlobGif = URL.createObjectURL(blob);
    tracks.forEach(track => track.stop());
    recorder.reset();
    recorder.destroy();
    document.getElementById('gifPreview').classList.replace('hide', 'show');
    document.getElementById('videoRecord').classList.replace('show', 'hide');
  });
}

function takeScreenshotFromRecord() {
  try {
    // Taken from https://developer.mozilla.org/es/docs/WebRTC/Taking_webcam_photos
    let canvas = document.createElement('canvas'); // Dynamically Create a Canvas Element
    canvas.id = 'extractFileCanvas'; // Give the canvas an id
    canvas.width = video.videoWidth; // Set the width of the Canvas
    canvas.height = video.videoHeight; // Set the height of the Canvas
    let ctx = canvas.getContext('2d'); // Get the "CTX" of the canvas
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight); // Draw your image to the canvas
    var urlBlobPng = canvas.toDataURL('image/png'); // This will save your image as a //png file in the base64 format.
    document.getElementById('gifPreview').setAttribute('src', urlBlobPng);
    document.getElementById('gifPicture').setAttribute('src', urlBlobPng);
  } catch (err) {
    console.error(`Failed to take screenshot from record. ${err}`);
  }
}

function downloadGuifo(e) {
  e.preventDefault();
  invokeSaveAsDialog(blob)
}

 function copyLinkGuifo(){
  clipboard.copy(urlGif);
};

getMyGifOS();