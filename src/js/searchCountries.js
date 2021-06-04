import debounce from 'lodash.debounce';
import countryCardTpl from '../templates/countryCard.hbs';
import countriesListTpl from '../templates/countriesList.hbs';
import axios from 'axios';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/Angeler.css';
import { alert, defaults } from '@pnotify/core';

const BASE_URL = 'https://restcountries.eu/rest/v2/name';

axios.defaults.baseURL = BASE_URL;

function fetchCountries(searchQuery) {
  return axios(`/${searchQuery}`).then(r => r.data);
}

defaults.styling = 'angeler';
defaults.icons = 'angeler';

const manyMatchesErrorMsg = () =>
  alert({
    type: 'notice',
    text: 'To many matches found. Please enter a more specific query!',
    delay: 3000,
    sticker: false,
    animateSpeed: 'slow',
  });

const notFoundErrorMsg = () =>
  alert({
    type: 'error',
    text: 'This country was not found!',
    delay: 30000000,
    sticker: false,
    animateSpeed: 'slow',
  });

const searchInput = document.querySelector('.js-search-input');
const cardContainer = document.querySelector('.js-card-container');

const reset = () => (cardContainer.innerHTML = '');

const render = markup => {
  cardContainer.insertAdjacentHTML('beforeend', markup);
};

const renderMarkup = data => {
  const countries = data.length;
  const countryCardMarkup = countryCardTpl(data);
  const countriesListMarkup = countriesListTpl(data);

  if (countries > 10) {
    return manyMatchesErrorMsg();
  }

  if (countries >= 2 && countries <= 10) {
    render(countriesListMarkup);
  }

  if (countries === 1) {
    render(countryCardMarkup);
  }
};

const onSearch = () => {
  reset();

  const countryName = searchInput.value;

  if (!countryName) {
    return;
  }

  fetchCountries(countryName).then(renderMarkup).catch(notFoundErrorMsg);
};

searchInput.addEventListener('input', debounce(onSearch, 750));
