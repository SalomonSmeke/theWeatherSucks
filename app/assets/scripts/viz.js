function ChosenOfRNGesus(type,targetTemps) {
  var lookups;
  var comparator;
  var defaultWeathers;
  switch (type){
    case 3:
      lookups = pollingLocations.warm;
      comparator = function (a,b){
        return a < b;
      }
      defaultWeathers = sunCopOut;
      break;
    default:
      lookups = pollingLocations.cold;
      comparator = function (a,b){
        return a > b;
      }
      defaultWeathers = moonCopOut;
  }

  var indexSearch = getRNGesus(lookups);
  var curr = lookups[indexSearch];
  function worseFetch(){
    if (lookups.length === 0) {
      dataPrint(defaultWeathers,defaultWeathers);
      return;
    }
    $.getJSON("/api/getCondLatLon?lat=" + curr.lat + "&lon=" + curr.lon) //first try
    .then(
      function(res){
        if (comparator(targetTemps,res.temp)) {
          dataPrint(res);
        } else {
          lookups.splice(indexSearch,1);
          indexSearch = getRNGesus(lookups);
          curr = lookups[indexSearch];
          worseFetch();
        }
      }
    );
  }

  function getRNGesus(arrayIn) {
    return Math.floor((Math.random() * arrayIn.length));
  }

  function dataPrint(data,location) {
    if (location.copOut){
      worseLocation(location,false);
    } else {
      worseLocation(location,true);
    }
    console.log(data);
  }

  worseFetch();
}
