var mongoose = require("mongoose")
//hello
var fuelSchema = new mongoose.Schema({
    type:    String,
    amount:  Number,
});

//exporting the schema into a model
module.exports = mongoose.model("Fuel", fuelSchema);
