var Fuel = require('./models/fuelModel.js');
var bodyParser = require('body-parser');
var Order = require("./models/orderModel.js");
var Shipment = require("./models/shipmentModel.js")
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

    //unique middleware to use user data with each page
    app.use(function(req, res, next){
      res.locals.currentUser = req.user;
      next();
    });

    // GET - Renders Homepage
    app.get('/',function(req,res){
        res.render('home', {currentUser:req.user});
    })


    //===============Fuels==============

    //POST - Create new Fuel type
    app.post('/fuels',function(req,res){

      //if there is a body in the reqest, do an update
      if(req.body.id){
        Fuel.findByIdAndUpdate(req.body.id,{
          amount:  req.body.amount},
          function(err,fuels){
            if (err) throw err;
            res.send("Fuel updated!");
          });
      }

      //If there is no body, we create a new type of fuel
      //This probably wont actually be needed
      else{

        var newFuel= Fuel({
            type:    req.body.type,
            amount:  req.body.amount,
        });
        newFuel.save(function(err){
            if(err)throw err;
            res.redirect("/fuels");
        });
      }
    });


    //GET - Retreive all fuel types in DB
    app.get("/fuels",function(req,res){
      Fuel.getFuels(function(err, fuels){
        if(err){
            throw err;
          }
          res.json(fuels);
      })
    });

    //===============Orders==================
    // GET - Retrieves all orders in DB
    app.get("/orders",function(req,res){
      Order.find({}, function(err, allOrders){
        if(err){
          console.log(err);
        }else{
          res.send(allOrders)
      }
    })
    });

    // POST - Creates a new order. Same order model used for both the
    // customer and delivery peron.
    app.post('/orders',function(req,res){

        var newOrder= Order({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          date : req.body.date,
          address: req.body.address,
          city : req.body.city,
          state : req.body.state,
          zip : req.body.zip,
          status : req.body.status,
          amount: req.body.amount,
          type: req.body.type,
          price: req.body.price,
        });

        newOrder.save(function(err){
            if(err)throw err;
            res.send('order created!');
        });
    });



    //===============DELIVERY==============

    // GET - Renders Deliverymans homepage
    app.get("/delivery",function(req,res){
      res.render("delivery_landing")
    })

    // GET - Renders list delivery page
    app.get("/delivery/list",function(req,res){
          res.render("delivery_list")
      })

    // GET - Renders Delivery Order page
    app.get("/delivery/order",function(req,res){
      res.render("delivery_order")
    })


    //=============INVENTORY===============

    // GET - Renders Inventory page
      app.get("/inventory",function(req,res){
      res.render("inventory_landing")
    })

    // GET - Renders Orders page
    app.get("/inventory/order",function(req,res){
      res.render("inventory_order")
    })

    app.get("/inventory/list",function(req,res){
      res.render("inventory_list")
    })

    // POST - Puts shipment information in DB
    app.post('/inventory/order',function(req,res){

        var newShip= Shipment({
          Date : req.body.date,
          Type : req.body.type,
          Amount : req.body.amount,
          Price : req.body.price,
        });

        newShip.save(function(err){
            if(err)throw err;
            res.redirect("/");
        });
    });

    //===============CUSTOMER================
    // GET - Renders Customer page
    app.get("/customer",function(req,res){
      res.render("customer_landing")
    })

    app.get("/customer/order", function(req,res){
      res.render("customer_order")
    })

    // POST - Create new Customer order
    // **The customer order should NOT decrement the amount of fuel**
    // Should create a separate customer order model that can then
    // be used by the deliveryman
//     app.post('/customer', function(req,res){
//
//         var newOrder= Order({
//             date : req.body.date,
//             address: req.body.address,
//             city : req.body.city,
//             state : req.body.state,
//             zip : req.body.zip,
//             type : req.body.type,
//             status : "Active",
//         });
//         newOrder.save(function(err){
//             if(err)throw err;
//             res.redirect("/");
//         });
//     });
//
//     // PUT - Edit customer order
//     app.put('/customer/edit',function(req,res){
//       console.log(req.body._id)
//       console.log(req.body.date)
//       console.log(req.body.address)
//
//     if (req.body._id){
//         Order.findByIdAndUpdate(req.body._id, {
//           date : req.body.date,
//           address: req.body.address,
//           city : req.body.city,
//           state : req.body.state,
//           zip : req.body.zip},
//             function(err,order){
//             if (err) throw err;
//             res.send('customer order updated');
//         })
//     };
// });
//
//     //deletes an order
//     app.delete('/ordersData/:id', function(req, res) {
//     console.log(req.params.id);
//     Order.findByIdAndRemove(req.params.id, function(err) {
//         if (err) throw err;
//         res.send('Order Deleted');
//     })
// });


    //==========Authentication===========

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
          else if(req.body.type == "delivery"){
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

    // Redirects to a specific page!
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

    //Logout logic
    app.get("/logout", function(req, res){
      req.logout();
      res.redirect("/");
      console.log("logged Out!")
      })

      //Check if user is logged in to continue
    // function isLoggedIn(req, res, next){
    //   if (req.isAuthenticated()){
    //     return next();
    //   }
    //   res.redirect("/");
    // }
     }
