

    
const background = document.body;
/*background.style.backgroundImage = "url(\"/img/defaultbackground.jpeg\")";

*/

console.log(background)



const cityName = document.createElement("div");
cityName.setAttribute("id", "city-name");
const weather = document.getElementById("weather");
const locationForm = document.getElementById("locationForm");
const temperature = document.createElement("div");
temperature.setAttribute("id", "temperature");
const wind = document.createElement("div");
wind.setAttribute("id", "wind");
const timeNow = document.createElement("div");
timeNow.setAttribute("id", "time-now");
const weatherCode = document.createElement("div");
weatherCode.setAttribute("id", "weatherCode");
const weatherIcon = document.createElement("img");
weatherIcon.setAttribute("id", "weatherIcon");
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

const weatherIconsLegend = {
    0: "icons/sun.png",
    1: "icons/sun.png",
    2: "icons/cloudy.png",
    3: "icons/cloudy.png",
    45: "icons/mist.png",
    48: "icons/mist.png",
    51: "icons/bitrainy.png",
    53: "icons/bitrainy.png",
    55: "icons/bitrainy.png",
    56: "icons/drizzle.png",
    57: "icons/drizzle.png",
    61: "icons/rainy.png",
    63: "icons/rainy.png",
    65: "icons/rainy.png",
    66: "icons/rainy.png",
    67: "icons/rainy.png",
    71: "icons/snowy.png",
    73: "icons/snowy.png",
    75: "icons/snowy.png",
    77: "icons/snowy.png",
    80: "icons/drizzle.png",
    81: "icons/drizzle.png",
    82: "icons/drizzle.png",
    85: "icons/drizzle.png",
    86: "icons/drizzle.png",
    95: "icons/storm.png",
    96: "icons/storm.png",
    99: "icons/storm.png"
}

container.appendChild(forecastSlots);
todayForecast.appendChild(cityName);
todayForecast.appendChild(weatherIcon);
todayForecast.appendChild(timeNow)
todayForecast.appendChild(temperature);
todayForecast.appendChild(weatherCode);
todayForecast.appendChild(dayOrNight);
todayForecast.appendChild(wind);
todayForecast.style.visibility = "hidden";
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

      if (todayForecast.style.visibility == "hidden"){
        todayForecast.style.visibility = "visible";
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

function getWeatherSymbol(weatherIcon){
    const actualWeatherSymbol = weatherIconsLegend[weatherIcon];
    return actualWeatherSymbol;
}


//turns code into the corresponding weather text
function getWeatherCode(weatherCode){
    const actualWeatherCode = weatherCodeLegend[weatherCode];
    return actualWeatherCode;
}



// get the data for the 7 days forecast and show it

function getForecast(daysArray){

    for (i=0; i<daysArray.time.length; i++){
        const day = document.createElement("div");
        day.className = "day";
        day.classList.add("animate-bottom")
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
       
        const dailyWeather = document.createElement("img");
        dailyWeather.className = "daily-weather";
        dailyWeather.src = getWeatherSymbol(daysArray.weathercode[i])
        const minmaxTemp = document.createElement("div");
        minmaxTemp.className = "minmax-temp";
        minmaxTemp.innerHTML = daysArray.temperature_2m_min[i] + "° - " + daysArray.temperature_2m_max[i] + "°";
        
        forecastSlots.appendChild(day)
        day.appendChild(dailyWeather);
        day.appendChild(date);
        day.appendChild(dateNumberSlot)
        day.appendChild(minmaxTemp);
        
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
        showLoader();
        const coordinates = await getLocation(locationSearch);
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + coordinates[0] + '&longitude=' + coordinates[1] + '&hourly=is_day&daily=temperature_2m_max,temperature_2m_min,weathercode&current_weather=true&timezone=Europe%2FBerlin', {mode: 'cors'});
        const weatherData = await response.json();
        showLoader();
        console.log("weather data" + JSON.stringify(weatherData));
        console.log(weatherData);
        const locationString = locationSearch.toLowerCase();
        cityName.innerHTML = locationString.replace(locationString.charAt(), locationString.charAt().toUpperCase());

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const actualTime = "Today, " + hours + ":" + String(minutes).padStart(2, "0");;

       

        timeNow.innerHTML = actualTime;
        temperature.innerHTML = weatherData.current_weather.temperature + "°";
        weatherIcon.src = getWeatherSymbol(weatherData.current_weather.weathercode);
        weatherCode.innerHTML = getWeatherCode(weatherData.current_weather.weathercode);
        let dayOrNight = getDayOrNight(weatherData.current_weather.is_day)
        dayOrNight.innerHTML = getDayOrNight;
        wind.innerHTML = "Wind speed: " + weatherData.current_weather.windspeed + " k/m";
        const days = weatherData.daily;
        getForecast(days)

 
    }
    
   
    //show loading animation until data is snow on screen
    function showLoader(){
        const loader = document.getElementById("loader");
        if (loader.style.visibility == "visible"){
            loader.style.visibility = "hidden";
        } else {
            loader.style.visibility = "visible";
        }
    }