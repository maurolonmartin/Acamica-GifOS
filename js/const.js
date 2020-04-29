/* GIPHY INFO */
const apiKey = "HfrTQGC7YgwToMnjlu7ccclqG6807Mg0";
const userName = "maurolonmartin";
const urlSearch = 'https://api.giphy.com/v1/gifs/search?q=';
const urlTrending = 'https://api.giphy.com/v1/gifs/trending';
const urlUpload = 'https://upload.giphy.com/v1/gifs';
const urlGetGifById = 'https://api.giphy.com/v1/gifs?ids=';
const urlGetRandomGif = 'https://api.giphy.com/v1/gifs/random?rating=G';
const limit = '&limit=';
const urlAutoComplete = 'https://api.giphy.com/v1/gifs/search/tags?';

var videoConstraints = {
    audio: false,
    video: {
      width: { exact: 832 },
        height: { exact: 437 }

    }
  };

const requestFetch = async (method, url, data, withOutParse) => {
  const result = await fetch(url, requestOptions(method, data, withOutParse))
    .then(response => {
      return response.json();
    })
    .then(result => {
      return result;
    })
    .catch(error => {
      console.error('error', error);

    });
  return result;
};

const requestOptions = (method, data, withOutParse) => {
  return {
    method: method,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: data && withOutParse ? data : data && !withOutParse ? JSON.stringify(data) : null
  };
};



const drawGif = (images, section, whereShowHashTag, showButton) => {
  const divImages = document.getElementById(section);
  divImages.innerHTML = '';

  if (!images) {
    divImages.innerHTML = "<p class='withoutResults'> Sin resultados </p>";
  } else {
    images.forEach((image, index) => {
      const {
        title,
        images: {
          fixed_height: { url }
        }
      } = image;
      const search = title.substring(0, title.indexOf('GIF')).trim();
      const tag = search.replace(/ /g, '');

      const img = `<img class="imgGif" id="imgGif${index}" src=${url} alt=${title}></img>`;

      const divImgGif = `<div class="divImgGif divImgGif${section}">
        ${
          whereShowHashTag == 'top'
            ? `<p class="gradient hashTagTop">
                <span id="innerWindow${index}" id="spanImgGif${index}">#${tag}</span>
                <a onclick="closeImgGif(${index})">
                  <img id="closeImgGif(${index})" src="../../assets/close.svg" alt="close_gif" class="closeGif" />
                </a>
              </p>`
            : ''
        }
        ${img}
        ${showButton ? `<a class="gifButton" id="onclickImgGif${index}" onclick="getSearchGif('${search}')">Ver más...</a>` : ''}
        ${whereShowHashTag == 'bottom' ? `<p class="gradient hashTagBottom">#${tag}</p>` : ''}
      </div>`;

      divImages.innerHTML += divImgGif;
    });
  }
};

const addRemoveClass = (element, classToAdd, classToRemove) => {
  document.getElementById(element).classList.add(classToAdd);
  document.getElementById(element).classList.remove(classToRemove);
};