const apiKey = "94a5351461fdfbba2e7ddd30fa85e95f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

// Function to fetch weather data for a given city
async function fetchWeather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        displayError();
    }
}

// Function to display weather information
function displayWeather(data) {
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    // Set weather icon based on weather condition
    setWeatherIcon(data.weather[0].main);

    // Show weather information
    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
}

// Function to handle errors
function displayError() {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
}

// Function to set weather icon based on weather condition
function setWeatherIcon(weatherCondition) {
    switch (weatherCondition) {
        case "Clouds":
            weatherIcon.src = "images/clouds.png";
            break;
        case "Clear":
            weatherIcon.src = "images/clear.png";
            break;
        case "Rain":
            weatherIcon.src = "images/rain.png";
            break;
        case "Drizzle":
            weatherIcon.src = "images/drizzle.png";
            break;
        case "Mist":
            weatherIcon.src = "images/mist.png";
            break;
        default:
            weatherIcon.src = "images/default.png";
            break;
    }
}

// Event listener for search button click
searchBtn.addEventListener("click", () => {
    const city = searchBox.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

// Function to fetch weather data for user's current location
function fetchWeatherByGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            fetchCityName(latitude, longitude);
        }, error => {
            console.error('Error getting geolocation:', error);
            displayError();
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
        displayError();
    }
}

// Function to fetch city name using reverse geocoding
async function fetchCityName(latitude, longitude) {
    const reverseGeocodingUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
    try {
        const response = await fetch(reverseGeocodingUrl);
        if (!response.ok) {
            throw new Error('Reverse geocoding failed');
        }
        const data = await response.json();
        const city = data[0].name;
        fetchWeather(city);
    } catch (error) {
        console.error('Error fetching city name:', error);
        displayError();
    }
}

// Call fetchWeatherByGeolocation when the app loads to get weather for user's location
window.onload = fetchWeatherByGeolocation;
