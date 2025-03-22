document.addEventListener("DOMContentLoaded", function () {
    // Sample hourly weather data
    const hourlyLabels = ["12 AM", "3 AM", "6 AM", "9 AM", "12 PM", "3 PM", "6 PM", "9 PM"];
    const hourlyTemperatures = [22, 20, 19, 23, 28, 30, 27, 24];

    const dailyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dailyTemperatures = [25, 27, 28, 26, 29, 30, 31];

    // Hourly Weather Graph
    const ctxHourly = document.getElementById("hourlyWeatherChart").getContext("2d");
    new Chart(ctxHourly, {
        type: "line",
        data: {
            labels: hourlyLabels,
            datasets: [{
                label: "Temperature (°C)",
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

    // Daily Weather Graph
    const ctxDaily = document.getElementById("dailyWeatherChart").getContext("2d");
    new Chart(ctxDaily, {
        type: "bar",
        data: {
            labels: dailyLabels,
            datasets: [{
                label: "Temperature (°C)",
                data: dailyTemperatures,
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
});
