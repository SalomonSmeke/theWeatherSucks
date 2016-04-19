function load(){
  "use strict";
  var parsedConds;
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
    update ({zip: "60660", country: "us", state: "il", city: "chicago", fetched: false});
  }
  function zipParse(res) {
    var state, city, zip;
    //UGLY, but easy to read. FIND STATE.
    loop:{ for (var result in res.results) {
      for (var addrComp in res.results[result].address_components){
        for (var type in res.results[result].address_components[addrComp].types){
          if (res.results[result].address_components[addrComp].types[type]==="administrative_area_level_1"){
            state = res.results[result].address_components[addrComp].short_name;
            break loop;
          }
        }
      }
    }}
    loop:{ for (var result in res.results) {
      for (var addrComp in res.results[result].address_components){
        for (var type in res.results[result].address_components[addrComp].types){
          if (res.results[result].address_components[addrComp].types[type]==="locality"){
            city = res.results[result].address_components[addrComp].short_name;
            break loop;
          }
        }
      }
    }}
    loop:{ for (var result in res.results) {
      for (var addrComp in res.results[result].address_components){
        for (var type in res.results[result].address_components[addrComp].types){
          if (res.results[result].address_components[addrComp].types[type]==="postal_code"){
            zip = res.results[result].address_components[addrComp].short_name;
            break loop;
          }
        }
      }
    }}
    if (city==null || state ==null || zip==null){
      console.error("Failed to find location at those coordinates, using default.");
      return({zip: "60660", country: "us", state: "il", city: "chicago", fetched: false});
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
    var $deferredConditionsRequest = $.getJSON("/api/getCond?zip=" + loc.zip + "," + loc.country);
    $deferredConditionsRequest.then(console.log(res) , console.log("dont got em"));

    // parseRequest();
    //
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
