$(document).ready(function() {

var prevUserArray = JSON.parse(localStorage.getItem("prevusercity"))
let currentCityURL = prevUserArray[0];
let cityName = prevUserArray[1]
let cityTemp = prevUserArray[2]
let cityHumidity = prevUserArray[3]
let cityWindSpeed = prevUserArray[4]
let cityLat = prevUserArray[5]
let cityLon = prevUserArray[6]
let cityID = prevUserArray[7]
let cityDate = prevUserArray[8]
let uvIndex = prevUserArray[9]
callForecast(currentCityURL,cityName,cityTemp,cityHumidity,cityWindSpeed,cityLat,cityLon,cityID,cityDate,uvIndex)
})


const apiKey = "d89be744c6216b194efb9d644e4c713a";





$("#cityParameter").on("click", function() {
  $("#five-day-wrapper").html("")
  $("#uv-data").html("")
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
    console.log(response)
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
         let dayPlusOne = response.list[0]
         let dayPlusTwo = response.list[8]
         let dayPlusThree = response.list[16]
         let dayPlusFour = response.list[24]
         let dayPlusFive = response.list[32]
         var forecastArray = [dayPlusOne,dayPlusTwo,dayPlusThree,dayPlusFour,dayPlusFive]
   
      for(var i = 0;i < forecastArray.length;i++) {
        var dateText = forecastArray[i].dt_txt.split(" ",1)[0]
        var forecastTemp = forecastArray[i].main.temp
        var forecastHumidity = forecastArray[i].main.humidity
        var dateDiv = $("<div></div")
   
      
        $("#five-day-wrapper").append(dateDiv)
        dateDiv.append("<p>" + dateText +"</p>")
        dateDiv.append("<p>Temperature: "+forecastTemp+" °F</p>")
        dateDiv.append("<p>Humidity: "+forecastHumidity+"%</p>")
        dateDiv.addClass('forecastdiv')
      }
      renderCityData(currentCityURL,cityName,cityTemp,cityHumidity,cityWindSpeed,cityLat,cityLon,cityID,cityDate,uvIndex)
      });
}

function renderCityData(currentCityURL,cityName,cityTemp,cityHumidity,cityWindSpeed,cityLat,cityLon,cityID,cityDate,uvIndex) {
let newCity = $(`<button onclick='renderPrevCity()'id='${cityName}'>${cityName}</button>`)

$("#city-list").append(newCity)
$("#T-city").text(cityName + "   For:  " + cityDate)
$("#temperature-data").text("Temperature: " + cityTemp + " °F")

$("#humidity-data").text("Humidity: " + cityHumidity + "%")
$("#wind-data").text("Wind Speed: " + cityWindSpeed + " MPH")
$("#uv-data").append("UV Index: " + "<span id='uvValue'>" + uvIndex + "</span>")
if(uvIndex < 2){
  $("#uvValue").addClass("low")
 }
 if(uvIndex < 7){
  $("#uvValue").addClass("high")
 }
 else {
  $("#uvValue").addClass("extreme")
 }

let prevUserArray = [currentCityURL,cityName,cityTemp,cityHumidity,cityWindSpeed,cityLat,cityLon,cityID,cityDate,uvIndex]
localStorage.setItem("prevusercity",JSON.stringify(prevUserArray))




}

function renderPrevCity(cityVal) {
  $("#five-day-wrapper").html("")
  $("#uv-data").html("")
  console.log(cityVal)
  const currentCityURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&appid=${apiKey}&units=imperial`;
  callCurrentWeather(currentCityURL,cityval)
}
