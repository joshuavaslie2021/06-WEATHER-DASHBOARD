
const apiKey = "d89be744c6216b194efb9d644e4c713a";





$("#cityParameter").on("click", function() {

let cityName = $("#city-search").val()
const currentCityURL = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
console.log(cityName)
callCurrentWeather(currentCityURL)
})

function callCurrentWeather(currentCityURL) {
$.ajax({
    url: currentCityURL,
    method: "GET",
  }).then(function(response) {
    console.log(response);
    let cityTemp = response.main.temp
    let cityHumidity = response.main.humidity
    let cityWindSpeed = response.wind.speed
    let cityLat = response.coord.lat;
    let cityLon = response.coord.lon;
    let cityID = response.id;
    callUVData(cityLat,cityLon)
    callforecast(cityID)
  });

}

function callUVData(cityLat,cityLon) {
    const uvKey = "7ea17fc2022293bf9be1b6794b77432e";
    const uvURL = `http://api.openweathermap.org/data/2.5/uvi?lat=${cityLat}&lon=${cityLon}&appid=${uvKey}&units=imperial`;
  $.ajax({
    url: uvURL,
    method: "GET",
  }).then(function(response) {
    console.log(response);
    let uvIndex = response.value

  });

}

function callforecast(cityID) {

    const forecastURL = `http://api.openweathermap.org/data/2.5/forecast?id=${cityID}&cnt=40&appid=${apiKey}&units=imperial`;
    $.ajax({
        url: forecastURL,
        method: "GET",
      }).then(function(response) {
        console.log(response);
    
      });
}