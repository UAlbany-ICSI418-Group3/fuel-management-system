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

    // GET - Renders loging page
    app.get("/login",function(req,res){
      res.render("login")
    })

    // GET - Renders Customer page
    app.get("/customer",function(req,res){
      res.render("customer")
    })

    // GET - Renders Deliverymans page
    app.get("/delivery",function(req,res){
      res.render("delivery")
    })

    // GET - Renders Orders page
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

    // GET - Renders Inventory Manager page
    app.get("/inventorymang",function(req,res){
      res.render("inventorymang")
    })

    // GET - Renders Inventory page
      app.get("/inventory",function(req,res){
      res.render("inventory")
    })

    //GET - Retreive all fuel types in DB
    app.get("/fuelData",function(req,res){
      Fuel.getFuels(function(err, fuels){
        if(err){
            throw err;
          }
          res.json(fuels);
      })
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
