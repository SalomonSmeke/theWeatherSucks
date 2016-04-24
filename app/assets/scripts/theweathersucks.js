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
    console.log("Location conversion requested for: Lat " + lat + " Lon " + lon);
    var deferredR = $.getJSON("/api/getLoc?lat=" + lat + "&lon=" + lon);
    deferredR.then(
      function(value){
        update(zipParse(value))
      },
      function(reason){
        locFail(reason)
      });
  }

  function locFail(error) {
    console.error(error);
    update (defaultLoc);
  }

  function update(loc) {
    var weather,type;

    var $deferredConditionsRequest = $.getJSON("/api/getCond?zip=" + loc.zip + "," + loc.country);

    $deferredConditionsRequest
    .then(
      function(value){weather = condFetchSucc(value)},
      function(reason){weather = condFetchFail(reason)}
    ).then(
      function(value){type = pickType(weather);
      },
      function(reason){type = pickType(weather)}
    );

    var $deferredWorker1 = $.Deferred();
    var $deferredWorker2 = $.Deferred();

    $.when($deferredConditionsRequest).done(
      function(args) {
        $deferredWorker1.resolve();
        $deferredWorker1.then(
          function(value){
            setPallete(conditionsRLookup[type]);
            setGreeting(conditionsRLookup[type]);
            setIcon(weather);
            setLocation(loc);
            setSmileys(weather, type);
            placeTemperature(weather);
          }
        )
      }
    );

    var worseWeather;

    $.when($deferredConditionsRequest).done(
      function(args) {
        $deferredWorker2.resolve();
        $deferredWorker2.then(
          function(value){
            //getWorseConditions(weather);
          }
        );
      }
    ).then(
      function(args) {
        //getMetrics();
        //drawMetricsD3();
      }
    );

    $.when($deferredWorker1,$deferredWorker2).done(
      function(args){
        $(".hidemebro").hide();
        window.scrollTo(0, document.getElementById("page_1").offsetTop);
      }
    );
  }

   getLocation();
  // bindInteractivity();
}



$(document).ready(load);
