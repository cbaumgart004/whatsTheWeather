console.log(`link looking good`);
//define variables for html elements
const cityName = document.getElementById('cityName');
const searchButton = document.getElementById('searchButton');
//define variable for APIKey
const APIKey = `04226ea09cd7c111ba2c55a955a667b4`;

//fetch request
const getWeather = function() {
    console.log(`got weather?`)
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
    })
    .catch (function(error){
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
