console.log(`link looking good`);
//define variables for html elements
const cityName = document.getElementById('cityName');
const searchButton = document.getElementById('searchButton');
//define variable for APIKey
const APIKey = `b657affac026785e279a481f8fd5894c`;

//fetch request
const getWeather = function() {
    console.log(`got weather?`);
    let city = 'Denver';
    const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

    fetch(queryURL).then (function (response) {
        if (response.ok) {
            return response.json();
        } else {
            alert(`Error: ${response.statusText}`)
        }
    }).then(function (data) {
        console.log(data);
        console.log(data.coord);
        fiveDayForecast(data.coord);
    })
    .catch (function(error){
        console.log(error);
        alert('Unable to reach Weather API');
    });

};

const fiveDayForecast = function(coordinate) {
    const coordinatesArray = [];
    coordinatesArray.push(coordinate);
    const lat = coordinatesArray[0].lat;
    const lon = coordinatesArray[0].lon;

    const forecastUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${APIKey}`;

    fetch(forecastUrl).then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                alert(`Error: ${response.statusText}`);
            };
    }).then(function(data) {
        console.log(data);
    })
    .catch (function (error) {
        console.log(error);
        alert('Unable to reach Weather API');
    });
};
//event listener for Search Button
searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    getWeather();
    console.log('click');
});
