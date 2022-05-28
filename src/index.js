import './css/styles.css';

import { fetchCountries } from './fetchCountries';

import debounce from 'lodash.debounce';

import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryInput.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));

function onCountryInput() {
  const name = countryInput.value.trim();
  if (name === '') {
    return (countryList.innerHTML = ''), (countryInfo.innerHTML = '');
  }
  fetchCountries(name)
    .then(countries => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      if (countries.length === 1) {
        countryList.insertAdjacentHTML('beforeend', renderCountryList(countries));
        countryInfo.insertAdjacentHTML('beforeend', renderCountryInfo(countries));
      } else if (countries.length >= 10) {
        alertTooManyMatches();
      } else {
        countryList.insertAdjacentHTML('beforeend', renderCountryList(countries));
      }
    })
    .catch(alertWrongName);
}

function renderCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
        <li class = "country-list_item">
            <img class = "list country-list_flag" src = "${flags.svg}" alt = "Flag of ${name.official}"width = 100px height = 60px>
            <h2 class = "country-list_name">${name.official}</h2>
            </li>
            `;
    })
    .join('');
  return markup;
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `
        <ul class = "country-info_list">
            <li class = "country-info_item"><p><b>Capital: </b>${capital}</p></li>
            <li class = "country-info_item"><p><b>Population: </b>${population}</p></li>
            <li class = "country-info_item"><p><b>languages: </b>${Object.values(languages).join(
              ', ',
            )}</p></li>
        </ul>
        `;
    })
    .join('');
  return markup;
}

function alertWrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function alertTooManyMatches() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}
