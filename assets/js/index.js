
//define variables for html elements
let currentCity = '';
let currentState = '';
const cityName = document.getElementById('cityName');
const searchButton = document.getElementById('searchButton');
const futureForecast = document.getElementById('resultsFiveDay');
const forecastToday = document.getElementById('resultsToday');
const state = document.getElementById('state');
const searchHistory = document.getElementById('searchHistory');
//define variable for APIKey
const APIKey = `b657affac026785e279a481f8fd5894c`;
const history = JSON.parse(localStorage.getItem('history'))||[];

//fetch request
const getWeather = function(cityName, stateName) {
    
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
    
    let weatherDaily = (weather.current.weather[0].description);
    
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
    let time = dayjs.unix(weather.current.dt).format('dddd, MMM D, YYYY');
    let temp = parseInt(weather.current.temp);
    let weatherNow = weather.current.weather[0];
    console.log(`your weather now variable${weatherNow}`);
    const forecastTodayCard = document.createElement('div');
    forecastTodayCard.classList.add('largeCard');
    currentCity = localStorage.getItem('currentCity');
    currentState = localStorage.getItem('currentState');
    const header = document.createElement('h2');
    const weatherDescription = document.createElement('p');
    const todayTemp = document.createElement('p');
    const displayTime = document.createElement('p');
    const displayWind = document.createElement('p');
    const displayHumid = document.createElement('p');
    forecastTodayCard.style.backgroundImage = `url(https://openweathermap.org/img/wn/${weatherNow.icon}@2x.png)`
    //Set content to created elements
    header.textContent = `${currentCity}, ${currentState}`;
    weatherDescription.textContent = `Today you can expect ${weatherNow.description}`;
    todayTemp.textContent = `${temp}\u00B0 F`
    displayTime.textContent = time;
    displayWind.textContent = displayWind.textContent = `Wind Speed:${parseInt(weather.current.wind_speed)} mph`;
    displayHumid.textContent = `Humidity: ${weather.current.humidity}%`;
    console.log(`Today's forecast for ${header.textContent}`);
    

    
    forecastTodayCard.appendChild(header);
    forecastTodayCard.appendChild(displayTime);
    forecastTodayCard.appendChild(weatherDescription);
    forecastTodayCard.appendChild(todayTemp);
    forecastTodayCard.appendChild(displayWind);
    forecastTodayCard.appendChild(displayHumid);

    forecastToday.appendChild(forecastTodayCard);
}

const renderWeeklyForecast = function (forecastArray) {
    for (let i = 0; i < forecastArray.length; i++) {
        const forecastDay = document.createElement('div');
        //create elements of the div
        const displayWeekday = document.createElement('h3');
        const displayTemp = document.createElement('p1');
        const displayDesc = document.createElement('p');
        const displayWind = document.createElement('p');
        const displayHumid = document.createElement('p');
        //update text of items
        let weekday = dayjs.unix(forecastArray[i].dt).format('ddd')
        displayWeekday.textContent = weekday;
        displayTemp.textContent = `${parseInt(forecastArray[i].temp.day)}\u00B0 F`;
        displayDesc.textContent = `${forecastArray[i].summary}`;
        console.log(`Wind today ${forecastArray[i].wind_speed}`);
        displayWind.textContent = `Wind Speed: ${parseInt(forecastArray[i].wind_speed)} mph`;
        displayHumid.textContent = `Humidity: ${forecastArray[i].humidity}%`;
        let dailyIcon = forecastArray[i].weather[0].icon;
        
        //set icon from api and add a class
        forecastDay.style.backgroundImage = `url(https://openweathermap.org/img/wn/${dailyIcon}@2x.png)`;
        forecastDay.classList.add('card');
        //add elements to div
        forecastDay.appendChild(displayWeekday);
        forecastDay.appendChild(displayTemp);
        forecastDay.appendChild(displayDesc);
        forecastDay.appendChild(displayWind);
        forecastDay.appendChild(displayHumid);
        //update dom with new div
        futureForecast.appendChild(forecastDay);
        
    }
};

const renderHistory = function (city, state) {
    
    
    localStorage.setItem('history', JSON.stringify(history));
    //iterate through history array and create/append elements
    for (let i=0; i<history.length;i++) {
        const historyElement = document.createElement('button');
        historyElement.classList.add('btn');
        historyElement.textContent = `${history[i].city}, ${history[i].state}`
        historyElement.setAttribute('city', history[i].city);
        historyElement.setAttribute('state', history[i].state);
        searchHistory.appendChild(historyElement)
    };
    
};
//Function to clear previous search
const clear = function() {
    forecastToday.innerHTML = '';
    futureForecast.innerHTML = '';
    searchHistory.innerHTML = '';
}
//event listener for Search Button
searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    if (!cityName.value || !state.value) {
        alert(`Please enter both city and state`)
    } else {
        currentCity = cityName.value
        currentState = state.value
        //set local storage for the current city to be used in other functions
        localStorage.setItem('currentCity', currentCity);
        localStorage.setItem('currentState', currentState);
        
        getWeather(cityName.value, state.value);
        //Only Return last 15 searches
        if (history.length>14){
            history.shift();
        }
        history.push({'city': cityName.value, 'state': state.value});
        //clear elements in the page before performing a new search
        clear();
        renderHistory(cityName.value, state.value);
        console.log(cityName.value);
        console.log(state.value);
        cityName.value = "";
        state.value = "";
    };
    
});

searchHistory.addEventListener('click', function(event){
    if(event.target.tagName === 'BUTTON') {
        let historicCity = event.target.getAttribute('city');
        let historicState = event.target.getAttribute('state');
        localStorage.setItem('currentCity', historicCity);
        localStorage.setItem('currentState', historicState);
        console.log(`from you history: ${historicCity}`)
        clear();
        getWeather(historicCity, historicState);
        renderHistory();
        
    }
});

renderHistory();

//localStorage.clear();