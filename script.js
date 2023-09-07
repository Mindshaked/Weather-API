const cityName = document.createElement("div");
cityName.setAttribute("id", "city-name");
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
const todayForecast = document.createElement("div");
todayForecast.setAttribute("id", "todayForecast")
const container = document.getElementById("container");




// weather code legend for the type of weather
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

todayForecast.appendChild(cityName);
todayForecast.appendChild(temperature);
todayForecast.appendChild(weatherCode);
todayForecast.appendChild(dayOrNight);
container.appendChild(todayForecast)

//form for the user to input location
locationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let location = document.getElementById("location");

    if (location.value == "") {
      alert("Make sure to input a valid location");
    } else {
      if (forecastSlots !== null){
      removeAllChildNodes(forecastSlots);
        } 
      console.log(location.value);
      location.value.toLowerCase();
      getWeather(location.value);
    }

    location.value = "";

});

//function to remove the forecast elements after searching again

function removeAllChildNodes(parent){
    while (parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
}

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
        const dateNumberSlot = document.createElement("div");
        dateNumberSlot.className = "date-number";
        dateNumberSlot.innerHTML = dateNumber;
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

        container.appendChild(forecastSlots);
        forecastSlots.appendChild(day)
        day.appendChild(date);
        day.appendChild(dateNumberSlot)
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
        const locationString = locationSearch;
        cityName.innerHTML = locationString.replace(locationString.charAt(), locationString.charAt().toUpperCase());
        
        temperature.innerHTML = "Temperature: " + weatherData.current_weather.temperature;
        weatherCode.innerHTML = "Weather: " + getWeatherSymbol(weatherData.current_weather.weathercode);
        dayOrNight.innerHTML = getDayOrNight(weatherData.current_weather.is_day);
        const days = weatherData.daily;
        getForecast(days)
    }
    


