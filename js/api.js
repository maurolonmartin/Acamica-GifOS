'use strict'

function show_hide() {
    var click = document.getElementById("dropdown");
    if (click.style.display === "none") {
        click.style.display = "block";
    } else {
        click.style.display = "none";
    }
}

// selector de thema
function changeTheme1() {
    document.getElementById("theme").setAttribute("href", "./css/pages/theme1.css");
    document.getElementById("logo").setAttribute("src", "./assets/gifOF_logo.png");
}

function changeTheme2() {
    document.getElementById("theme").setAttribute("href", "./css/pages/theme2.css");
    document.getElementById("logo").setAttribute("src", "./assets/gifOF_logo_dark.png");
}

const video = document.getElementById('vid2');

function getStreamAndRecord() {
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            height: { max: 480 }
        }
    }).then(function (stream) {
        video.srcObject = stream;
        video.play()
    })
}