const apiKey = "c37c602ca982bfb6cdb30401e86ec31f";
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", function () {
    const city = document.getElementById("city-input").value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert("Please enter a city name.");
    }
});

async function fetchWeather(city) {
    try {
        const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(apiURL),
            fetch(forecastURL)
        ]);

        if (!weatherResponse.ok || !forecastResponse.ok) {
            throw new Error(`Error fetching data.`);
        }

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        // Update Weather Info
        document.getElementById("temperature").innerText = `${Math.round(weatherData.main.temp)}°C`;
        document.getElementById("weather-condition").innerText = weatherData.weather[0].description;
        document.getElementById("wind-speed").innerText = `${weatherData.wind.speed} km/h`;
        document.getElementById("humidity").innerText = `${weatherData.main.humidity}%`;
        document.getElementById("pressure").innerText = `${weatherData.main.pressure} hPa`;
        document.getElementById("date").innerText = new Date().toDateString();

        updateGraph(forecastData);
    } catch (error) {
        alert("City not found. Please enter a valid city name.");
    }
}

// Update Graph with API Data
function updateGraph(forecastData) {
    const hourlyLabels = [];
    const hourlyTemperatures = [];
    const dailyLabels = [];
    const dailyTemperatures = {};

    // Extract hourly data (Next 8 readings)
    forecastData.list.slice(0, 8).forEach(entry => {
        const time = new Date(entry.dt * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true });
        hourlyLabels.push(time);
        hourlyTemperatures.push(entry.main.temp);
    });

    // Extract daily averages
    forecastData.list.forEach(entry => {
        const day = new Date(entry.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        if (!dailyTemperatures[day]) {
            dailyLabels.push(day);
            dailyTemperatures[day] = [];
        }
        dailyTemperatures[day].push(entry.main.temp);
    });

    // Calculate daily average temperature
    const dailyAvgTemperatures = dailyLabels.map(day => {
        const temps = dailyTemperatures[day];
        return Math.round(temps.reduce((sum, temp) => sum + temp, 0) / temps.length);
    });

    // Destroy old charts before updating (to avoid overlaps)
    if (window.hourlyChart) window.hourlyChart.destroy();
    if (window.dailyChart) window.dailyChart.destroy();

    // Create Hourly Chart
    const ctxHourly = document.getElementById("hourlyWeatherChart").getContext("2d");
    window.hourlyChart = new Chart(ctxHourly, {
        type: "line",
        data: {
            labels: hourlyLabels,
            datasets: [{
                label: "Hourly Temperature (°C)",
                data: hourlyTemperatures,
                borderColor: "#007bff",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: false }
            }
        }
    });

    // Create Daily Chart
    const ctxDaily = document.getElementById("dailyWeatherChart").getContext("2d");
    window.dailyChart = new Chart(ctxDaily, {
        type: "bar",
        data: {
            labels: dailyLabels.slice(0, 7), // Show only next 7 days
            datasets: [{
                label: "Daily Avg Temperature (°C)",
                data: dailyAvgTemperatures.slice(0, 7),
                backgroundColor: "#28a745"
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: false }
            }
        }
    });
}
