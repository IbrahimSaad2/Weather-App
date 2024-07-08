let data;
let btn = document.querySelector(".btn");
let input = document.querySelector(".city");
let load = document.querySelector(".load");

//api
async function weather(city) {
  try {
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=233c9d1d63164313a04133131241806&q=${city}&days=3`);
    data = await response.json();
    console.log("Weather data:", data);
    display();
  } catch (error) {
    alert("Can't find the city, please enter a valid city name.", error);
  }
}

//to handle location using ipinfo api
async function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async function(position) {
      const { latitude, longitude } = position.coords;
      let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=233c9d1d63164313a04133131241806&q=${latitude},${longitude}&days=3`);
      let locationData = await response.json();
      weather(locationData.location.name);
      load.classList.add('d-none');
    }, function(error) {
      console.error("Error getting geolocation:", error);
      alert("Error getting your location. Please enter a city name manually.");
    });
  } else {
    alert("Geolocation is not supported by this browser. Please enter a city name manually.");
  }
}

// Call getLocation when page loads
window.onload = getLocation();

//event to search
btn.addEventListener("click", function() {
  console.log("City entered:", input.value);
  weather(input.value);
});

//display
function display() {
  let cartona = '';
  const timeZone = data.location.tz_id;

  //first day
  const today = new Date();
  cartona += ` <div class="col-lg-4 today">
              <div
                class="d-flex justify-content-between info-date p-2 rounded-3"
                style="background-color: #2d303d"
              >
                <span>${today.toLocaleString('en-US', { weekday: 'long', timeZone })}</span>
                <span class="date">${today.toLocaleString('en-US', { day: 'numeric', month: 'long', timeZone })}</span>
              </div>
              <div class="weather ms-2">
                <h1 class="h4 mt-4 ms-4">${data.location.name}</h1>
                <div>
                  <h2>${data.current.temp_c}°C</h2>
                </div>
                <div>
                  <img
                    style="width: 25%"
                    src=https:${data.current.condition.icon}
                    alt="shift"
                  />
                  <p style="color: #1577be; font-weight: 600" class="ms-3">
                  ${data.current.condition.text}
                  </p>
                </div>
                <div class="down ms-3 pb-4">
                  <span>
                    <img src="img/icon-umberella.png" alt="umbrella" />
                    ${data.current.humidity}%
                  </span>
                  <span class="ms-3">
                    <img src="img/icon-wind.png" alt="wind" /> ${data.current.wind_kph}km/h
                  </span>
                  <span class="ms-3">
                    <img src="img/icon-compass.png" alt="wind" /> ${data.current.wind_dir}
                  </span>
                </div>
              </div>
            </div>
            `;

  //other days
  for (let i = 1; i < data.forecast.forecastday.length; i++) {
    let forecast = data.forecast.forecastday[i];
    let date = new Date(forecast.date);
    let headbg = i === 1 ? '#222530' : '#2D303D';
    let bgColor = i === 1 ? '#262936' : '#323544';
    cartona += `
              <div class="col-lg-4 tom" style="background-color: ${bgColor}">
                <div
                  class="d-flex justify-content-between info-date p-2"
                  style="background-color: ${headbg}"
                >
                  <span>${date.toLocaleString('en-US', { weekday: 'long', timeZone })}</span>
                  <span class="date">${date.toLocaleString('en-US', { day: 'numeric', month: 'long', timeZone })}</span>
                </div>
                <div class="text-center sun">
                  <div class="mt-5">
                    <img src=https:${forecast.day.condition.icon} alt="sun" />
                  </div>
                  <div class="weather-after mt-4">
                    <span>${forecast.day.maxtemp_c}°C</span>
                    <p>${forecast.day.mintemp_c}°</p>
                    <h4>${forecast.day.condition.text}</h4>
                  </div>
                </div>
              </div>
              `;
  }
  document.getElementById("info-weather").innerHTML = cartona;
}
