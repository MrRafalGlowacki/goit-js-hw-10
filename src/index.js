import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
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
  formatedPopulation = population
  .toString().replaceAll(/[^\d]/g, '').replaceAll(/(\d)(?=(?:\d\d\d)+$)/g, '$1\u0020').trim();
  const markup = `<p class="country__name">
  <img src="${flags.svg}" alt="${name} flag" height="30px"/>
      ${name}</p>
      <p class="country__list-item">Capital: <span class="country__list-resp">${capital}</span></p>
      <p class="country__list-item">Population: <span class="country__list-resp">${formatedPopulation}</span></p>
      <p class="country__list-item">Languages: <span class="country__list-resp">${langArr}</span></p>`;
  countryInfo.innerHTML = markup;
  countryList.innerHTML = '';
};
const getUrl = name =>
  `https://restcountries.com/v2/name/${name}?fields=name,capital,population,flags,languages`;

const fetchCountry = name => {
  const parsedName = name.trim();
  if (parsedName.length === 0) return;
  const url = getUrl(parsedName);
  return fetch(url)
    .then(fetchCountries => {
      if (!fetchCountries.ok) {
        throw (
          (new Error('No countries for such query!'),
          Notiflix.Notify.failure('No countries for such query!'))
        );
      }
      return fetchCountries.json();
    })
    .then(countries => {
      if (countries.length > 10)
        return (
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          ),
          (countryList.innerHTML = ''),
          (countryInfo.innerHTML = '')
        );
      if (countries.length === 1) return countryCard(countries[0]);

      return renderCountriesList(countries);
    })

    .catch(error => {
      console.error(error);
    });
};
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
