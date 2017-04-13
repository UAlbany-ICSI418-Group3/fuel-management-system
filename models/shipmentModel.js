var mongoose = require('mongoose');

var shipmentSchema = new mongoose.Schema({

	Date : String,
	Type : String,
	Amount : Number,
	Price : Number,


});

//exporting the schema into a model
var Shipment = module.exports = mongoose.model("Shipment", shipmentSchema);

module.exports.getShipments = function(callback, limit){
	Shipment.find(callback).limit(limit);
}