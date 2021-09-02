export const getCountryNames = async (searched) => {

    try{
        const request = await fetch(`https://restcountries.eu/rest/v2/name/${searched}?fields=name;flag`);
        const response = await request.json();
        return response;
    }catch(error){
        console.log(error);
    }
}