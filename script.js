const weather = document.getElementById("weather");
const locationForm = document.getElementById("locationForm");
const temperature = document.createElement("div");
temperature.setAttribute("id", "temperature");
const weatherCode = document.createElement("div");
weatherCode.setAttribute("id", "weatherCode");

weather.appendChild(temperature);
weather.appendChild(weatherCode);

//form for the user to input location
locationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let location = document.getElementById("location");

    if (location.value == "") {
      alert("Make sure to input a valid location");
    } else {
      console.log(location.value);
      getWeather(location.value);
    }

    location.value = "";

});


    //get location coordinates
    async function getLocation(locationSearch){

        const response = await fetch('https://nominatim.openstreetmap.org/search?q=' + locationSearch + '&format=json&addressdetails=1&limit=1&polygon_svg=1', {mode: 'cors'});
        const locationData = await response.json();
        const locationLatitude = locationData[0].lat;
        const locationLongitude = locationData[0].lon;
        return [locationLatitude, locationLongitude];
    }

    console.log("coordinates" + getLocation())
    

    //get the weather data from the location
    async function getWeather(locationSearch){
        const coordinates = await getLocation(locationSearch);
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + coordinates[0] + '&longitude=' + coordinates[1] + '&hourly=temperature_2m&current_weather=true', {mode: 'cors'});
        const weatherData = await response.json();
        console.log("weather data" + JSON.stringify(weatherData));
        temperature.innerHTML = "Temperature: " + weatherData.current_weather.temperature;
        weatherCode.innerHTML = "Weather: " + weatherData.current_weather.weathercode;
    }



    /*

    0 	Clear sky
1, 2, 3 	Mainly clear, partly cloudy, and overcast
45, 48 	Fog and depositing rime fog
51, 53, 55 	Drizzle: Light, moderate, and dense intensity
56, 57 	Freezing Drizzle: Light and dense intensity
61, 63, 65 	Rain: Slight, moderate and heavy intensity
66, 67 	Freezing Rain: Light and heavy intensity
71, 73, 75 	Snow fall: Slight, moderate, and heavy intensity
77 	Snow grains
80, 81, 82 	Rain showers: Slight, moderate, and violent
85, 86 	Snow showers slight and heavy
95 * 	Thunderstorm: Slight or moderate
96, 99 * 	Thunderstorm with slight and heavy hail

*/