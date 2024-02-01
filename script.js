function search() {
  let loadingDiv = document.getElementById("loading");
  let currentcard = document.getElementById("currentcard");
  let infocard = document.getElementById("info-grid");
  let searchCity = document.getElementById("search-box").value;
  let cityName = document.getElementById("cityname");
  let cityTemp = document.getElementById("cityTemp");
  let Condition = document.getElementById("Condition");
  let cityTempImg = document.getElementById("cityTempImg");
  let Humidity = document.getElementById("Humidity");
  let windSpeed = document.getElementById("windSpeed");
  let uvIndex = document.getElementById("uvIndex");
  let wheathervisiblity = document.getElementById("visibility");
  let forecast = document.getElementById("forecast");
  const apikey = "sUMglAsfNTHy23oAIGYlmrhzOQ6fMXDC";
  let ckey = "";

  let apiurl = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apikey}&q=${searchCity}`;


  document.getElementById("search-box").value = "";

  function hideElements() {
    currentcard.style.visibility = "hidden";
    infocard.style.visibility = "hidden";
    forecast.style.visibility = "hidden";
    cityTemp.style.visibility = "hidden";
    cityTempImg.style.visibility = "hidden";
    Condition.style.visibility = "hidden";
    loadingDiv.style.display ="none";
  
  }

  function showLoading() {
    hideElements();
    loadingDiv.style.display = "block";
  }

  function showCityNotFoundError() {
    hideElements();
    currentcard.style.visibility = "visible";
    cityName.innerText = "City Data Not Found!!!";
    }

  function showWeatherDataError() {
    hideElements();
    forecast.style.visibility = "visible";
    forecast.innerText = "Weather data not available";
  }

  function showErrorOnScreen(message) {
    hideElements();
    currentcard.style.visibility = "visible";
    cityName.innerText = message;

  }

  showLoading();

  fetch(apiurl)
    .then(response => {
      if (!response.ok) {
        showCityNotFoundError();
        throw new Error('City not found'); // Throw an error to skip the next .then block
      }
      return response.json();
    })
    .then(data => {
      if (!data || data.length === 0) {
        showCityNotFoundError();
        throw new Error('City data not available'); // Throw an error to skip the next .then block
      }

      let city = data[0].EnglishName;
      let state = data[0].AdministrativeArea.EnglishName;
      cityName.innerText = `${city}, ${state}`;

      ckey = data[0].Key;

      let cityTempUrl = `https://dataservice.accuweather.com/currentconditions/v1/${ckey}?apikey=${apikey}&details=True`;
      return fetch(cityTempUrl);
    })
    .then(anotherResponse => {
      if (!anotherResponse.ok) {
        showWeatherDataError();
        throw new Error('Weather data not available'); // Throw an error to skip the next .then block
      }
      return anotherResponse.json();
    })
    .then(anotherData => {
      TempData = anotherData[0];

      cityTemp.innerText = `${TempData.Temperature.Metric.Value}` + "°C";
      Condition.innerText = `${TempData.WeatherText}`;
      Humidity.innerText = `${TempData.RelativeHumidity}` + "%";
      windSpeed.innerText = `${TempData.Wind.Speed.Metric.Value}` + "km/h";
      uvIndex.innerText = `${TempData.UVIndex}`;
      wheathervisiblity.innerText = `${TempData.Visibility.Metric.Value}` + 'km';

      let IconImg = TempData.WeatherIcon.toString().padStart(2, '0');
      cityTempImg.src = `https://developer.accuweather.com/sites/default/files/${IconImg}-s.png`;
      
      let forecastUrl = `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${ckey}?apikey=${apikey}&metric=True`;
      
      return fetch(forecastUrl);
    }).then(response => {
      if (!response.ok) {
        showWeatherDataError();
        throw new Error('Hourly forecast data not available'); // Throw an error to skip the next .then block
      }
      return response.json();
    })
    .then(data => {
      for (let index = 0; index < 12; index++) {
        let hourtime = document.querySelector(`#hour${index} h2`);
        let tempIcon = document.querySelector(`#hour${index} #cityTempImg`);
        let temp = document.querySelector(`#hour${index} .temp`);
        let tempText = document.querySelector(`#hour${index} .temp-text`);

        const iso8601String = data[index].DateTime;
        const date = new Date(iso8601String);

        // Format options
        const options = {
          hour: 'numeric',
          minute: 'numeric',
        };

        // Convert to readable format
        const readableFormat = date.toLocaleString('en-US', options);

        hourtime.innerText = `${readableFormat}`;
        temp.innerText = `${data[index].Temperature.Value}` + "°C";
        tempText.innerText = `${data[index].IconPhrase}`;
        let TempImg = data[index].WeatherIcon.toString().padStart(2, '0');
        tempIcon.src = `https://developer.accuweather.com/sites/default/files/${TempImg}-s.png`;
      }
      loadingDiv.style.display = "none";
      currentcard.style.visibility = "visible";
      infocard.style.visibility = "visible";
      forecast.style.visibility = "visible";
      cityTemp.style.visibility = "visible";
    cityTempImg.style.visibility = "visible";
    Condition.style.visibility = "visible";
    })
    .catch(error => {
      showErrorOnScreen(error.message);
    });

}
