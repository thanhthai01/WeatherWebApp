//API key de28a82158f114ab57ba9880748d3fcd
//API call http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}
require('dotenv').config();
const apiKeyOpenWeatherMap = process.env.API_KEY_OPEN_WEATHER_MAP;
const baseOpenWeatherMap = 'https://api.openweathermap.org/data/2.5/weather'
const apiUnsplash = process.env.API_KEY_UNSPLASH;
const baseUnsplash = 'https://api.unsplash.com/search/photos'

const root = document.querySelector(':root');
const weather_section = document.querySelector('.weather');
const noCity_section = document.querySelector('.noCity-section');
const codErr = document.querySelector('.codErr');
const messageErr = document.querySelector('.messageErr');
const searchInput = document.querySelector('#search-input');
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

//trien khai throttle de han che so lan goi API
const throttle = ( func, limit) => {
    limit = limit || 0;
    let last = 0;
    return () => {
        const now = new Date().getTime();
        if(now - last < limit){
            return;
        }
        last = now;
        func();
    }
}

//fetch function getWeather
const getWeather = async (city) => {
      const query = `?q=${city}&appid=${apiKeyOpenWeatherMap}&units=metric`;
      const response = await fetch(baseOpenWeatherMap + query);

      if (!response.ok) {
        // If the response status is not within the 200-299 range, there's an error
        const errorMessage = await response.json();
        return [null, errorMessage];
      }

      const data = await response.json(); // Assuming the API returns JSON data
      return [data, null];
  };

// fetch function getImageFromUnsplash form Unsplash by city
const getImageFromUnsplash = async (weatherDesc) => {
    const query = `?query=${weatherDesc}&client_id=${apiUnsplash}`;
    return (await fetch(baseUnsplash + query)).json();
}

//get property --CODRespond 404
const setProperty = async (value) => {
    root.style.setProperty('--CODRespond', `'${value}'`);
}

//set data to html

const renderWeather = async (cityInput) => {
    // //get value from input
    // const cityInput = searchInput.value.trim();

    //reset input
    searchInput.value = '';

    //save data to local storage
    localStorage.setItem('cityInput', JSON.stringify(cityInput));

    //render data to html
    const [data,error] = await getWeather(cityInput);

    if(error){
        weather_section.style.display = 'none';
        noCity_section.style.display = 'flex';

        const { cod, message } = error;
        codErr.innerHTML = `${cod}`;
        setProperty(cod);
        messageErr.innerHTML = `${message}`;
    }

    if(data){
        weather_section.style.display = 'flex';
        noCity_section.style.display = 'none';

        const {weather,main,wind,sys,name} = await data;
        //hien thi thoi tiet len giao dien
        descWeather.innerHTML = weather[0].description;
        cityName.innerHTML = name;
        imgWeather.setAttribute('src', `http://openweathermap.org/img/wn/${weather[0].icon}.png`);
        tempWeather.innerHTML = `${Math.round(main.temp)}°C`;
        sunriseTime.innerHTML = ` ${new Date(sys.sunrise * 1000).toLocaleTimeString('en-US')}`;
        sunsetTime.innerHTML = ` ${new Date(sys.sunset * 1000).toLocaleTimeString('en-US')}`;
        windSpeed.innerHTML = `${wind.speed} km/h`;
        humidity.innerHTML = `${main.humidity} %`;

        //Lay hinh anh tu Unsplash dua tren mo ta thoi tiet
        const {results} = await getImageFromUnsplash(`${weather[0].description}`);
        const randomNum = Math.floor(Math.random() * 10);
        const srcImg = results[randomNum].urls.regular;
        mainSection.style.backgroundImage = `url(${srcImg})`;
        bgUnsplash.style.backgroundImage = `url(${srcImg})`;
    }
}


searchInput.addEventListener('change', throttle(() => {
    const cityInput = searchInput.value.trim();
   renderWeather(cityInput);
},3000));

//save data to local storage
document.addEventListener('DOMContentLoaded', () => {
    const cityInput = JSON.parse(localStorage.getItem('cityInput'));
    if(cityInput){
        renderWeather(cityInput);
    }
});
