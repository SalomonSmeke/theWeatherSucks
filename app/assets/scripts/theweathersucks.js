
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
    /* use the google API to translate our position to zip code */
    update ({zip: "60660", fetched: "yes"});
  }
  function locFail() {
    update ({zip: "60660", fetched: "no"});
  }

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

  function update() {
    getWorseConditions(); //ASYNC D
    setGreeting(); //ASYNC D
    setIcon(); //ASYNC D
    setSmileys(); //ASYNC D
    placeTemperature(); //ASYNC D

    getMetrics(); //ASYNC E... but actually E. Cause lets do it last.

    drawMetricsD3(); //ASYNC F
  }

  fetchLocation();
  update();
  bindInteractivity();
}



$(document).ready(load);
