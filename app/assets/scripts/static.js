var defaultLoc = {zip: "60660", country: "us", state: "il", city: "chicago", fetched: false};
var defaultWeather = {id: 500, type: "Rain", desc: "light rain", temp: 13.28, tempMin: 13.28, tempMax: 13.28, humidity: 73, wind: 3.11, fetched: false};
var conditionsLookup = {cold: 1, neutral: 2, warm: 3};
var conditionsRLookup = ["","cold","neutral","warm"];

var locks = [Object.freeze(defaultLoc),Object.freeze(defaultWeather),Object.freeze(conditionsLookup),Object.freeze(conditionsRLookup)];
