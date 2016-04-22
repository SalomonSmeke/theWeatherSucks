function load(){
  "use strict";


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

  function update(loc) {
    var weather;

    var $deferredConditionsRequest = $.getJSON("/api/getCond?zip=" + loc.zip + "," + loc.country);

    $deferredConditionsRequest.then(function(value) {
      console.log("Response from server received.");

      weather = weatherParse(value);

      if (weather){
        console.log("Weather correctly fetched: " + JSON.stringify(weather));
      } else {
        weather = defaultWeather;
        console.error("Weather fetch failed, using default: " + JSON.stringify(weather));
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
