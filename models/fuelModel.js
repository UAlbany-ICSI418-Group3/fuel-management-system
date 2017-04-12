var mongoose = require('mongoose');

var fuelSchema = new mongoose.Schema({
    type:    String,
    amount:  Number,
});

//exporting the schema into a model
var Fuel = module.exports = mongoose.model("Fuel", fuelSchema);

module.exports.getFuels = function(callback, limit){
	Fuel.find(callback).limit(limit);
}