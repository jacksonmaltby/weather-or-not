var cityFormEl = document.querySelector('#city-form');
var cityButtonsEl = document.querySelector('#city-buttons');
var cityInputEl = document.querySelector('#city-name');
var weatherContainerEl = document.querySelector('#weather-container');
var APIKey = '4492ad54929ad918bfaa0925bc08e7ff';

var formSubmitHandler = function (event) {
    event.preventDefault();

    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getCityWeather(cityName);

        weatherContainerEl.textContent = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a City name');
    }
};

var getCityWeather = function (city) {
    var geoApiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + APIKey;

    fetch(geoApiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    var cityLat = ;
                    var cityLon = ;
                })
            }
        })

    var weatherApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + cityLat + '&lon=' + cityLon + '&appid=' + APIKey;

    fetch(weatherApiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayWeather(data, city);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeather');
        });
};

var displayWeather = function (weather, searchTerm) {

}

cityFormEl.addEventListener('submit', formSubmitHandler);
cityButtonsEl.addEventListener('click', buttonClickHandler);