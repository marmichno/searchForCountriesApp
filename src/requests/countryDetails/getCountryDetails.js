export const getCountryDetails = async (countryName) => {
    console.log('fired');
    try{
        const request = await fetch(`https://restcountries.eu/rest/v2/name/${countryName}?fields=name;capital;currencies;flag`);
        const response = await request.json();
        return response;
    }catch(error){
        console.log(error);
    }
}