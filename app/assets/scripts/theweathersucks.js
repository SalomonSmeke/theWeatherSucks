function load(){
  "use strict";
  var parsedConds;
  function getLocation() {
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
    var deferredR = $.getJSON("/api/getLoc?lat=" + lat + "&lon=" + lon , function (response) { //TODO error should send to locFail
      update(zipParse(response));
    });
  }
  function locFail(error) {
    console.error(error);
    update ({zip: "60660", country: "us", state: "il", city: "chicago", fetched: false});
  }
  function zipParse(response) {
    var state, city, zip;
    var res = JSON.parse(response);
    //UGLY, but easy to read. FIND STATE.
    loop:{ for (result in res.results) {
      for (addrComp in result.address_components){
        for (type in addrComp.types){
          if (type==="administrative_area_level_1"){
            state = addrComp.short_name;
            break loop;
          }
        }
      }
    }}
    loop:{ for (result in res.results){
      for (addrComp in result.address_components){
        for (type in addrComp.types){
          if (type==="locality"){
            city = addrComp.short_name;
            break loop;
          }
        }
      }
    }}
    loop:{ for (result in res.results){
      for (addrComp in result.address_components){
        for (type in addrComp.types){
          if (type==="postal_code"){
            zip = addrComp.short_name;
            break loop;
          }
        }
      }
    }}
    if (city=="" || state =="" || zip==""){
      console.error("Failed to find location at those coordinates, using default.");
      return({zip: "60660", country: "us", state: "il", city: "chicago", fetched: false});
    }
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
    //var $deferredConditionsRequest = $.getJSON(); //TODO GET CONDITIONS FROM SERVER API CALL
    //$deferredConditionsRequest.then(parseRequest,logFailure);

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
  // fetchLocation();
  // update();
  // bindInteractivity();
}



$(document).ready(load);
