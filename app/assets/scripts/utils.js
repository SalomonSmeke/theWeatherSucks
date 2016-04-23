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

function getCssValuePrefix() {
    var rtrnVal = '';//default to standard syntax
    var prefixes = ['-o-', '-ms-', '-moz-', '-webkit-'];

    // Create a temporary DOM object for testing
    var dom = document.createElement('div');

    for (var i = 0; i < prefixes.length; i++)
    {
        // Attempt to set the style
        dom.style.background = prefixes[i] + 'linear-gradient(#000000, #ffffff)';

        // Detect if the style was successfully set
        if (dom.style.background)
        {
            rtrnVal = prefixes[i];
        }
    }

    dom = null;
    delete dom;

    return rtrnVal;
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
      humidity = value.main.humidity;
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
  var temp = weather.temp;
  if (temp <= 10){
    console.log("brr, it looks cold there.");
    return conditionsLookup.cold;
  }
  if (temp >= 28 || (temp >= 25 && weather.temp.humidity >= 80)) {
    console.log("dont get heatstroke!");
    return conditionsLookup.warm;
  }
  console.log("hey now... it looks fine down there");
  return conditionsLookup.neutral;
}

function idIconMap(weather){
  var code = (weather.id || null) + "";

  if (code.length != 3) return idIconMapFail(" icon code wrong length or null.");

  var match, iconPath;

  $.getJSON("/assets/docs/codeIconMappings.json").then(
  function(res){
    var prefix = code.charAt(0);
    switch (prefix) {
      case "2":
        match = res["2xx"];
        break;
      case "3":
        match = res["3xx"];
        break;
      case "5":
        match = res["5xx"];
        break;
      case "6":
        match = res["6xx"];
        break;
      case "7":
        match = res["7xx"];
        break;
      case "8":
        if (code == 800) {
          match = res["800"];
        } else {
          match = res["80x"];
        }
        break;
      case "9":
        if (code.charAt(1) == 0) {
          match = res["90x"];
        } else {
          match = res["9xx"];
        }
        break;
      default:
        return idIconMapFail(" no match for code.");
    }
    currentTime = new Date();
    hours = currentTime.getHours();

    if (hours < 7 || hours > 19)
      icon = match.nightIcon;
    else
      icon = match.dayIcon;

    console.log ("Id icon mapping success: " + icon);
    return icon;
  });
}

function idIconMapFail(error){
  console.error("Id icon map error " + error);
  return idIconMap(defaultWeather);
}

function windRating(wind,type){
  wind = Math.round(wind / 5);
  if (wind > 5) wind = 5;
  var char;
  switch (type){
    case 1:
      char = "(";
      break;
    case 2:
      char = "O";
      break;
    case 3:
      if (wind = 5) {
        char = "O";
      } else {
        char = ")";
      }
      break;
  }
  var out = "";
  for (var i = 0; i < wind; i++){
    out += char;
  }
  return out;
}

function humidityRating(humidity,type){
  humidity = Math.round(humidity / 20);
  if (humidity > 5) humidity = 5;
  if (humidity === 0) humidity = 1;
  var char;
  switch (type){
    case 1:
      if (humidity<3){
        char = "(";
      } else {
        char = ")";
      }
      break;
    case 2:
      if (humidity<2 || humidity>4){
        char = "(";
      } else {
        char = "|";
      }
      break;
    case 3:
      if (humidity<2 || humidity>3){
        char = "(";
      } else {
        char = ")";
      }
      break;
  }
  var out = "";
  for (var i = 0; i < humidity; i++){
    out += char;
  }
  return out;
}
