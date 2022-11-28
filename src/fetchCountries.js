import Notiflix from 'notiflix';
import {
  countryInfo,
  countryList,
  countryCard,
  renderCountriesList,
  getUrl,
} from './index';
const letters = /^[A-Za-z]+$/;
export const fetchCountry = name => {
  const parsedName = name.trim();
  if (parsedName.length === 0) return;
  if (!letters.test(parsedName)) {
    return Notiflix.Notify.info('Use Alphabet characters only');
  }
  const url = getUrl(parsedName);
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw (
          (new Error('No countries for such query!'),
          Notiflix.Notify.failure('No countries for such query!'))
        );
      }
      return response.json();
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
