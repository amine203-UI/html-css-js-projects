let cityInput = document.getElementById("city_input"),
  searchBtn = document.getElementById("searchBtn"),
  locationBtn = document.getElementById("locationBtn"),
  api_key = "8b0bc01555e5f4fef959348927d3105f",
  currentWeatherCard = document.querySelectorAll(".weather__left .card")[0],
  fiveDaysForecastCard = document.querySelector(".day-forecast"),
  aqiCard = document.querySelectorAll(".highlights .card")[0],
  sunriseCard = document.querySelectorAll(".highlights .card")[1],
  aqiList = ["Good", "Fair", "Moderate", "Poor", "Very Poor"],
  humidityVal = document.getElementById("humidityVal"),
  pressureVal = document.getElementById("pressureVal"),
  visibilityVal = document.getElementById("VisibilityVal"),
  windSpeedVal = document.getElementById("windSpeedVal"),
  hourlyForecastCard = document.querySelector(".hourly__forecast");

//--------show left data ------------//
function getWeatherDetails(name, lat, lon, country, state) {
  let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${api_key}`,
    WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
    AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`,
    days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ],
    months = [
      "jun",
      "fub",
      "mar",
      "apr",
      "may",
      "jun",
      "july",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];

  fetch(AIR_POLLUTION_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
      aqiCard.innerHTML = `
      <div class="card__head">
                     <p>Air Quality Index</p>
                     <p class="air__index aqi-${data.list[0].main.aqi}">${
        aqiList[data.list[0].main.aqi - 1]
      }</p>
                  </div>
                  <div class="air__indices">
                     <i class="fa-solid fa-wind"></i>
                   <div class="item">
                    <p>PM2.5</p>
                    <h2>${pm2_5}</h2>
                   </div>

                   <div class="item">
                    <p>PM10</p>
                    <h2>${pm10}</h2>
                   </div>

                   <div class="item">
                    <p>502</p>
                    <h2>${so2}</h2>
                   </div>

                   <div class="item">
                    <p>CO</p>
                    <h2>${co}</h2>
                   </div>

                   <div class="item">
                    <p>MO</p>
                    <h2>${no}</h2>
                   </div>

                   <div class="item">
                    <p>MO2</p>
                    <h2>${no2}</h2>
                   </div>

                   <div class="item">
                    <p>MO3</p>
                    <h2>${nh3}</h2>
                   </div>

                   <div class="item">
                    <p>O3</p>
                    <h2>${o3}</h2>
                   </div>

                  </div>`;
    })
    .catch(() => {
      alert("Failed to fetch air quality index");
    });

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let date = new Date();
      document.getElementById(
        "nameCountry"
      ).innerHTML = `<h1"> ${name}, ${country} </h1>`;
      currentWeatherCard.innerHTML = `
                <div class="current__weather">
                             <div class="details">
                                 <p>Now</p>
                                 <h2>${(data.main.temp - 273.15).toFixed(
                                   2
                                 )}&deg; C</h2>
                                 <p>${data.weather[0].description}</p>
                             </div>
                             <div class="weather__icon">
                                 <img src="https://openweathermap.org/img/wn/${
                                   data.weather[0].icon
                                 }@2x.png" alt="image">
                             </div>
                          </div>
                          <hr>
                          <div class="card__footer">
                            <p><i class="ri-calendar-line"></i>${
                              days[date.getDay()]
                            },${date.getDate()}, ${
        months[date.getMonth()]
      } ${date.getFullYear()}</p>
                            <p><i class="ri-map-pin-line"></i>${name}, ${country}</p>
                            </div>`;

      let { sunrise, sunset } = data.sys,
        { timezone, visibility } = data,
        { humidity, pressure, feels_like } = data.main,
        { speed } = data.wind,
        sRiseTime = moment
          .utc(sunrise, "X")
          .add(timezone, "seconds")
          .format("hh:mm A"),
        sSetTime = moment
          .utc(sunset, "X")
          .add(timezone, "seconds")
          .format("hh:mm A");
      sunriseCard.innerHTML = `
               <div class="card__head">
                     <p> Sunrise & Sunset</p>
                    </div>
                    <div class="sunrise__sunset">
                      <div class="item">
                                <div class="icon"><i class="fa-solid fa-sun"></i></div>
                
                                <div>
                                                <p>sunrise</p>
                                                <h2>${sRiseTime}</h2>
                                </div>
                      </div>
                      <div class="item">
                                <div class="icon"><i class="fa-solid fa-moon"></i></div>
                                <div>
                                                <p>sunset</p>
                                                <h2>${sSetTime}</h2>
                                </div>
                      </div>
                
        </div>`;

      humidityVal.innerHTML = `${humidity}%`;
      pressureVal.innerHTML = `${pressure}hPa`;
      visibilityVal.innerHTML = `${visibility / 1000}km`;
      windSpeedVal.innerHTML = `${speed}m/s`;
    })

    .catch(() => {
      alert("failed to fetch current weather");
    });

  fetch(FORECAST_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let hourlyForecast = data.list;
      hourlyForecastCard.innerHTML = "";
      for (i = 0; i <= 7; i++) {
        let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
        let hr = hrForecastDate.getHours();
        let a = "PM";
        if (hr < 12) a = "AM";
        if (hr == 0) hr = 12;
        if (hr > 12) hr = hr - 12;
        hourlyForecastCard.innerHTML += `
        <div class="card">
                                <p>${hr} ${a}</p>
                                <img src="http://openweathermap.org/img/wn/${
                                  hourlyForecast[i].weather[0].icon
                                }.png" alt="image">
                                <p>${(
                                  hourlyForecast[i].main.temp - 273.15
                                ).toFixed(2)}&deg;C</p>
                </div>`;
      }
      let uniqueForeCastDays = [];
      let fiveDaysForecast = data.list.filter((forecast) => {
        let forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForeCastDays.includes(forecastDate)) {
          return uniqueForeCastDays.push(forecastDate);
        }
      });
      fiveDaysForecastCard.innerHTML = " ";
      for (i = 1; i < fiveDaysForecast.length; i++) {
        let date = new Date(fiveDaysForecast[i].dt_txt);
        fiveDaysForecastCard.innerHTML += `
        <div class="forecast__item">
                  <div class="icon__wrapper">
                    <img src="https://openweathermap.org/img/wn/${
                      fiveDaysForecast[i].weather[0].icon
                    }.png" alt="image">
                    <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(
                      2
                    )}&deg; C</span>
                  </div>
                  <p>${date.getDate()} ${months[date.getMonth()]}</p>
                  <p>${days[date.getDay()]}</p>
                </div>`;
      }
    })
    .catch(() => {
      alert("failed to fetch weather forecast");
    });
}

function getCityCoordinates() {
  let cityName = cityInput.value.trim();

  cityInput.value = "";

  if (!cityName) return;
  let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&
  limit=1&appid=${api_key}`;
  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let { name, lat, lon, country, state } = data[0];
      getWeatherDetails(name, lat, lon, country, state);
    })
    .catch(() => {
      alert(`Failed to fetch coordinates of ${cityName}`);
    });
}

function getUserCoordinates() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      let { latitude, longitude } = position.coords;
      let REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;

      fetch(REVERSE_GEOCODING_URL)
        .then((res) => res.json())
        .then((data) => {
          let { name, country, state } = data[0];
          getWeatherDetails(name, latitude, longitude, country, state);
        });
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert(
          "Geolocation permission denied, Please reset location permission to grant access again"
        );
      }
    }
  );
}

searchBtn.addEventListener("click", getCityCoordinates);
locationBtn.addEventListener("click", getUserCoordinates);
cityInput.addEventListener(
  "kemp",
  (e) => e.key === "Enter" && getCityCoordinates()
);
window.addEventListener("load", getUserCoordinates);
