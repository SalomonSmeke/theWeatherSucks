if (!Math.round10) {
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }
  Math.round10 = function(value, exp) {
    return decimalAdjust('round', value, exp);
  };
}

function zipParse(res) {
  var state, city, zip;

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

  state = unwrapZipRequest(res, "administrative_area_level_1") || null;
  city = unwrapZipRequest(res, "locality") || null;
  zip = unwrapZipRequest(res, "postal_code") || null;

  if (city==null || state ==null || zip==null){
    console.error("Failed to find location at those coordinates, using default.");
    return(defaultLoc);
  }
  console.log("Successful location get: " + zip + " " + state + " " + city);
  return {zip: zip, country: "us", state: state, city: city, fetched: true};
}

function weatherParse(value){
  var id, type, desc, temp, tempMin, tempMax, humidity, wind;

  var flag = false;

  if (value.weather !== undefined) {
    if (value.weather[0].main !== undefined && value.weather[0].description !== undefined && value.weather[0].id !== undefined) {
      id = value.weather[0].id;
      type = value.weather[0].main;
      desc = value.weather[0].description;
    } else {
      flag = true;
    }
  } else {
    flag = true;
  }

  if (value.main !== undefined) {
    if (value.main.temp !== undefined && value.main.temp_min !== undefined && value.main.temp_max !== undefined && value.main.humidity !== undefined) {
      temp = value.main.temp;
      tempMin = value.main.temp_min;
      tempMax = value.main.temp_max;
    } else {
      flag = true;
    }
  } else {
    flag = true;
  }

  if (value.wind !== undefined) {
    if (value.wind.speed !== undefined) {
      wind = value.wind.speed;
    } else {
      flag = true;
    }
  } else {
    flag = true;
  }

  if (flag) {
    return false;
  } else {
    return {id: id, type: type, desc: desc, temp: Math.round10(temp-273.15), tempMin: Math.round10(tempMin-273.15), tempMax: Math.round10(tempMax-273.15), humidity: humidity, wind: wind, fetched: true};
  }
}

function condFetchSucc(value){
    console.log("Response from server received.");
    var val = weatherParse(value);
    if (val){
      console.log("Weather correctly fetched: " + JSON.stringify(val));
      return val
    } else {
      console.error("Weather fetch failed, using default: " + JSON.stringify(defaultWeather));
      return defaultWeather;
    }
}

function condFetchFail(reason){
  console.error("frick" + reason);
  return defaultWeather;
}

function pickType(weather){

}
