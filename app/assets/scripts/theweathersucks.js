function load(){
  "use strict";
  var defaultLoc = {zip: "60660", country: "us", state: "il", city: "chicago", fetched: false}
  var defaultWeather = {zip: "60660", country: "us", state: "il", city: "chicago", fetched: false}
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

    state = unwrapZipRequest(res, "administrative_area_level_1");
    city = unwrapZipRequest(res, "locality");
    zip = unwrapZipRequest(res, "postal_code");

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
      console.log("Looks like we got it! " + JSON.stringify(value));
      weather = weatherParse(value);
      console.log("parsed: " + JSON.stringify(weather)); //TODO: replace
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
    return defaultWeather; //TODO: parse weather
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
