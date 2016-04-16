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

  var req = "https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=" + process.env.GOOGLE_API;
  request.get(req, function(error, response, body){
    console.log(body);
    var old = {zip: "60660", country: "us", fetched: true};
    console.log(response);
    console.log({zip: "60660", country: "us", fetched: true});
    res.send( response );
  });

  //res.json({a: "test"});
  //call location API <- MOCK FOR NOW
});

weatherSucks.get("/api/getCond", function(req, res) {
  //call weather API <- MOCK FOR NOW
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
