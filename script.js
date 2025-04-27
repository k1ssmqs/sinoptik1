const apiKey = b9ffb1dd96b1045c1f4f4db74bce9a0f;

function setWeatherBackground(weather) {
  const body = document.body;
  body.className = 'default';
  if (weather.includes('rain')) {
    body.classList.add('rainy');
  } else if (weather.includes('cloud')) {
    body.classList.add('cloudy');
  } else if (weather.includes('snow')) {
    body.classList.add('snowy');
  } else if (weather.includes('clear')) {
    body.classList.add('sunny');
  }
}

function showWeather(data) {
  const city = data.name;
  const temp = Math.round(data.main.temp);
  const weather = data.weather[0].description;

  document.getElementById('cityName').textContent = city;
  document.getElementById('temperature').textContent = {temp};
  document.getElementById('weatherDesc').textContent = weather.charAt(0).toUpperCase() + weather.slice(1);

  setWeatherBackground(weather.toLowerCase());
}

function showForecast(daily) {
  const forecastContainer = document.getElementById('forecast');
  forecastContainer.innerHTML = '';

  for (let i = 1; i <= 7; i++) {
    const dayData = daily[i];
    const date = new Date(dayData.dt * 1000);
    const dayName = date.toLocaleDateString('uk-UA', { weekday: 'short' });

    const tempMin = Math.round(dayData.temp.min);
    const tempMax = Math.round(dayData.temp.max);
    const icon = dayData.weather[0].icon;
    const description = dayData.weather[0].description;

    const dayCard = document.createElement('div');
    dayCard.classList.add('day-card');

    dayCard.innerHTML = `
      <h3>${dayName}</h3>
      <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
      <p>${tempMin}°C / ${tempMax}°C</p>
    `;

    forecastContainer.appendChild(dayCard);
  }
}

function getWeatherByCoords(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ua`)
    .then(response => response.json())
    .then(data => {
      showWeather(data);
      getForecast(lat, lon);
    })
    .catch(error => console.error('Помилка:', error));
}

function getForecast(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,current,alerts&appid=${apiKey}&units=metric&lang=ua`)
    .then(response => response.json())
    .then(data => {
      showForecast(data.daily);
    })
    .catch(error => console.error('Помилка прогнозу:', error));
}

function getWeatherByCity(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ua`)
    .then(response => response.json())
    .then(data => {
      showWeather(data);
      getForecast(data.coord.lat, data.coord.lon);
    })
    .catch(error => console.error('Помилка:', error));
}

function searchCity(event) {
  if (event.key === 'Enter') {
    const city = document.getElementById('searchInput').value;
    if (city.trim() !== '') {
      getWeatherByCity(city.trim());
    }
  }
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getWeatherByCoords(lat, lon);
  }, () => {
    document.getElementById('cityName').textContent = "Не вдалося отримати місцезнаходження";
  });
} else {
  document.getElementById('cityName').textContent = "Геолокація недоступна";
}
