import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

const renderCountriesList = countries => {
  const markup = countries
    .map(({ flags, name }) => {
      return `<li class="country__container">
      <img src="${flags.svg}" alt="${name} flag" width="50px" />
         <span class="country__name">${name}</span></li>`;
    })
    .join('');

  countryList.innerHTML = markup;
  countryInfo.innerHTML = '';
};
const countryCard = ({ flags, name, capital, population, languages }) => {
  const langArr = languages.map(lang => lang.name).join(', ');
  const markup = `<p>
  <img src="${flags.svg}" alt="${name} flag" width="50px" />
      ${name}</p>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${langArr}</p>`;
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

input.addEventListener(
  'input',
  debounce(event => fetchCountry(event.target.value), DEBOUNCE_DELAY)
);
