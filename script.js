const apiKey = "d6ba9986b2400e470876547167667ca5";

async function getWeather(city) {
    // ВАЖНО: Исправленный путь к API. Теперь всё на своих местах.
    const url = "https://openweathermap.org" + city + "&appid=" + apiKey + "&units=metric";
    
    console.log("ПРОВЕРКА СВЯЗИ! Запрос летит сюда:", url);

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        console.log("ДАННЫЕ ПРИШЛИ:", data);

        if (data.cod === 200) {
            updateUI(data);
        } else if (data.cod === 401) {
            alert("Ключ API еще не активирован. Обычно это занимает от 30 минут до пары часов после регистрации.");
        } else {
            alert("Ошибка сервера: " + data.message);
        }
    } catch (error) {
        console.error("КРИТИЧЕСКАЯ ОШИБКА:", error);
    }
}

document.getElementById('city-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        getWeather(event.target.value);
    }
});

function updateUI(data) {
    // Обновляем данные на странице
    document.querySelector('.huge-temp').innerText = Math.round(data.main.temp) + "°C";
    document.querySelector('.weather-status').innerText = data.weather[0].main; 
    document.querySelector('.wind-speed').innerText = Math.round(data.wind.speed) + " km/h";
    document.querySelector('.feels-like').innerText = "Feels like: " + Math.round(data.main.feels_like) + "°C";
}
