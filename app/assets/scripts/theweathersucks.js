
"use strict";

function load(){

  function getLocation() {
    var geoOptions = {
    	maximumAge: 5 * 60 * 1000,
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(locToZip, locFail, geoOptions);
    } else {
        locFail();
    }
  }
  function locToZip(position) {
    $.getJSON("/api/getLoc", function (response) {  //TODO how do we pass something to the backend?
      console.log("response = "+response.toSource());
      update({zip: "60660", country: "us", fetched: true}); //TODO replace with response IN THIS FORMAT
    });
  }
  function locFail() {
    update ({zip: "60660", country "us", fetched: false});
  }

//http://openweathermap.org/current

  function update(loc) {
    getWorseConditions(); //ASYNC D
    setGreeting(); //ASYNC D
    setIcon(); //ASYNC D
    setSmileys(); //ASYNC D
    placeTemperature(); //ASYNC D

    getMetrics(); //ASYNC E... but actually E. Cause lets do it last.

    drawMetricsD3(); //ASYNC F
  }

  function fetchConditions() {

  }
  function pickType() { //do this when conditions is done

  }
  function setPallete() { //do this when pickType is done

  }
  function setLocation() { //do this when location is done

  }

  function getWorseConditions() { //do this when pick and fetch location are done

  }

  fetchLocation();
  update();
  bindInteractivity();
}



$(document).ready(load);
