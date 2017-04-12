var express = require('express');
var app = express();
var config = require("./config");
var mongoose = require("mongoose");
var controller = require('./controller');
var Fuel = require("./models/fuelModel");
var Orders = require("./models/orderModel");

app.set('port', (process.env.PORT || 3000));

app.set('view engine', 'ejs');

app.use('/public', express.static(__dirname + '/public'));

mongoose.connect(config.getDbConnectionString(),function(err){
    if(err){
        console.log("Error: " + err);
    } else{
        console.log("Database Connected!");
    }
});

controller(app);

//localhost:3000
app.listen(app.get('port'), function() {
  console.log('Your local server is running on port:', app.get('port'));
});
