
//define variables for html elements
const cityName = document.getElementById('cityName');
const searchButton = document.getElementById('searchButton');
const futureForecast = document.getElementById('resultsFiveDay');
const forecastToday = document.getElementById('resultsToday');
const state = document.getElementById('state');
const searchHistory = document.getElementById('searchHistory');
//define variable for APIKey
const APIKey = `b657affac026785e279a481f8fd5894c`;
const history = JSON.parse(localStorage.getItem('history'))||[]

//fetch request
const getWeather = function(cityName, stateName) {
    console.log(`got weather?`);
    let city = cityName;
    let state = stateName;
    const queryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},3166-2&appid=${APIKey}`;
    fetch(queryURL).then (function (response) {
        if (response.ok) {
            return response.json();
        } else {
            alert(`Error: ${response.statusText}`)
        }
    }).then(function (data) {
        console.log(data);
        console.log(data[0].lat, data[0].lon);
        fiveDayForecast(data[0].lat, data[0].lon);
    })
    .catch (function(error){
        console.log(error);
        alert('Unable to reach Weather API');
    });

};

const fiveDayForecast = function(lattitude, longitude) {
    //const coordinatesArray = [];
    //coordinatesArray.push(coordinate);
    const lat = lattitude;
    const lon = longitude;

    const forecastUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,&appid=${APIKey}`;

    fetch(forecastUrl).then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                alert(`Error: ${response.statusText}`);
            };
    }).then(function(data) {
        console.log(data);
        parseWeather(data);
        parseWeeklyForecast(data);
    })
    .catch (function (error) {
        console.log(error);
        alert('Unable to reach Weather API');
    });
};

const parseWeather = function (weather) {
    console.log(weather.current);
    let time = dayjs.unix(weather.current.dt).format('MMM D, YYYY, hh:mm:ss a');
    let temp = parseInt(weather.current.temp);
    let weatherDaily = (weather.current.weather[0].description);
    console.log(time);
    console.log(temp);
    console.log(weatherDaily);
    renderCurrentForecast(weather);
};

const parseWeeklyForecast = function (weather) {
    
    let thisWeek = weather.daily.slice(1, 6);
    console.log(thisWeek);
    let time = dayjs.unix(thisWeek[0].dt).format('MMM D, YYYY');
    
    console.log(weather);
    console.log(time);
    renderWeeklyForecast(thisWeek);
};
const renderCurrentForecast = function (weather) {
    const forecastToday = document.createElement('div');
    forecastToday.textContent = weather.current.weather[0].description
}

const renderWeeklyForecast = function (forecastArray) {
    for (let i = 0; i < forecastArray.length; i++) {
        const forecastDay = document.createElement('div');

        console.log(dayjs.unix(forecastArray[i].dt).format('MMM D, YYYY'))
        console.log(forecastArray[i].summary)
        forecastDay.textContent = `${parseInt(forecastArray[i].temp.day)} \u00B0F ${forecastArray[i].summary}`;
        let dailyIcon = forecastArray[i].weather[0].icon;
        console.log(dailyIcon);

        forecastDay.style.backgroundImage = `url(https://openweathermap.org/img/wn/${dailyIcon}@2x.png)`;
        forecastDay.classList.add('card');
        futureForecast.appendChild(forecastDay);
        
    }
};

const renderHistory = function (city, state) {
    history.push({'city': city, 'state': state});
    localStorage.setItem('history', JSON.stringify(history));
    //iterate through history array and create/append elements
    for (let i=0; i<history.length;i++) {
        const historyElement = document.createElement('div');
        historyElement.textContent = `${history[i].city}, ${history[i].state}`
        searchHistory.appendChild(historyElement)
    };
    console.log (`history: ${JSON.stringify(history)}`);
};
//event listener for Search Button
searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    if (!cityName.value || !state.value) {
        alert(`Please enter both city and state`)
    } else {
        getWeather(cityName.value, state.value);
        renderHistory(cityName.value, state.value);
        console.log(cityName.value);
        console.log(state.value);
        cityName.value = "";
        state.value = "";
    };
    
});
