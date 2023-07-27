//API key de28a82158f114ab57ba9880748d3fcd
//API call http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}
const apiKeyOpenWeatherMap = 'de28a82158f114ab57ba9880748d3fcd'
const baseOpenWeatherMap = 'https://api.openweathermap.org/data/2.5/weather'
const apiUnsplash = 'x63uFmemtwPVtI3fqORScmJd3J82UyM3s3hMtnVqCns'
const baseUnsplash = 'https://api.unsplash.com/search/photos'

const searchInput = document.querySelector('#search-input');
const searchBar = document.querySelector('.search-bar');
const mainSection = document.querySelector('.main-section');
const bgUnsplash = document.querySelector('.container');
const cityName = document.querySelector('.weather__city');
const descWeather = document.querySelector('.weather__description');
const imgWeather = document.querySelector('.weather__icon');
const tempWeather = document.querySelector('.weather__temperature');
const sunsetTime = document.querySelector('.js-sunset');
const sunriseTime = document.querySelector('.js-sunrise');
const windSpeed = document.querySelector('.js-wind-speed');
const humidity = document.querySelector('.js-humidity');


//fetch function getWeather
const getWeather = async (weather) => {
    const query = `?q=${weather}&appid=${apiKeyOpenWeatherMap}&units=metric`;
    return (await fetch(baseOpenWeatherMap + query)).json();
}

// fetch function getImageFromUnsplash form Unsplash by city
const getImageFromUnsplash = async (city) => {
    const query = `?query=${city}&client_id=${apiUnsplash}`;
    return (await fetch(baseUnsplash + query)).json();
}

if (searchInput) {
    searchInput.addEventListener('change', async () => {
        const cityInput = searchInput.value;
        searchInput.value = '';
        const {weather,main,wind,sys,name} = await getWeather(cityInput);
        descWeather.innerHTML = weather[0].description;
        cityName.innerHTML = name;
        imgWeather.setAttribute('src', `http://openweathermap.org/img/wn/${weather[0].icon}.png`);
        tempWeather.innerHTML = `${Math.round(main.temp)}°C`;
        sunriseTime.innerHTML = ` ${new Date(sys.sunrise * 1000).toLocaleTimeString('en-US')}`;
        sunsetTime.innerHTML = ` ${new Date(sys.sunset * 1000).toLocaleTimeString('en-US')}`;
        windSpeed.innerHTML = `${wind.speed} km/h`;
        humidity.innerHTML = `${main.humidity} %`;

        const {results} = await getImageFromUnsplash(`${weather[0].description}`);
        const randomNum = Math.floor(Math.random() * 10);
        const srcImg = results[randomNum].urls.regular;
        //results[randomNum].urls.raw
        mainSection.style.backgroundImage = `url(${srcImg})`;
        bgUnsplash.style.backgroundImage = `url(${srcImg})`;
    }
    )

}
