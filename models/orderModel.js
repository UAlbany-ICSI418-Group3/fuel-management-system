var mongoose = require('mongoose');

var orderSchema = mongoose.Schema({

	Date: String,
	Address: String,
	City: String,
	State: String,
	ZIP: String,
	Type: String,

});

var Order = module.exports = mongoose.model("Order", orderSchema);

// get order
module.exports.getOrders = function(callback, limit){
	Order.find(callback).limit(limit);
}