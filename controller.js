var Fuel = require('./models/fuelModel.js');
var bodyParser = require('body-parser');

module.exports = function(app){

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    //Get all fuels from DB
    app.get("/api/fuels", function(req, res){
        Fuel.find({}, function(err, allFuels){
            if(err){
                console.log(err);
            } else{
                res.send(allFuels);
            }
        });
    });

    //Create a new type of fuel
    app.post('/api/fuels',function(req,res){ 

        var newFuel= Fuel({
            //username:"test",
            type:    req.body.type,
            amount:  req.body.amount,
        });

        newFuel.save(function(err){
            if(err)throw err;
            res.send('New Fuel Type Created');
        });
    });


    //Get a specific type of fuel
    // app.get('/api/fuels/:id', function(req,res){
    // })

    //Update a specific type of fuel
    // app.get('/api/fuels/', function(req,res){
     }
