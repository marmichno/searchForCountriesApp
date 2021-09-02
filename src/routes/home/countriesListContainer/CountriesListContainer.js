//css
import CountriesListCSS from './countriesListContainer.module.scss';
//hooks
import {useEffect, useState, useCallback} from 'react';
import { useHistory } from "react-router-dom";
//requests
import {getCountryNames} from '../../../requests/countriesList/getCountryNames';

export const CountriesListContainer = () => {

    const history = useHistory();

    const [searchedCountry, setSearchedCountry] = useState("");
    const [searchedOutput, setSearchedOutput] = useState("");
    const [cachedOutput, setCachedOutput] = useState([
        {
            input: "",
            output: ""
        }
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showPagination, setShowPagination] = useState(false);

    //check if output is already stored in useState
    const checkCache = useCallback(() => {
        if(cachedOutput.length > 1){
            const checkIfAlreadyFetched = cachedOutput.filter(val => val.input === searchedCountry ? true : false);
            return checkIfAlreadyFetched.length > 0 ? true : false;
        }else{
            return false;
        }
    }, [cachedOutput, searchedCountry]);

    // if response contains more than 20 elements in array create 2d array for pagination else returns 1d array
    const checkIfMoreThan20Elements = useCallback((response) => {
        if(response.length > 20){
            let newArray = [];
            let i = 0;
            for(let j = response.length + 1; (i + 2 < j); i += 20){
                newArray.push(response.slice(i, i + 20));
            }
            setCurrentPage(1);
            setSearchedOutput(newArray);
            setCachedOutput([...cachedOutput, {input:searchedCountry, output:newArray}]);
            setShowPagination(true);
        }else{
            setShowPagination(false);
            setCachedOutput([...cachedOutput, {input:searchedCountry, output:response}]);
            setSearchedOutput(response);
        }
    },[cachedOutput, searchedCountry])

    useEffect(() => {
        // if user already used this output dont fetch and return cached data
        if(checkCache()){
            const cachedValue = cachedOutput.filter(val => val.input === searchedCountry ? true : false)[0].output;
            //more than 20 elements = pagination true
            if(Array.isArray(cachedValue[0])){
                setCurrentPage(1);
                setSearchedOutput(cachedValue);
                setShowPagination(true);
            }else{
                setShowPagination(false);
                setSearchedOutput(cachedValue);
            }
        }else{
            const getCountries = async () => {
                if(searchedCountry.length > 0){
                    let response = await getCountryNames(searchedCountry);
                    //in case of http 404
                    if(response !== undefined){
                        checkIfMoreThan20Elements(response);
                    }else{
                        setShowPagination(false);
                        setSearchedOutput("");
                    }
                }else{
                    setShowPagination(false);
                    setSearchedOutput("");
                }
            }
            getCountries();
        }
    },[searchedCountry, cachedOutput, checkCache, checkIfMoreThan20Elements]);

    const changePage = (e) => {
        const page = e.target.innerHTML;
        setCurrentPage(parseInt(page));
    }

    // push to history with country name as state
    const goToCountryDetails = (e) => {
        const searchedCountry = e.target.innerHTML;
        const location = {
            pathname: '/countryDetails',
            state: {
                countryName: searchedCountry
            }
        }

        history.push(location);
    }

    return(
        <div className={CountriesListCSS.countriesListContainer}>

                <div className={CountriesListCSS.countriesListContainer__searchbarContainer}>
                <input 
                placeholder="type to search for country &#x1F50D;"
                type="text"
                className={CountriesListCSS.countriesListContainer__searchbarContainer__input}
                onChange={(e) => setSearchedCountry(e.target.value)}
                ></input>
                </div>

                <div key={currentPage} className={CountriesListCSS.countriesListContainer__countries}>
                    {searchedOutput.length > 0 && !showPagination ? 
                        searchedOutput.map((val, index) => {
                            return <div key={val + index} className={CountriesListCSS.countriesListContainer__countries__country} style={{backgroundImage:`url(${val.flag})`}} 
                            onClick={goToCountryDetails}>
                                <div className={CountriesListCSS.countriesListContainer__countries__country__name}>{val.name}</div>
                            </div>
                        })
                        : null
                    }
                    {searchedOutput.length > 0 && showPagination ? 
                        searchedOutput.map((val, index) => {
                            if(index + 1 === currentPage){
                                return(
                                    val.map((val, index) => {
                                        return <div key={val + index} className={CountriesListCSS.countriesListContainer__countries__country} style={{backgroundImage:`url(${val.flag})`}}
                                         onClick={goToCountryDetails}>
                                             <div className={CountriesListCSS.countriesListContainer__countries__country__name}>{val.name}</div>
                                         </div>
                                    })
                                )
                            }else{
                                return null;
                            }
                        })
                        : null
                    }
                </div>

                {showPagination ?
                    <div className={CountriesListCSS.countriesListContainer__pagination}>
                        {searchedOutput.map((val, index) => {
                            return <div key={val + index} className={CountriesListCSS.countriesListContainer__pagination__page}
                            style={index + 1 === currentPage ?{fontWeight:"600"}: null}
                            onClick={changePage}>
                                {index + 1}
                            </div>
                        })}
                    </div>
                    : <div className={CountriesListCSS.countriesListContainer__pagination}></div>
                }
        </div>
    )
}