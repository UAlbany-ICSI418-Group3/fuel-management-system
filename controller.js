var Fuel = require('./models/fuelModel.js');
var bodyParser = require('body-parser');

module.exports = function(app){

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/',function(req,res){
        res.render('home');
    })

    app.get("/login",function(req,res){
      res.render("login")
    })

    //Get a all fuel types
     app.get('/fuels', function(req,res){
       //Get all fuel from DB
     Fuel.find({}, function(err, allFuels){
       if(err){
           console.log(err);
       } else{
           res.render("index", {fuels:allFuels});
       }
    });
    });

    //Create a new type of fuel
    app.post('/fuels',function(req,res){

        var newFuel= Fuel({
            type:    req.body.type,
            amount:  req.body.amount,
        });

        newFuel.save(function(err){
            if(err)throw err;
            res.redirect("/fuels");
        });
    });

    //view new fuel page
    app.get("/fuels/new", function(req,res){
        res.render("new")
    })

    //Update a specific type of fuel
    // app.get('/api/fuels/:id', function(req,res){

    //Get a specific type of fuel

    //Get an employee

    //Create an employee

    //Get a customer

    //Create a customer
     }
