var cityFormEl = document.querySelector('#city-form');
var cityButtonsEl = document.querySelector('#city-buttons');
var cityInputEl = document.querySelector('#city-name');
var weatherContainerEl = document.querySelector('#weather-container');
var today = document.querySelector('#today');
var forecastContainer = document.querySelector('#forecast');
const APIKey = '4492ad54929ad918bfaa0925bc08e7ff';
var searchHistory = [];
var searchHistoryContainer = document.querySelector('#history');

// weatherContainerEl.textContent = '';

var formSubmitHandler = function (event) {
    event.preventDefault();

    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getCityData(cityName);
        appendToHistory(cityName);
        // weatherContainerEl.textContent = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a City name');
    }
};

var appendToHistory = function (search) {
    // If there is no search term return the function
    if (searchHistory.indexOf(search) !== -1) {
        return;
    }
    searchHistory.push(search);

    localStorage.setItem('search-history', JSON.stringify(searchHistory));
    renderSearchHistory();

};

// Function to display the search history list.
function renderSearchHistory() {
    searchHistoryContainer.innerHTML = '';

    // Start at end of history array and count down to show the most recent at the top.
    for (var i = searchHistory.length - 1; i >= 0; i--) {
        var btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('aria-controls', 'today forecast');
        btn.classList.add('history-btn', 'btn-history');

        // `data-search` allows access to city name when click handler is invoked
        btn.setAttribute('data-search', searchHistory[i]);
        btn.textContent = searchHistory[i];
        searchHistoryContainer.append(btn);
    }
};


var getCityData = async function (city) {
    var geoApiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + APIKey;

    const response = await fetch(geoApiUrl);
    if (response.ok) {
        const data = await response.json();
        getCityWeather(data[0]);
    }

    // console.log(response);

};

var getCityWeather = async function (data) {
    var cityLat = data.lat;
    var cityLon = data.lon;
    var city = data.name;
    if (typeof cityLat !== 'undefined' && typeof cityLon !== 'undefined') {
        var weatherApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + cityLat + '&lon=' + cityLon + '&appid=' + APIKey;
        // console.log(weatherApiUrl);

        const weatherResponse = await fetch(weatherApiUrl);
        if (weatherResponse.ok) {
            const weatherData = await weatherResponse.json();
            console.log('New data', weatherData);
            renderItems(weatherData, city);
        } else {
            alert('Error: ' + weatherResponse.statusText);
        }
    } else {
        console.error('City lat and lon are not defined');
    }
}

var renderItems = function (data, city) {
    renderCurrentWeather(data.list[0], city);
    renderForecast(data.list)
}

var renderCurrentWeather = function (weather, cityName) {
    var date = dayjs().format('M/D/YYYY');
    var temp = weather.main.temp;
    var wind = weather.wind.speed;
    var humidity = weather.main.humidity;
    var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;

    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var heading = document.createElement('h2');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');

    card.setAttribute('class', 'card');
    cardBody.setAttribute('class', 'card-body');
    card.append(cardBody);

    heading.setAttribute('class', 'h3 card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

    heading.textContent = `${cityName} (${date})`;
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('class', 'weather-img');
    heading.append(weatherIcon);
    tempEl.textContent = `Temp: ${temp}°F`;
    windEl.textContent = `Wind: ${wind} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    cardBody.append(heading, tempEl, windEl, humidityEl);

    today.innerHTML = '';
    today.append(card);

};

var renderForecast = function (dailyForecast) {
    // Create unix timestamps for start and end of 5 day forecast
    var startDt = dayjs().add(1, 'day').startOf('day').unix();
    var endDt = dayjs().add(6, 'day').startOf('day').unix();
    console.log('Start & End', startDt, endDt);
    var headingCol = document.createElement('div');
    var heading = document.createElement('h4');

    headingCol.setAttribute('class', 'col-12');
    heading.textContent = '5-Day Forecast:';
    headingCol.append(heading);

    // forecastContainer.innerHTML = '';
    // forecastContainer.append(headingCol);

    for (var i = 0; i < dailyForecast.length; i++) {

        // First filters through all of the data and returns only data that falls between one day after the current data and up to 5 days later.
        if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {
            console.log('dailyDt', dailyForecast[0]);
            // Then filters through the data and returns only data captured at noon for each day.
            if (dailyForecast[i].dt_txt.slice(11, 13) == "12") {
                renderForecastCard(dailyForecast[i]);
            }
        }
    }

}

var renderForecastCard = function (forecast) {
    // variables for data from api
    var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    var iconDescription = forecast.weather[0].description;
    var tempF = forecast.main.temp;
    var humidity = forecast.main.humidity;
    var windMph = forecast.wind.speed;

    // Create elements for a card
    var col = document.createElement('div');
    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var cardTitle = document.createElement('h5');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');

    col.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

    col.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

    col.setAttribute('class', 'col-md');
    col.classList.add('five-day-card');
    card.setAttribute('class', 'card bg-primary h-100 text-white');
    cardBody.setAttribute('class', 'card-body p-2');
    cardTitle.setAttribute('class', 'card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

    // Add content to elements
    cardTitle.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    tempEl.textContent = `Temp: ${tempF} °F`;
    windEl.textContent = `Wind: ${windMph} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;

    forecastContainer.append(col);
}

cityFormEl.addEventListener('submit', formSubmitHandler);
cityButtonsEl.addEventListener('click', buttonClickHandler);