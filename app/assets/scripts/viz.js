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
  $.getJSON("/api/getCondLatLon?lat=" + curr.lat + "&lon=" + curr.lon) //first try
  .then(
    function (res){
      res = weatherParse(res);
      if (comparator(targetTemps,res.temp)){
        dataPrint(res);
      } else {
        lookups.splice(indexSearch,1);
        indexSearch = getRNGesus(lookups);
        curr = lookups[indexSearch];
        $.getJSON("/api/getCondLatLon?lat=" + curr.lat + "&lon=" + curr.lon)
        .then( //second try
          function (res){
            res = weatherParse(res);
            if (comparator(targetTemps,res.temp)){
              dataPrint(res,curr);
            } else {
              lookups.splice(indexSearch,1);
              indexSearch = getRNGesus(lookups);
              curr = lookups[indexSearch];
              $.getJSON("/api/getCondLatLon?lat=" + curr.lat + "&lon=" + curr.lon)
              .then( //third
                function (res){
                  res = weatherParse(res);
                  if (comparator(targetTemps,res.temp)){
                    dataPrint(res,curr);
                  } else {
                    lookups.splice(indexSearch,1);
                    indexSearch = getRNGesus(lookups);
                    curr = lookups[indexSearch];
                    $.getJSON("/api/getCondLatLon?lat=" + curr.lat + "&lon=" + curr.lon)
                    .then( //fourth
                      function (res){
                        res = weatherParse(res);
                        if (comparator(targetTemps,res.temp)){
                          dataPrint(res,curr);
                        } else {
                          lookups.splice(indexSearch,1);
                          indexSearch = getRNGesus(lookups);
                          curr = lookups[indexSearch];
                          $.getJSON("/api/getCondLatLon?lat=" + curr.lat + "&lon=" + curr.lon)
                          .then( //last
                            function (res) {
                              res = weatherParse(res);
                              if (comparator(targetTemps,res.temp)){
                                dataPrint(res,curr);
                              } else {
                                dataPrint(defaultWeathers,defaultWeathers);
                              }
                            }
                          );
                        }
                      }
                    )
                  }
                }
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

function dataPrint(data,location) {
  if (location.copOut){
    worseLocation(location,false);
  } else {
    worseLocation(location,true);
  }
  console.log(data);
}
