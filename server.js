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
  //TODO: Pass in coords
  var req = "https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=" + process.env.GOOGLE_API;
  request.get(req, function(error, response, body){
    res.send(body);
  }); //TODO: error handling.nd
});

weatherSucks.get("/api/getCond", function(req, res) {
  process.env.WEATHER_API
  var req = "https://api.openweathermap.org/data/2.5/weather?"
  request.get(
    req, {
    zip: "4040,us",
    key: process.env.WEATHER_API
    } ,function(error, response, body){
      res.send(body);
  });
  //call weather API <- MOCK FOR NOW
});
/*
var $deferredNotesRequest = $.getJSON (
    "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
    { tags: img_tags,
      tagmode: "any",
      format: "json"
    });
*/

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
