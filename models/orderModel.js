var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({

	firstName: String,
	lastName: String,
	dateTime: String,
	address: String,
	city: String,
	state: String,
	zip: String,
	status: String,
	amount: Number,
	type: String,
	price: Number

});

var Order = module.exports = mongoose.model("Order", orderSchema);

// get order
// module.exports.getOrders = function(callback, limit){
// 	Order.find(callback).limit(limit);
// }
