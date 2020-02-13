'use strict'


function show_hide() {
    var click = document.getElementById("dropdown");
    if(click.style.display === "none") {
        click.style.display = "block";
    }else {
        click.style.display = "none";
    }
}

// selector de thema
function changeTheme1() {
    document.getElementById("theme").setAttribute("href", "./css/pages/theme1.css");
    console.log("boton rosa presionado");
}

function changeTheme2() {
    
    document.getElementById("theme").setAttribute("href", "./css/pages/theme2.css");
    console.log("boton blue presionado");
}
//const element = document.getElementsByTagName("img");

const apiUrl = "https://api.giphy.com/v1/gifs/"

const apiKey = "HfrTQGC7YgwToMnjlu7ccclqG6807Mg0";


document.addEventListener("DOMContentLoaded", trendig);

document.addEventListener("DOMContentLoaded", init);
function init() {
    
   document.getElementById("btnSearch").addEventListener("click", ev => {
       removeTag();
       
       ev.preventDefault();
       let url = `${apiUrl}search?api_key=${apiKey}&q=`;
       let str = document.getElementById("search").value.trim();
       url = url.concat(str);
       console.log(url);
       fetch(url)
       .then(response => response.json())
       .then(content => {
        let data = [];
        data = content.data;
        //console.log(data);
            for( let i = 0; i < data.length; i++) {
                let img = document.createElement('img');
                img.src = data[i].images.fixed_height.url;
                img.alt = data[i].title;
                let out = document.querySelector('.out');
                out.insertAdjacentElement('afterbegin', img);
                document.querySelector('input').value="";
            }
            //removeTag();     
       })
       .catch(err => {
           console.log(err);
       });
   }); 
}

function removeTag() {
    
    var element = document.getElementsByTagName("img"), index;

    for (index = element.length - 1; index >= 0; index--) {
        element[index].parentNode.removeChild(element[index]);
        console.log("borrado ", index);
    }
}

function trendig() {
    let urlTrending = `${apiUrl}trending?api_key=${apiKey}`;
    console.log(urlTrending);
    fetch(urlTrending)
       .then(response => response.json())
       .then(content => {
        let data = [];
        data = content.data;
        console.log(data);
            for( let i = 0; i < data.length; i++) {
                let img = document.createElement('img');
                img.src = data[i].images.fixed_height.url;
                img.alt = data[i].title;
                let out = document.querySelector('.out');
                out.insertAdjacentElement('afterbegin', img);
                document.querySelector('input').value="";
            }
            //removeTag();     
       })
       .catch(err => {
           console.log(err);
       });
}
const video = document.getElementById('vid2');

function getStreamAndRecord () {
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            height: { max: 480 }
        }
    }).then(function(stream) {
        video.srcObject = stream;
        video.play()
    })
}

recorder = RecordRTC(stream, {
    type: 'gif',
    frameRate: 1,
    quality: 10,
    width: 360,
    hidden: 240,
    onGifRecordingStarted: function() {
    console.log('started')
    },
    });

function successCallback(stream) {
    document.querySelector('vid2') = URL.createObjectURL(stream);
    document.querySelector('vid2').muted = true;
    var recorder = RecordRTC(stream, {
        type: 'video'
    });
    recorder.startRecording();
    setTimeout(function() {
        recorder.stopRecording(function (){
            var blob = recorder.blob;
            var url = URL.createObjectURL(blob);
            document.getElementById('vid2').src = url;
            document.querySelector('vid2').muted = false;
        });
    }, 5 * 1000 );

}

function errorCallback( error ){
    alert(error);
}

var mediaConstrains = {
    audio: false,
        video: {
            height: { max: 480 }
        }
};

navigator.mediaDevices.getUserMedia(mediaConstrains).then(successCallback).catch(errorCallback);