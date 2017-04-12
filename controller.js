var Fuel = require('./models/fuelModel.js');
var bodyParser = require('body-parser');
var Order = require("./models/orderModel.js");

module.exports = function(app){

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    // GET - Renders Homepage
    app.get('/',function(req,res){
        res.render('home');
    })

    app.get("/login",function(req,res){
      res.render("login")
    })

    app.get("/customer",function(req,res){
      res.render("customer")
    })

    app.get("/delivery",function(req,res){
      res.render("delivery")
    })
        app.get("/orders",function(req,res){
      res.render("orders")
    })

    // GET - Retreives all orders in DB
    app.get("/ordersData",function(req,res){
      Order.getOrders(function(err, orders){
        if(err){
            throw err;
          }
          res.json(orders);
      })
    });

    app.get("/inventorymang",function(req,res){
      res.render("inventorymang")
    })

      app.get("/inventory",function(req,res){
      res.render("inventory")
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

    //POST - Create new Fuel type
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

    // POST - Create New Order
    app.post('/customer',function(req,res){

        var newOrder= Order({
            Date : req.body.date,
            Address: req.body.address,
            City : req.body.city,
            State : req.body.state,
            ZIP : req.body.zip,
            Type : req.body.type,
            Status : "Active",
        });

        newOrder.save(function(err){
            if(err)throw err;
            res.redirect("/customer");
        });
    });


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
