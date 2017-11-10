// -----------STRICT MODE---------
"use strict";

// ---------HTML VARIABLES
let inputBox = document.getElementById('zipCode');
let submit = document.getElementById('submit');
let forecastBox = document.getElementById('fiveDayForecast');
let thermBox = document.getElementById('thermometer');
let thermometerImg = document.getElementById('thermometerImg');
let mainCondition = document.getElementById('mainCondition');
let mainConditionImg = document.getElementById('mainConditionIcon');
let windSpeedBox = document.getElementById('windSpeed');
let windDirBox = document.getElementById('windDirection');
let humidBox = document.getElementsByClassName('humidity');
let humidText = document.getElementById('humidityNum');
let lowTemp = document.getElementById('lowTemp');
let currentTemp = document.getElementById('currentTemp');
let highTemp = document.getElementById('highTemp');
let cityBox = document.getElementById('cityName');

// ------API VARIABLES
let APIKEY = '&APPID=86f63dcb9d2bd1cf3f8d4438c91746a9';
let requestURL =  'https://api.openweathermap.org/data/2.5/'
let forecast = 'forecast?';
let currentWeather = 'weather?'
let fUnits = '&units=imperial'

// TESTING THE CONNECTIONS WITH CONSOLE.LOG
// console.log(inputBox);
// console.log(submit);
// console.log(forecastBox);
// console.log(thermBox);
// console.log(mainCondition);
// console.log(windBox);
// console.log(humidBox);

// CHECKING IF INPUT IS A NUMBER
function numberChecker(a) {
  let isNumber = /^[0-9]+$/;

  if(a.match(isNumber)) {
    return true;
  }else {
    return false
  }};

