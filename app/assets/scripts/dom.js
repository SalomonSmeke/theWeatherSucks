function setGradients(gradientColors, domElement){
  var cssPrefix = getCssValuePrefix();

  if (!gradientColors) return false;
  if (gradientColors.length<2) return false;

  var style = "";
  for (color in gradientColors){
    style = style + "#" + gradientColors[color] + ", ";
  }
  style = style.substring(0,style.length-2);
  domElement.style.backgroundImage = getCssValuePrefix() + 'repeating-linear-gradient(' + style + ')';
  return style;
}

function setPallete(typeStr){
  var colorSet;
  switch (typeStr) {
    case "cold":
      colorSet = colorSets.cold;
      break;
    case "neutral":
      colorSet = colorSets.neutral;
      break;
    case "warm":
      colorSet = colorSets.warm;
      break;
    default:
      console.error("unknown pallete code.")
      colorSet = colorSets.neutral;
  }
  for (color in colorSet){
    console.log(setGradients(colorSet[color], document.getElementById(('page_' + color))));
  }
}

function setLocation(loc){
  if (!loc) {
    loc = defaultLoc;
    console.error("Failed to set location on DOM due to null location");
  }
  var d = new Date();
  var date = d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
  var brk = "<br />";

  document.getElementById('location').innerHTML = date + brk + loc.city + ", " + loc.state + brk + loc.zip;
}

function setSmileys(weather, type){
  if (!weather || !type) {
    weather = defaultWeather;
    type = pickType(weather);
    console.error("Failed to set smileys on DOM due to null value");
  }
  var wind = windRating(weather.wind,type);
  var humidity = humidityRating(weather.humidity,type);

  document.getElementById('sMleys').innerHTML = ":" + wind + "<br />:" + humidity + "<br />";
}

function setGreeting(type){
  var greet;
  $.getJSON("/assets/docs/" + type + "Greetings.json").then(
  function(res){
    document.getElementById('message').innerHTML = res.values[Math.floor((Math.random() * res.values.length))];
  });
}

function setIcon(weather){
  var code = (weather.id || null) + "";
  if (code.length != 3) {
    console.error("invlaid code for set icon, using default.");
    code = defaultWeather.id;
  }
  $.getJSON("assets/docs/codeIconMappings.json").then(
    function (res){
      var iconName = idIconMap(code, res);
      var iconURL = 'assets/images/looseIcons/' + iconName + '.png';
      var iconHTML = '<img style="max-height: 150px; max-width:200px;" src="' + iconURL + '">';
      document.getElementById('iconSpot').innerHTML = iconHTML;
    }
  );
}

function placeTemperature(weatherIn){
  var w = weatherIn || defaultWeather;
  var min = w.tempMin || null;
  var max = w.tempMax || null;
  var curr = w.temp || null;

  if (min===null || max===null || curr===null || min>max){
    w = defaultWeather;
    min = w.tempMin;
    max = w.tempMax;
    curr = w.temp;
  }

  if (min==max){
    min--;
    max++;
  }
  //normalize to 0
  max-=min;
  curr-=min;
  min-=min;

  var placement = curr * document.getElementById("bar").width/max + document.getElementById("bar").offsetLeft;
  console.log("temp should be at: " + placement);
}
