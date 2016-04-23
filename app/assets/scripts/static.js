var defaultLoc = {zip: "60660", country: "us", state: "il", city: "chicago", fetched: false};
var defaultWeather = {id: 500, type: "Rain", desc: "light rain", temp: 13.28, tempMin: 13.28, tempMax: 13.28, humidity: 73, wind: 3.11, fetched: false};
var conditionsLookup = {cold: 1, neutral: 2, warm: 3};
var conditionsRLookup = ["","cold","neutral","warm"];
var colorSets = {
  cold: [
    ["FFF9BF","3cbda8","15b1a4","09AEA3"],
    ["09AEA3","129b9b","1E8694"],
    ["1E8694","50418a","642687"]
  ],
  neutral: [
    ["FFF9BF","FBBB30","FBB31E","FBB016"],
    ["FBB016","E0AC1A","B8A822","009344"],
    ["009344","642687"]
  ],
  warm: [
    ["FFF9BF","EA886E","E56E5B","E15549"],
    ["E15549","e34e45","e54540","EE2B31"],
    ["EE2B31","642687"]
  ]};
  
var months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

var locks = [
  Object.freeze(defaultLoc),
  Object.freeze(defaultWeather),
  Object.freeze(conditionsLookup),
  Object.freeze(conditionsRLookup),
  Object.freeze(colorSets),
  Object.freeze(months)
];
