const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
require('dotenv').config();


app.get("/", function(req, res) {

  res.sendFile(__dirname + "/index.html");

});

app.post("/", function(req, res) {

  const query = req.body.cityName;
  const apiKey = process.env.APIKEY;
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

  //http native module = Used to make get request to an external server using node.
  https.get(url, function(response) {

    console.log(response.statusCode);

    response.on("data", function(data) {

      const weatherData = JSON.parse(data); // Converting json format into javascript objects.


      const temperature = weatherData.main.temp; // for getting the temperature
      const description = weatherData.weather[0].description; // for getting weather description

      const icon = weatherData.weather[0].icon; // for getting the icon
      const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png" // image url for the specific icon.

      res.write("<p>The weather is currently <b>" + description + "</b></p>");
      res.write("<h1>The temperature in "+ query +" is " + temperature + " degree celsius.<h1>");

      res.write("<img src =" + imageUrl + ">");
    });

  });

});


app.listen(process.env.PORT || 3000, function() {
  console.log("Port started at 3000");
});
