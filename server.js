var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

// Set up port to be either the host's designated port, or 3000
var PORT = process.env.PORT || 3000;

// Instantiate Express App
var app = express();

// Set up an Express Router
var router = express.Router();

// Designate public folder as a static directory
app.use(express.static(__dirname + "/public"));

// Connect Handlebars to Express
app.engine("handlebars", expressHandlebars({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Use bodyParser to parse data
app.use(bodyParser.urlencoded({
  extended: false
}));

// Have every request go through the router middleware
app.use(router);

// If deployed, use the deployed database. Otherwise use the local news-scraper database
var db = process.env.MONGODB_URI || "mongodb://localhost/news-scraper";

// Connect mongoose to my database
mongoose.connect(db, function(error) {
  // Log any errors connecting with mongoose
  if (error) {
    console.log(error);
  }
  // Or log a success message
  else {
    console.log("mongoose connection is successful");
  }
});

// Listen on the port
app.listen(PORT, function() {
  console.log("The magic happers on port:" + PORT);
});


