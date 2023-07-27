//API key de28a82158f114ab57ba9880748d3fcd
//API call http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}
const apiKeyOpenWeatherMap = 'de28a82158f114ab57ba9880748d3fcd'
const baseOpenWeatherMap = 'https://api.openweathermap.org/data/2.5/weather'
const apiUnsplash = 'x63uFmemtwPVtI3fqORScmJd3J82UyM3s3hMtnVqCns'
const baseUnsplash = 'https://api.unsplash.com/search/photos'

//fetch function getWeather
const getWeather = async (city) => {
    const query = `?q=${city}&appid=${apiKeyOpenWeatherMap}&units=metric`;
    return (await fetch(baseOpenWeatherMap + query)).json();
}

const btnWeather = document.querySelector('.js-getWeather');
const weatherContent = document.querySelector('.content');
const bgUnsplash = document.querySelector('.container');

if (btnWeather) {
    btnWeather.addEventListener('click', async () => {
        const {weather} = await getWeather('London');
        description = weather[0].description;
        weatherContent.innerHTML= `${description}`;

        const {results}= await getImages(`${description}`);
        const randomNum = Math.floor(Math.random() * 10);
        bgUnsplash.innerHTML= `<img src="${results[randomNum].urls.raw}" alt="${results[randomNum].alt_description}">`;
        console.log(randomNum);
        console.log(results);
    }
    )
}

// fetch function getImages form Unsplash by city
const getImages = async (city) => {
    const query = `?query=${city}&client_id=${apiUnsplash}`;
    return (await fetch(baseUnsplash + query)).json();
}
