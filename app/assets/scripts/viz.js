function ChosenOfRNGesus(type,targetTemps) {
  var lookups;
  function comparator;
  var default;
  switch (type){
    case 3:
      lookups = pollingLocations.warm;
      comparator = function (a,b){
        return a < b;
      }
      default = sunCopOut;
      break;
    default:
      lookups = pollingLocations.cold;
      comparator = function (a,b){
        return a > b;
      }
      default = moonCopOut;
  }

  var curr = getRNGesus(lookups);
  var selected;
  $.getJSON("/api/getCondLatLon?lat=" + curr.lat + "&lon=" + curr.lon) //first try
  .then(
    function (res){
      res = weatherParse(res);
      if (comparator(targetTemps,res.temp)){
        selected = res;
      } else {
        lookups = lookups.splice(curr,1);
        curr = getRNGesus(lookups);
        $.getJSON("/api/getCondLatLon?lat=" + curr.lat + "&lon=" + curr.lon).then( //second try
          function (res){
            res = weatherParse(res);
            if (comparator(targetTemps,res.temp)){
              selected = res;
            } else {
              lookups = lookups.splice(curr,1);
              curr = getRNGesus(lookups);
              $.getJSON("/api/getCondLatLon?lat=" + curr.lat + "&lon=" + curr.lon).then(

              )
            }
          }
        )
      }
    }
  );

}

function getRNGesus(arrayIn) {
  return Math.floor((Math.random() * arrayIn.length));
}

d3.select(window).on('resize', resize);

function resize() {


}
