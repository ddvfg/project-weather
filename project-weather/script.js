const apiKey = "d6ba99871da98a8905c17e9c629969d6";

async function getWeather(city) {
    
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        
        if (currentData.cod === 200 && forecastData.cod === "200") {
            updateUI(currentData);
            updateForecastUI(forecastData);
        } else {
            alert("Город не найден или ошибка API");
        }
    } catch (error) {
        console.error("Критическая ошибка:", error);
    }
}

function updateUI(data) {
    document.querySelector('.huge-temp').innerText = Math.round(data.main.temp) + "°C";
    document.querySelector('.weather-status').innerText = data.weather[0].main; 
    document.querySelector('.wind-speed').innerText = Math.round(data.wind.speed) + " km/h";
    document.querySelector('.feels-like').innerText = "Feels like: " + Math.round(data.main.feels_like) + "°C";
    
    
    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const sunSpans = document.querySelectorAll('.sun-item span');
    if (sunSpans.length >= 2) {
        sunSpans[0].innerText = sunriseTime;
        sunSpans[1].innerText = sunsetTime;
    }
}

function updateForecastUI(data) {
    
    const hourlyCards = document.querySelectorAll('.hourly-card');
    for (let i = 0; i < hourlyCards.length; i++) {
        if (!data.list[i]) break;
        const forecast = data.list[i];
        const time = new Date(forecast.dt * 1000).getHours() + ":00";
        const temp = Math.round(forecast.main.temp) + "°C";
        
        hourlyCards[i].querySelector('p:first-child').innerText = time;
        hourlyCards[i].querySelector('.hourly-temp').innerText = temp;
    }

   
    const dayRows = document.querySelectorAll('.day-row');
    let dayIndex = 0;
    for (let i = 7; i < data.list.length; i += 8) {
        if (dayIndex < dayRows.length) {
            const forecast = data.list[i];
            const dateObj = new Date(forecast.dt * 1000);
            const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });
            const temp = Math.round(forecast.main.temp) + "°C";

            dayRows[dayIndex].querySelector('.day-temp').innerText = temp;
            dayRows[dayIndex].querySelector('.day-date').innerText = dateStr;
            dayIndex++;
        }
    }
}



document.getElementById('city-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        getWeather(event.target.value);
    }
});
