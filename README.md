# Search for Countries App

![searchCountries](https://user-images.githubusercontent.com/72525469/131825005-94c1f1ee-c302-4236-a4e9-13fed354b2c0.gif)

## About project

Searchbar which dynamically downloads countries data from rest api.<br>
Received data is sorted alphabetically after get response.<br>
Pagination displaying only for more than 20 search results.<br>
Subpage for every searched country which includes currency details and capital.<br>
Data from rest api is saved in array of objects [{input: userInput, output: responseData}]. Before every request function checks if data isnt already stored.<br>
API: https://restcountries.eu/

## Tech

- react
- sass - css modules with bem notation
- HTML
- React router dom - routing

## Installation

And run those comands in project directory:
```sh
git clone https://github.com/marmichno/searchForCountriesApp.git
cd countries
npm install
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.
