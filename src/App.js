import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './styles.css';

//components
import {CountriesListContainer} from './routes/home/countriesListContainer/CountriesListContainer';
import {CountryDetails} from './routes/country/countryDetails/CountryDetails';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={CountriesListContainer}/>
        <Route path='/countryDetails' exact component={CountryDetails}/>
      </Switch>
    </Router>
  );
}

export default App;
