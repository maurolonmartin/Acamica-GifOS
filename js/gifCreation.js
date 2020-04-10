const searchGif = document.getElementById('searchWord'); // donde se buscan los gifs
const search = document.getElementById('search'); //search de auto complete
const trendingsGif = document.getElementById('trendingsGif'); //div padre de as tendencias
const autocompleteSuggestedSearch = document.getElementById('autocompleteSuggestedSearch'); //funcion de autocompletar
const autocompleteHashTag = document.getElementById('autocompleteHashTag');

document.addEventListener("DOMContentLoaded", init);
function init() {

    document.getElementById("btnSearch").addEventListener("click", ev => {

        ev.preventDefault();
        let url = `${urlSearch}search?api_key=${apiKey}&q=`;
        let str = document.getElementById("searchWord").value.trim();
        url = url.concat(str);
        let completeUrl = url.concat(`+${limit}24`);
        trendingsGif.placeholder = `${str} (resultados)`;
        fetch(completeUrl)
            .then(response => response.json())
            .then(content => {
                let data = [];
                data = content.data;
                drawGif(data, 'trendingGif', 'bottom', false);
            })
            .catch(err => {
                console.log(err);
            });
    });
}

const getSuggestionsAndTredingGif = async () => {
  const trendingSuggestionGif = await requestFetch(
    'GET',
    `${urlTrending}?api_key=${apiKey}${limit}24`
  );
  drawGif(trendingSuggestionGif?.data.slice(0, 4), 'suggestionGif', 'top', true);

  drawGif(trendingSuggestionGif?.data.slice(4, 24), 'trendingGif', 'bottom', false);
};

searchGif.addEventListener('keyup', () => {
  const wordSearch = searchGif.value;
  if (wordSearch.length >= 3) {
    getAutocompleteSuggestedSearch(wordSearch);
  } else {
    addRemoveClass('autocompleteSuggestedSearch', 'hide', 'show');
    addRemoveClass('autocompleteHashTag', 'hide', 'show');
    addRemoveClass('btnSearchGif', 'btn-disabled', 'btn-primary');
  }
});

// const getAutocompleteSuggestedSearch = async wordSearch => {
//     const sugestedWords = await requestFetch(
//       'GET',
//       `${URL_API_DATAMUSE_WORDS}${wordSearch}&sp=${wordSearch.substr(0, 1)}*`
//     );
  
//     search.innerHTML = '';
//     autocompleteHashTag.innerHTML = '';
  
//     if (sugestedWords.length) {
//       sugestedWords.slice(0, 3).forEach(element => {
//         const word = element.word;
//         const tag = word.trim().replace(/ /g, '');
//         const aBusqueda = `<a class="aBusqueda" onclick="getSearchGif('${word}')">${word}</a>`;
//         search.innerHTML += aBusqueda;
//         const aAutocompleteHashTag = `<a>#${tag}</a>`;
//         autocompleteHashTag.innerHTML += aAutocompleteHashTag;
//       });
  
//       addRemoveClass('autocompleteSuggestedSearch', 'show', 'hide');
//       addRemoveClass('autocompleteHashTag', 'show', 'hide');
//       addRemoveClass('btnSearchGif', 'btn-primary', 'btn-disabled');
//     } else {
//       addRemoveClass('autocompleteSuggestedSearch', 'hide', 'show');
//       addRemoveClass('autocompleteHashTag', 'hide', 'show');
//     }
//   };
  
  const closeImgGif = async index => {
    const randomGif = await requestFetch('GET', `${urlGetRandomGif}&api_key=${apiKey}`);
    if (randomGif?.data) {
      const {
        title,
        images: {
          fixed_height: { url }
        }
      } = randomGif.data;
      const search = title.substring(0, title.indexOf('GIF')).trim();
      const tag = search.replace(/ /g, '');
      document.getElementById(`spanImgGif${index}`).innerHTML = `#${tag}`;
      document.getElementById(`imgGif${index}`).src = url;
      document.getElementById(`onclickImgGif${index}`).setAttribute('onClick', `getSearchGif("${search}");`);
    }
  };
  
  getSuggestionsAndTredingGif();
  