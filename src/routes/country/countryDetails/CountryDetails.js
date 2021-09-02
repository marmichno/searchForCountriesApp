//css
import CountryDetailsCSS from './countryDetails.module.scss';
//hooks
import { useEffect, useState, useCallback } from 'react';
import { useHistory } from "react-router-dom";
//requests
import {getCountryDetails} from '../../../requests/countryDetails/getCountryDetails';

export const CountryDetails = (state) =>{

    const history = useHistory();

    //in case of undefined state
    const country = state.location.state === undefined ? "Poland" : state.location.state.countryName;

    const [countryData, setCountryData] = useState(false);

    //returns true if country data is already saved in local storage
    const checkIfAlreadyFetched = useCallback(() => {
        let localData = JSON.parse(localStorage.getItem('countriesData'));
        if(localData !== null){
            const checkArr = localData.filter(val => {
                if(val.name === country){
                    return true;
                }else{
                    return false;
                }
            })
            if(checkArr.length > 0){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    },[country])

    //returns object saved in local storage
    const findSearchedCountry = useCallback(() => {
        let localData =  JSON.parse(localStorage.getItem('countriesData'));
        return localData.filter(val => val.name === country ? true : false)[0];
    },[country])

    useEffect(() => {
        //if object exists in local storage return object. If not fetch and save data to local storage
        if(checkIfAlreadyFetched()){
            const countryData = findSearchedCountry()
            setCountryData(countryData);
        }else{
            const getCountryData = async () => {
                const response = await getCountryDetails(country);
                setCountryData(response[0])
                let array = [];
                let localData = JSON.parse(localStorage.getItem('countriesData'));
                if(localData !== null){
                    array.push(...localData, response[0]);
                }else{
                    array.push(response[0]);
                }
                localStorage.setItem('countriesData', JSON.stringify(array));
            }
            getCountryData();
        }
    },[country, checkIfAlreadyFetched, findSearchedCountry]);

    const goBack = () => {
        const location = {
            pathname: '/'
        }

        history.push(location);
    }

    return(
        <div className={CountryDetailsCSS.detailsContainer}>

            <div className={CountryDetailsCSS.detailsContainer__goBack} onClick={goBack}>&#8592;</div>

            <div className={CountryDetailsCSS.detailsContainer__contentContainer}>
                {countryData ?
                <>
                    <div className={CountryDetailsCSS.detailsContainer__contentContainer__flag} style={{backgroundImage:`url(${countryData.flag})`}}></div>

                        <div className={CountryDetailsCSS.detailsContainer__contentContainer__textContent}>
                            <h2 className={CountryDetailsCSS.detailsContainer__contentContainer__textContent__h2}>{countryData.name}</h2>
                            <div>capital: <b>{countryData.capital}</b></div>
                            <div className={CountryDetailsCSS.detailsContainer__contentContainer__currencies}>
                                {countryData.currencies.map((val, index) => {
                                    return <div key={val + index} className={CountryDetailsCSS.detailsContainer__contentContainer__currencies__data}>
                                        - currency code: <b>{val.code}</b><br/>
                                        - currency name: <b>{val.name}</b><br/>
                                        - currency symbol: <b>{val.symbol}</b><br/>
                                        {index === 0 ? <br></br> : null}
                                    </div>
                                })}
                        </div>
                    </div>
                </>
                : null
                }
            </div>
        </div>
    )
}