// SUBMIT BUTTON EVENT LISTENER FUNCTION
function onSubmit() {
  let zipInput = inputBox.value;
  let correctedZip;
  // STERILIZING THE INPUT BOX
  if (numberChecker(zipInput) == false) {
    alert('please use numbers')
  }
  if (inputBox.value.length != 5) {
    alert ('please enter a five-digit zip code')
  }

  if((inputBox.value.length == 5) && (numberChecker(zipInput) === true)) {
    // CONSOLE.LOG STATEMENTS THAT FOLLOW ARE FOR TESTING RETURN VALUES OF VARIABLES DEFINED LOCALLY
    let correctedZip = zipInput;
    // console.log(correctedZip);
    let zipRequest = '&zip=' + correctedZip + ',us'
    // console.log(zipRequest);
    let currentApiCall = requestURL + currentWeather + fUnits + zipRequest + APIKEY;
    console.log(currentApiCall); //-----API REQUEST IS CORRECT.

    // AJAX REQUEST
    let exchangeAjaxReq = new XMLHttpRequest();

    exchangeAjaxReq.onreadystatechange = function () {
      if (exchangeAjaxReq.readyState == 1) {
        console.log("The machines are making their greeting");
      }
      else if (exchangeAjaxReq.readyState == 2) {
        console.log("Mr. Server understands the request");
      }
      else if (exchangeAjaxReq.readyState == 3) {
        console.log("Mr. Server is off to market");
      }
      else if (exchangeAjaxReq.readyState == 4) {
        console.log("Mr. Server has fetched Mr. Script\'s things.");

        //CAPTURING AJAX RESPONSE AND PARSING THE JSON OBJECT
        let dataJSON = JSON.parse(exchangeAjaxReq.responseText);

        // STORING JSON VALUES AS JS VARIABLES
        let temp = Math.round(dataJSON.main.temp);
        let minTemp = Math.round(dataJSON.main.temp_min);
        let maxTemp = Math.round(dataJSON.main.temp_max);
        let humidity = dataJSON.main.humidity;
        let windSpeed = Math.round(dataJSON.wind.speed);
        let windDirection = dataJSON.wind.deg;

          //THOUGHT THAT conditionCode WAS WORKING. TURNS OUT, THE ID IS BEING REPORTED BACK AND IS VISIBLE IN THE CONSOLE BY LOGGING dataJSON.weather, BUT FOR SOME REASON dataJSON.weather.id RETURNS UNDEFINED (EVEN THOUGH IT IS NOT UNDEFINED). GIVING UP AFTER 3 HOURS OF TROUBLESHOOTING. #1STWORLDPROBLEMS

        let conditionCode = dataJSON.weather[0].id;
        let cityName = dataJSON.name;

        // DOCUMENTATION SHOWS ".RAIN" BUT OBJECT DOES NOT CONTAIN THE PROPERTY
        // let precipitation = dataJSON.rain.3h;

        // INPUTTING CITY NAME INTO THE DOM
        cityBox.innerHTML = "<h3>Getting weather for:</h3><h2> " + cityName + "</h2>";

        //INPUTTING HUMIDITY PERCENTAGE INTO DOM
        humidText.innerHTML = "<h2>" + humidity + "% Humidity</h2>";

        // INSERTING TEMPERATURE VALUES INTO THE DOM
        lowTemp.innerHTML = "<h4>Low: " + minTemp + '</h4>';
        currentTemp.innerHTML = "<h4>Now: " + temp + '<h4>';
        highTemp.innerHTML = "<h4>High: " + maxTemp + '<h4>';

        // SETTING THERMOMETER IMAGE BASED ON TEMPERATURE
        if (temp >= 70) {
          thermometerImg.src="icons/thermometers/thermoHot.svg";
          thermBox.style.backgroundImage = 'url("icons/backgrounds/hotBG.jpg")';
        }
        else if (temp < 70 && temp > 45) {
          thermometerImg.src="icons/thermometers/thermoNormal.svg";
          thermBox.style.backgroundImage = 'url("icons/backgrounds/normalBG.jpg")';
        }
        else {
          thermometerImg.src = "icons/thermometers/thermoCold.svg";
          thermBox.style.backgroundImage = 'url("icons/backgrounds/coldBG.jpg")';
        }

        // SETTING UP ICONS
        if (conditionCode >= 200 && conditionCode < 300) {
          mainConditionIcon.src = "icons/wUnderground/11d.svg"
        } else if (conditionCode >= 300 && conditionCode < 400) {
          mainConditionIcon.src = "icons/wUnderground/09d.svg"
        } else if (conditionCode >= 500 && conditionCode < 511) {
          mainConditionIcon.src = "icons/wUnderground/10d.svg"
        } else if (conditionCode >= 511 && conditionCode < 600) {
          mainConditionIcon.src = "icons/wUnderground/09d.svg"
        } else if (conditionCode >= 600 && conditionCode < 700) {
          mainConditionIcon.src = "icons/wUnderground/13d.svg"
        } else if (conditionCode >= 700 && conditionCode < 800) {
          mainConditionIcon.src = "icons/wUnderground/50d.svg"
        } else if (conditionCode == 800) {
          mainConditionIcon.src = "icons/wUnderground/01d.svg"
        } else if (conditionCode == 801) {
          mainConditionIcon.src = "icons/wUnderground/02d.svg";
        } else if (conditionCode == 802) {
          mainConditionIcon.src = "icons/wUnderground/03d.svg";
        } else if (conditionCode == 803 || conditionCode == 804) {
          mainConditionIcon.src = "icons/wUnderground/04d.svg";
        } else {
          mainConditionIcon.src = "icons/wUnderground/01d.svg";
        }

        // FUNCTION TO CONVERT DEGREES REPORTED BY API TO COMPASS ROSE DIRECTIONS
        function degToDir(num) {
          //converts argument into a "pie slice" and offsets shared values
          let degs = Math.floor((num / 45) + 0.5);
          let compassRose = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
          return compassRose[(degs % 8)];
        }

        // INPUTTING VALUES FOR WIND SPEED AND DIRECTION INTO DOM
        // WIND SPEED INPUT
        windSpeedBox.innerHTML = '<h3>' + windSpeed + ' MPH</h3>';
        windDirBox.innerHTML = '<h3>' + degToDir(windDirection) + '</h3>';
      }
      else {
        console.log('borkdt');
      }
    }
    exchangeAjaxReq.open("GET", currentApiCall, true);
    exchangeAjaxReq.send();
  }};

// SUBMIT BUTTON EVENT LISTENER
submit.addEventListener('click', onSubmit);
