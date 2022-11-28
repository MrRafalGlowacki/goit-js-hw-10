import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountry } from './fetchCountries';
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country__list');
const countryInfo = document.querySelector('.country__info');
const DEBOUNCE_DELAY = 300;

const inputFill = event => {
  if (event.target.localName === 'img') {
    input.value = event.target.nextElementSibling.innerText;
  } else {
    input.value = event.target.innerText;
  }
};

const renderCountriesList = countries => {
  const markup = countries
    .map(({ flags, name }) => {
      return `<li class="country__container">
      <img src="${flags.svg}" alt="${name} flag" height="30px" width="50px" />
         <span class="country__name-list">${name}</span></li>`;
    })
    .join('');

  countryList.innerHTML = markup;
  countryInfo.innerHTML = '';
};

const countryCard = ({ flags, name, capital, population, languages }) => {
  const langArr = languages.map(lang => lang.name).join(', ');
  const formatedPopulation = population
    .toString()
    .replaceAll(/[^\d]/g, '')
    .replaceAll(/(\d)(?=(?:\d\d\d)+$)/g, '$1\u0020')
    .trim();
  const capitalCity = () => {
    if (!capital) {
      return 'No capital City';
    } else {
      return capital;
    }
  };
  const markup = `<p class="country__name">
  <img src="${flags.svg}" alt="${name} flag" height="30px"/>
      ${name}</p>
      <p class="country__list-item">Capital: <span class="country__list-resp">${capitalCity()}</span></p>
      <p class="country__list-item">Population: <span class="country__list-resp">${formatedPopulation}</span></p>
      <p class="country__list-item">Languages: <span class="country__list-resp">${langArr}</span></p>`;
  countryInfo.innerHTML = markup;
  countryList.innerHTML = '';
};
const getUrl = name =>
  `https://restcountries.com/v2/name/${name}?fields=name,capital,population,flags,languages`;

const country = async () => {
  const url = getUrl(input.value);
  try {
    const fetchCountries = await fetch(url);
    const countries = await fetchCountries.json();
    return countryCard(countries[0]);
  } catch (error) {
    console.error(error);
  }
};

input.addEventListener(
  'input',
  debounce(event => fetchCountry(event.target.value), DEBOUNCE_DELAY)
);
countryList.addEventListener('click', inputFill);
countryList.addEventListener('click', country);

export { countryInfo, countryList, countryCard, renderCountriesList, getUrl };
