const inputSearchGif = document.getElementById('searchWord');
const search = document.getElementById('search'); //search de auto complete
const trendingsGif = document.getElementById('trendingsGif'); //div padre de as tendencias
const autocompleteSuggestedSearch = document.getElementById('autocompleteSuggestedSearch'); //funcion de autocompletar
const autocompleteHashTag = document.getElementById('autocompleteHashTag');


const getSearchGif = async (inputSearch, e) => {
  if (e) e.preventDefault();

  let searchGif = document.getElementById('searchWord'); // donde se buscan los gifs
  if (!inputSearch) inputSearch = searchGif.value;

  if (inputSearch) {
    trendingsGif.placeholder = `${inputSearch} (resultados)`;
    const searchGif = await requestFetch(
      'GET',
      `${urlSearch}${inputSearch}&api_key=${apiKey}${limit}24`
    );
    drawGif(searchGif?.data, 'trendingGif', 'bottom', false);

    if (inputSearch && autocompleteSuggestedSearch.classList.contains('show')) {
      addRemoveClass('autocompleteSuggestedSearch', 'hide', 'show');
    }
  } else {
    trendingsGif.placeholder = 'Tendenciassss';
    getSuggestionsAndTredingGif();
  }
};


const getSuggestionsAndTredingGif = async () => {
  const trendingSuggestionGif = await requestFetch(
    'GET',
    `${urlTrending}?api_key=${apiKey}${limit}24`
  );
  drawGif(trendingSuggestionGif?.data.slice(0, 4), 'suggestionGif', 'top', true);

  drawGif(trendingSuggestionGif?.data.slice(4, 24), 'trendingGif', 'bottom', false);
};

inputSearchGif.addEventListener('keyup', () => {
  const wordSearch = inputSearchGif.value;
  if (wordSearch.length >= 3) {
    getAutocompleteSuggestedSearch(wordSearch);
  } else {
    addRemoveClass('autocompleteSuggestedSearch', 'hide', 'show');
    addRemoveClass('autocompleteHashTag', 'hide', 'show');
    addRemoveClass('btnSearchGif', 'btn-disabled', 'btn-primary');
  }
});

const getAutocompleteSuggestedSearch = async wordSearch => {
    const sugestedWords = await requestFetch(
      'GET',
      `${urlDataMuseApi}${wordSearch}&sp=${wordSearch.substr(0, 1)}*`
    );
  
    search.innerHTML = '';
    autocompleteHashTag.innerHTML = '';
  
    if (sugestedWords.length) {
      sugestedWords.slice(0, 3).forEach(element => {
        const word = element.word;
        const tag = word.trim().replace(/ /g, '');
        const aBusqueda = `<a class="aBusqueda" onclick="getSearchGif('${word}')">${word}</a>`;
        search.innerHTML += aBusqueda;
        const aAutocompleteHashTag = `<a onclick="getSearchGif('${word}')">#${tag}</a>`;
        autocompleteHashTag.innerHTML += aAutocompleteHashTag;
      });
    } else {
      const tag = wordSearch.trim().replace(/ /g, '');
      const aBusqueda = `<a class="aBusqueda" onclick="getSearchGif('${wordSearch}')">${wordSearch}</a>`;
      search.innerHTML += aBusqueda;
      const aAutocompleteHashTag = `<a onclick="getSearchGif('${wordSearch}')">#${tag}</a>`;
      autocompleteHashTag.innerHTML += aAutocompleteHashTag;
    }
  
    addRemoveClass('autocompleteSuggestedSearch', 'show', 'hide');
    addRemoveClass('autocompleteHashTag', 'show', 'hide');
    addRemoveClass('btnSearchGif', 'btn-primary', 'btn-disabled');
  };
  
  const closeImgGif = async index => {
    document.getElementById(`innerWindow${index}`).innerHTML = null;
    document.getElementById(`imgGif${index}`).src = null;
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
      document.getElementById(`innerWindow${index}`).innerHTML = `#${tag}`;
      document.getElementById(`imgGif${index}`).src = url;
      document.getElementById(`onclickImgGif${index}`).setAttribute('onClick', `getSearchGif("${search}");`);
    }
  };
  
  getSuggestionsAndTredingGif();
  
  const addRemoveClass = (element, classToAdd, classToRemove) => {
    document.getElementById(element).classList.add(classToAdd);
    document.getElementById(element).classList.remove(classToRemove);
  };