
const apiKey = "d89be744c6216b194efb9d644e4c713a";





$("#cityParameter").on("click", function() {

let cityName = $("#city-search").val()
const currentCityURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
callCurrentWeather(currentCityURL,cityName)
})

function callCurrentWeather(currentCityURL,cityName) {
$.ajax({
    url: currentCityURL,
    method: "GET",
  }).then(function(response) {
    let cityTemp = response.main.temp
    let cityHumidity = response.main.humidity
    let cityWindSpeed = response.wind.speed
    let cityLat = response.coord.lat;
    let cityLon = response.coord.lon;
    let cityID = response.id;
    
    callUVData(currentCityURL,cityName,cityTemp,cityHumidity,cityWindSpeed,cityLat,cityLon,cityID)
  });

}

function callUVData(currentCityURL,cityName,cityTemp,cityHumidity,cityWindSpeed,cityLat,cityLon,cityID) {
    const uvKey = "7ea17fc2022293bf9be1b6794b77432e";
    const uvURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${cityLat}&lon=${cityLon}&appid=${uvKey}&units=imperial`;
  $.ajax({
    url: uvURL,
    method: "GET",
  }).then(function(response) {
    console.log(response);
    let uvIndex = response.value
    let rawDate = response.date_iso;
    let cityDate = rawDate.split("T",1)[0]
    callForecast(currentCityURL,cityName,cityTemp,cityHumidity,cityWindSpeed,cityLat,cityLon,cityID,cityDate,uvIndex)
  });

}

function callForecast(currentCityURL,cityName,cityTemp,cityHumidity,cityWindSpeed,cityLat,cityLon,cityID,cityDate,uvIndex) {

    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?id=${cityID}&cnt=40&appid=${apiKey}&units=imperial`;
    $.ajax({
        url: forecastURL,
        method: "GET",
      }).then(function(response) {
        console.log(response);
         let dayPlusOne = response.list[0]
         let dayPlusTwo = response.list[6]
         let dayPlusThree = response.list[14]
         let dayPlusFour = response.list[22]
         let dayPlusFive = response.list[30]
         var forecastArray = [dayPlusOne,dayPlusTwo,dayPlusThree,dayPlusFour,dayPlusFive]
   
      for(var i = 0;i < forecastArray.length;i++) {
        console.log(forecastArray[i])
        var dateText = forecastArray[i].dt_txt.split(" ",1)[0]
        var forecastTemp = forecastArray[i].main.temp
        var forecastHumidity = forecastArray[i].main.humidity
        console.log(dateText)
        var dateDiv = $("<div></div")
   
      
        $("#five-day-wrapper").append(dateDiv)
        dateDiv.append("<p>" + dateText +"</p>")
        dateDiv.append("<p>Temperature: "+forecastTemp+"F</p>")
        dateDiv.append("<p>Humidity: "+forecastHumidity+"%</p>")
        dateDiv.addClass('forecastdiv')
      }
        console.log(forecastArray)
      renderCityData(currentCityURL,cityName,cityTemp,cityHumidity,cityWindSpeed,cityLat,cityLon,cityID,cityDate,uvIndex)
      });
}

function renderCityData(currentCityURL,cityName,cityTemp,cityHumidity,cityWindSpeed,cityLat,cityLon,cityID,cityDate,uvIndex) {
let newCity = $(`<button onclick='renderPrevCity()'id='${cityName}'>${cityName}</button>`)
$("#city-list").append(newCity)
$("#T-city").text(cityName + "   For:  " + cityDate)
$("#temperature-data").text("Temperature: " + cityTemp)
$("#humidity-data").text("Humidity: " + cityHumidity)
$("#wind-data").text("Wind Speed: " + cityWindSpeed)
$("#uv-data").text("UV Index: " + uvIndex)
let prevUserArray = [currentCityURL,cityName,cityTemp,cityHumidity,cityWindSpeed,cityLat,cityLon,cityID,cityDate,uvIndex]
localStorage.setItem("prevusercity",JSON.stringify(prevUserArray))
console.log(prevUserArray)




}

function renderPrevCity() {
  event.preventDefault()
  var newcityName = $(this).attr("id")
  console.log(newcityName)
  const currentCityURL = `https://api.openweathermap.org/data/2.5/weather?q=${newcityName}&appid=${apiKey}&units=imperial`;
}