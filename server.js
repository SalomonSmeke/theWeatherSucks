var express = require("express"),
    http = require("http"),
    request = require("request"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    weatherSucks = express(),
    notesTotal = {};

//set as static file server...
weatherSucks.use(express.static(__dirname + "/app"));

//parse jQuery JSON to useful JS object
weatherSucks.use(bodyParser.urlencoded({ extended: false }));

//connect to 424db1 DB in MongoDB
//mongoose.connect('mongodb://localhost/424db1');

//define Mongoose schema for notes
// var NoteSchema = mongoose.Schema({
//   "created": Date,
//   "note": String
// });

//model note
//var Note = mongoose.model("Note", NoteSchema);

//create http server
http.createServer(weatherSucks).listen(process.env.PORT || 3030);

weatherSucks.get("/api/getLoc", function(req, res) {
  var lat = (req.query.lat || 42.02) + ""; //avoid exploits by casting to string
  var lon = (req.query.lon || -87.67) + "";
  console.log("LatLon Conversion requested for: " + lat + " " + lon);
  req = "https://maps.googleapis.com/maps/api/geocode/json?result_type=administrative_area_level_1|locality|postal_code&latlng=" + lat + "," + lon + "&key=" + process.env.GOOGLE_API;
  request.get(req, function(error, response, body){
    res.send(body);
  }); //TODO: error handling.nd
});

weatherSucks.get("/api/getCond", function(req, res) {
  var zip = (req.query.zip || "60660,us") + "";
  console.log("Weather requested at: " + zip);
  req = "http://api.openweathermap.org/data/2.5/weather?&zip=" + zip + "&appid=" + process.env.WEATHER_API;
  request.get(req, function(error, response, body){
    if (error) console.error(error);
    console.log(body);
    res.send(body);
  });
});

weatherSucks.get("/api/getCondLatLon", function(req, res) {
  var lat = (req.query.lat || "14") + "";
  var lon = (req.query.lon || "40") + "";
  console.log("Weather requested at: " + lat + "(lat)" + long + "(long)");
  req = "http://api.openweathermap.org/data/2.5/weather?&lat=" lat + "&lon=" + lon + "&appid=" + process.env.WEATHER_API;
  request.get(req, function(error, response, body){
    if (error) console.error(error);
    console.log(body);
    res.send(body);
  });
});

//json get route - update for mongo
// jsonApp.get("/notes.json", function(req, res) {
//   Note.find({}, function (error, notes) {
//    //add some error checking...
//    res.json(notes);
//   });
// });

// //json post route - update for mongo
// jsonApp.post("/notes", function(req, res) {
//   var newNote = new Note({
//     "created":req.body.created,
//     "note":req.body.note
//   });
//   newNote.save(function (error, result) {
//     if (error !== null) {
//       console.log(error);
//       res.send("error reported");
//     } else {
//       Note.find({}, function (error, result) {
//         res.json(result);
//       })
//     }
//   });
// });
