var Fuel = require('./models/fuelModel.js');
var bodyParser = require('body-parser');
var Order = require("./models/orderModel.js");
passport = require("passport"),
LocalStrategy = require("passport-local"),
User = require("./models/user"),

module.exports = function(app){

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    //Passport config
    app.use(require("express-session")({
      secret: "csi418",
      resave: false,
      saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    //unique middleware to put user on each page
    app.use(function(req, res, next){
      res.locals.currentUser = req.user;
      next();
    });

    // GET - Renders Homepage
    app.get('/',function(req,res){
        res.render('home', {currentUser:req.user});
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
    app.post('/customer', function(req,res){

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

    //======================
    //Auth Routes

    //show register form
    app.get("/register", function(req, res){
      res.render("register");
    })
    //Sign up logic
    app.post("/register", function(req,res){
      var newUser = new User({username: req.body.username, type: req.body.type});
      //stores a hash for pw
      User.register(newUser, req.body.password, function(err, user){
        if(err){
          console.log(err);
          return res.render("register")
        }
        console.log("registered!");

        passport.authenticate("local")(req,res,function(){
          if(req.body.type == "customer"){
            res.redirect("/customer");
          }
          else if(req.body.type == "inventory"){
            res.redirect("/inventory");
          }
          else if(req.body.type == "devliery"){
            res.redirect("/delivery");
          }
        });
      });
    });
    //show login form
    app.get("/login", function(req,res){
      res.render("login");
    })
    // handling login logic

    //  This is supposed to redirect to specific page!
    app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) {
        console.log("no user");
        return res.redirect('/login');
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        if (user.type === "customer"){
          return res.redirect("/customer");
        }
      });
        if (user.type === "inventory"){
          return res.redirect("/inventory");
        }
        if (user.type === "delivery"){
          return res.redirect("/delivery");
        }
    })(req, res, next);
  });

    //logic logout
    app.get("/logout", function(req, res){
      req.logout();
      res.redirect("/");
      console.log("logged Out!")
      })

    function isLoggedIn(req, res, next){
      if (req.isAuthenticated()){
        return next();
      }
      res.redirect("/");
    }

    //Update a specific type of fuel
    // app.get('/api/fuels/:id', function(req,res){

    //Get a specific type of fuel

    //Get an employee

    //Create an employee

    //Get a customer

    //Create a customer
     }
