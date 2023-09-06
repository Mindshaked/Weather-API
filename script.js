const weather = document.getElementById("weather");
const locationForm = document.getElementById("locationForm");
const temperature = document.createElement("div");
temperature.setAttribute("id", "temperature");
const weatherCode = document.createElement("div");
weatherCode.setAttribute("id", "weatherCode");
const dayOrNight = document.createElement("div");
dayOrNight.setAttribute("id", "day-or-night");
const forecastSlots = document.createElement("div");
forecastSlots.setAttribute("id", "forecast");
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const weatherCodeLegend = {
    0: "Clear Sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    56: "Light Freezing Drizzle",
    57: "Dense Freezing Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    66: "Light Freezing Rain",
    67: "Heavy Freezing Rain",
    71: "Slight Snow fall",
    73: "Moderate Snow fall",
    75: "Heavy Snow fall",
    77: "Snow grains",
    80: "Slight Rain shower",
    81: "Moderate Rain shower",
    82: "Violent Rain shower",
    85: "Slight show shower",
    86: "Heavy snow shower",
    95: "Thunderstorm",
    96: "Thunderstorm",
    99: "Thunderstorm"
}

weather.appendChild(temperature);
weather.appendChild(weatherCode);
weather.appendChild(dayOrNight);

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

//turns code into the corresponding weather icon

function getWeatherSymbol(weatherCode){
    const actualWeather = weatherCodeLegend[weatherCode]
    return actualWeather;
}


// get the data for the 7 days forecast and show it



function getForecast(daysArray){

    for (i=0; i<daysArray.time.length; i++){
        const day = document.createElement("div");
        day.className = "day";
        const date = document.createElement("div");
        date.className = "date";

        let dateNumber = daysArray.time[i];
        console.log(dateNumber)
        let formatedDate = dateNumber.replaceAll("-", ",");
        dateObject = new Date(formatedDate)
        console.log(dateObject);

        let dateName = weekday[dateObject.getDay()];
        console.log(dateName)
        date.innerHTML = dateName;
       
        const maxTemp = document.createElement("div");
        maxTemp.className = "maxTemp";
        maxTemp.innerHTML = daysArray.temperature_2m_max[i];
        const minTemp = document.createElement("div");
        minTemp.className = "minTemp";
        minTemp.innerHTML = daysArray.temperature_2m_min[i];
        console.log(daysArray[i])

        weather.appendChild(day);
        day.appendChild(date);
        day.appendChild(maxTemp);
        day.appendChild(minTemp);
    }
}

// check if it's day or night

function getDayOrNight(code){
    if (code == 1){
        return "day;"
    } else {
        return "night";
    }
}


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
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + coordinates[0] + '&longitude=' + coordinates[1] + '&hourly=is_day&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=Europe%2FBerlin', {mode: 'cors'});
        const weatherData = await response.json();
        console.log("weather data" + JSON.stringify(weatherData));
        console.log(weatherData);
        temperature.innerHTML = "Temperature: " + weatherData.current_weather.temperature;
        weatherCode.innerHTML = "Weather: " + getWeatherSymbol(weatherData.current_weather.weathercode);
        dayOrNight.innerHTML = getDayOrNight(weatherData.current_weather.is_day);
        const days = weatherData.daily;
        getForecast(days)
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