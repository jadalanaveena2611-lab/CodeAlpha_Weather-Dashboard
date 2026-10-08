const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const message = document.getElementById("message");

async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name.";
        return;
    }

    message.textContent = "Loading weather data...";

    try {

        // Get latitude and longitude
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to connect to geocoding service.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found.");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Get weather data
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Display data
        cityName.textContent = `${location.name}, ${location.country}`;

        temperature.textContent =
            `${current.temperature_2m} °C`;

        humidity.textContent =
            `${current.relative_humidity_2m} %`;

        windSpeed.textContent =
            `${current.wind_speed_10m} km/h`;

        message.textContent = "Weather data updated successfully.";

    } catch (error) {

        message.textContent = `Error: ${error.message}`;

        cityName.textContent = "Weather Dashboard";
        temperature.textContent = "-- °C";
        humidity.textContent = "-- %";
        windSpeed.textContent = "-- km/h";
    }
}

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});