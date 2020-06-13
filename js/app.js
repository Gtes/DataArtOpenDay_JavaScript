'use strict'

const ALL_COUNTRIES_URL = 'https://restcountries.eu/rest/v2/all';
const COUNTRY_REGION_URL = 'https://restcountries.eu/rest/v2/region/';
const appContainer = document.querySelector('.countriesContainer');
const countriesContainer = document.querySelector('.countriesContainer');
const regionFilterContainer = document.querySelector('.regionFilterContainer');

const countryCardTemplate = document.getElementById('countryCardTemplate').innerHTML;
const regionFilterRadioTemplate = document.getElementById('regionFilterRadioTemplate').innerHTML;
const spinnerHtml = `<div class="lds-dual-ring"></div>`
const allCountriesDefaultRadio = `<div class="radio-element">
<input type="radio" id="allCountries" name="region" value="all" checked="checked">
<label for="allCountries">Display All</label></div>`

regionFilterContainer.addEventListener('click', onFilterByRegion, true);

init()

function init() {
    requestJson(ALL_COUNTRIES_URL)
        .then(data => {
            renderRegionFilter(getUniqueRegions(data));
            renderBoard(data);
        })
}

function requestJson(url, method = 'GET', body = null) {
    countriesContainer.innerHTML = spinnerHtml;

    return fetch(url, {
            method,
            body
        })
        .then(res => res.json())
        .catch(err => console.warn(err))
}

function renderBoard(countries) {
    const boardItemsHtml = countries.map((data) => generateCountryCard(data));
    countriesContainer.innerHTML = boardItemsHtml.join('');
}

function generateCountryCard(country) {
    const timezones = country.timezones.join(', ');

    return countryCardTemplate
        .replace('{{flag}}', country.flag)
        .replace('{{countryName}}', country.name)
        .replace('{{name}}', country.name)
        .replace('{{capital}}', country.capital)
        .replace('{{region}}', country.region)
        .replace('{{population}}', country.population)
        .replace('{{timezones}}', timezones)
        .replace('{{currencies}}', generateCurrenciesString(country.currencies))
        .replace('{{de}}', country.translations.de)
        .replace('{{es}}', country.translations.es)
        .replace('{{it}}', country.translations.it);
}

function generateCurrenciesString(currencyInfo) {
    return currencyInfo.map(currency => `${currency.code} ${currency.symbol ? currency.symbol : ''}`).join(', ');
}

function generateRegionRadio(region) {
    return regionFilterRadioTemplate
        .replace(`{{id}}`, region)
        .replace(`{{valueName}}`, region)
        .replace(`{{inputId}}`, region)
        .replace(`{{labelName}}`, region);
}

function renderRegionFilter(regions) {
    const filterItemsHtml = regions.map(regionName => generateRegionRadio(regionName));

    regionFilterContainer.innerHTML = allCountriesDefaultRadio + filterItemsHtml.join('');
}

function getUniqueRegions(countries) {
    const result = []

    for (let country of countries) {
        country.region ? result.push(country.region) : false
    }

    return [...new Set(result)]
}

function onFilterByRegion(e) {
    if (e.target.value === 'all') {
        requestJson(ALL_COUNTRIES_URL)
            .then(data => {
                renderRegionFilter(getUniqueRegions(data));
                renderBoard(data);
            })
    } else if (e.target.value) {
        requestJson(COUNTRY_REGION_URL + `${e.target.value}`)
            .then(data => renderBoard(data))
    }
}