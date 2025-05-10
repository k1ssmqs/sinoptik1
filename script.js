const apiKey = 'b9ffb1dd96b1045c1f4f4db74bce9a0f';

let currentMap = null;

function setWeatherBackground(weather) {
  const lower = weather.toLowerCase();
  document.body.className = '';

  if (lower.includes('rain')) document.body.classList.add('rain');
  else if (lower.includes('snow')) document.body.classList.add('snow');
  else if (lower.includes('cloud')) document.body.classList.add('clouds');
  else document.body.classList.add('clear');
}

function showWeather(data) {
  const container = document.getElementById('weatherContainer');
  const cityTitle = document.getElementById('cityName');
  cityTitle.textContent = `${data.city.name}, ${data.city.country}`;
  container.innerHTML = '';

  const forecast = document.createElement('div');
  forecast.className = 'forecast';

  data.list.filter((_, i) => i % 8 === 0).forEach(day => {
    const date = new Date(day.dt * 1000);
    const item = document.createElement('div');
    item.className = 'forecast-day';
    item.innerHTML = `
      <strong>${date.toDateString()}</strong><br>
      ${day.weather[0].description}<br>
      Темп.: ${day.main.temp}°C
    `;
    forecast.appendChild(item);
  });

  container.appendChild(forecast);
  setWeatherBackground(data.list[0].weather[0].main);
  showMap(data.city.coord.lat, data.city.coord.lon, data.city.name);
}

function getWeatherByCoords(lat, lon) {
  axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ua`)
    .then(res => showWeather(res.data));
}

function searchWeather() {
  const city = document.getElementById('cityInput').value;
  if (!city) return;
  axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=ua`)
    .then(res => showWeather(res.data))
    .catch(err => alert('Місто не знайдено'));
}

function showMap(lat, lon, cityName) {
  const mapContainer = document.getElementById('map');
  mapContainer.innerHTML = ''; // очищення попередньої карти

  if (currentMap) currentMap.remove(); // видалити попередню карту

  currentMap = L.map('map').setView([lat, lon], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(currentMap);
  L.marker([lat, lon]).addTo(currentMap)
    .bindPopup(`Місто: ${cityName}`)
    .openPopup();
}

navigator.geolocation.getCurrentPosition(
  pos => getWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
  () => searchWeather()
);
