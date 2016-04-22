function load(){
  "use strict";
  var defaultLoc = {zip: "60660", country: "us", state: "il", city: "chicago", fetched: false}
  var defaultWeather = {zip: "60660", country: "us", state: "il", city: "chicago", fetched: false} //{type: type, desc: desc, temp: temp, tempMin: tempMin, tempMax: tempMax, humidity: humidity, wind: wind, fetched: true}
  function getLocation() {
    console.log("Location Request Started...")
    var geoOptions = {
    	maximumAge: 5 * 60 * 1000,
      timeout: 10 * 1000
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(locToZip, locFail, geoOptions);
    } else {
        locFail("GeoLocation: Not supported by browser or disabled");
    }
  }
  function locToZip(position) {
    var lat = (position.coords.latitude || "0") + "";
    var lon = (position.coords.longitude || "0") + "";
    console.log("Location conversion requested for: Lat " + lat + " Lon " + lon)
    var deferredR = $.getJSON("/api/getLoc?lat=" + lat + "&lon=" + lon , function (response) { //TODO error should send to locFail
      update(zipParse(response));
    });
  }
  function locFail(error) {
    console.error(error);
    update (defaultLoc);
  }
  function zipParse(res) {
    var state, city, zip;
    //UGLY, but easy to read.
    function unwrapZipRequest(input, search){
     for (var result in input.results) {
        for (var addrComp in input.results[result].address_components){
          for (var type in input.results[result].address_components[addrComp].types){
            if (input.results[result].address_components[addrComp].types[type]===search){
              return input.results[result].address_components[addrComp].short_name;
            }
          }
        }
      }
    }

    state = unwrapZipRequest(res, "administrative_area_level_1") || null;
    city = unwrapZipRequest(res, "locality") || null;
    zip = unwrapZipRequest(res, "postal_code") || null;

    if (city==null || state ==null || zip==null){
      console.error("Failed to find location at those coordinates, using default.");
      return(defaultLoc);
    }
    console.log("Successful location get: " + zip + " " + state + " " + city);
    return {zip: zip, country: "us", state: state, city: city, fetched: true};
  }

/*
var $deferredNotesRequest = $.getJSON (
    "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
    { tags: img_tags,
      tagmode: "any",
      format: "json"
    });
*/
//http://openweathermap.org/current

  function update(loc) {
    var weather;
    var $deferredConditionsRequest = $.getJSON("/api/getCond?zip=" + loc.zip + "," + loc.country);
    $deferredConditionsRequest.then(function(value) {
      console.log("Response from server received.");
      weather = weatherParse(value);
      if (weather.fetched){
        console.log("Weather correctly fetched: " + JSON.stringify(weather))
      } else {
        console.error("Weather fetch failed, using default.")
      }
    }, function(reason) {
      console.error("frick" + reason);
      weather = defaultWeather;
    });
    var worseWeather;
    // getWorseConditions(); //ASYNC D
    // setGreeting(); //ASYNC D
    // setIcon(); //ASYNC D
    // setSmileys(); //ASYNC D
    // placeTemperature(); //ASYNC D
    //
    // getMetrics(); //ASYNC E... but actually E. Cause lets do it last.
    //
    // drawMetricsD3(); //ASYNC F
  }
  function weatherParse(value){
    var type, desc, temp, tempMin, tempMax, humidity, wind;

    var flag = false;
    if (value.weather !== undefined) {
      if (value.weather[0].main !== undefined && value.weather[0].description !== undefined) {
        type = value.weather[0].main;
        desc = value.weather[0].description;
      } else {
        flag = true;
      }
    } else {
      flag = true;
    }

    if (value.main !== undefined) {
      if (value.main.temp !== undefined && value.main.temp_min !== undefined && value.main.temp_max !== undefined && value.main.humidity !== undefined) {
        temp = value.main.temp;
        tempMin = value.main.temp_min;
        tempMax = value.main.temp_max;
      } else {
        flag = true;
      }
    } else {
      flag = true;
    }

    if (value.wind !== undefined) {
      if (value.wind.speed !== undefined) {
        wind = value.wind.speed;
      } else {
        flag = true;
      }
    } else {
      flag = true;
    }

    if (flag) {
      return defaultWeather;
    } else {
      return {type: type, desc: desc, temp: temp, tempMin: tempMin, tempMax: tempMax, humidity: humidity, wind: wind, fetched: true};
    }
  }
  //
  // function pickType() { //do this when conditions is done
  //
  // }
  // function setPallete() { //do this when pickType is done
  //
  // }
  // function setLocation() { //do this when location is done
  //
  // }
  //
  // function getWorseConditions() { //do this when pick and fetch location are done
  //
  // }
  //
   getLocation();
  // bindInteractivity();
}



$(document).ready(load);
