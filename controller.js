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
        res.render('login', {currentUser:req.user});
    })


    /* ============================ Fuels ============================== */

    /* POST - Decrements inventory fuel level from a delivery */
    app.post('/fuels/delivery',function(req,res){

      if(req.body.id){

        Fuel.findById(req.body.id, function (err, fuel) {
          if (err) throw err;

          fuelAmount = fuel.amount - req.body.amount

        Fuel.findByIdAndUpdate(req.body.id,{
          amount:  fuelAmount},
          function(err,fuel){
            if (err) throw err;
            res.send(fuel);
          });

         } )
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

    /* =========================== Delivery =========================== */

    /* GET - Renders Deliverymans homepage */
    app.get("/delivery",function(req,res){
      res.render("delivery_landing")
    })

    /* GET - Renders list delivery page */
    app.get("/delivery/list",function(req,res){
          res.render("delivery_list")
      })

    /* GET - Renders Delivery Order page */
    app.get("/delivery/order",function(req,res){
      res.render("delivery_order")
    })


    // GET - Renders Delivery Order Success page
    app.get("/delivery/success",function(req,res){
      res.render("delivery_order_success")
    })

    /* GET- Displays all orders from database */
    app.get("/delivery/orders",function(req,res){
      Order.find({}, function(err, allOrders){
        if(err){
          console.log(err);
        }else{
          res.send(allOrders)
      }
    })
    });

    /*POST - Creates a new order. (Same order model used for both the
             customer and delivery peron) */
    app.post('/delivery/orders',function(req,res){

        var newOrder= Order({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          dateTime : req.body.dateTime,
          address: req.body.address,
          city : req.body.city,
          state : req.body.state,
          zip : req.body.zip,
          status : req.body.status,
          amount: req.body.amount,
          type: req.body.type,
          price: req.body.price,
        });
        console.log(req.body.firstName)

          if (req.body.id){
            console.log("found order id" + req.body.id)
            Order.findByIdAndUpdate(req.body.id, {
              amount: req.body.amount,
              price: req.body.price,
              status: req.body.status,},
                function(err,order){
                if (err) throw err;
                res.send("order updated")
                console.log('order Updated');
            })
        }
        else{
          console.log("inside else")
            newOrder.save(function(err){
            if(err)throw err;

        });
        }
    });

    /* =========================== Inventory ============================ */

    /* GET - Renders Inventory page */
      app.get("/inventory",function(req,res){
      res.render("inventory_landing")
    })

    /* GET - Renders Orders page */
    app.get("/inventory/order",function(req,res){
      res.render("inventory_order")
    })

    /* GET - Renders inventory list page */
    app.get("/inventory/list",function(req,res){
      res.render("inventory_list")
    })

    app.get("/inventory/success",function(req,res){
      res.render("inventory_order_success")
    })

    /* POST - Puts new shipment in database */
    app.post("/inventory/order",function(req,res){

        var newShip= Shipment({
          date : req.body.date,
          type : req.body.type,
          amount : req.body.amount,
          price : req.body.price,
        });

        newShip.save(function(err){
            if(err)throw err;
            res.redirect("/");
        });
    });

    /* POST - Adds new fuel from shipment to current fuel inventory */
    app.post("/fuels/shipment",function(req,res){

      if(req.body.id){
        Fuel.findById(req.body.id, function (err, fuel) {
          if (err) throw err;

          fuelAmount = fuel.amount + req.body.amount

        Fuel.findByIdAndUpdate(req.body.id,{
          amount:  fuelAmount},
          function(err,fuel){
            if (err) throw err;
            res.send(fuel);
          });

         } )
      }
    });

    /* =========================== Customer ============================ */

    /* GET - Renders Customer page */
    app.get("/customer",function(req,res){
      res.render("customer_landing")
    })

    /* GET - Renders customer orders page */
    app.get("/customer/order", function(req,res){
      res.render("customer_order")
    })

    app.get("/customer/success", function(req,res){
      res.render("customer_order_success")
    })

    // POST - Create new Customer order
    // **The customer order should NOT decrement the amount of fuel**
    app.post('/customer/orders',function(req,res){

        var newOrder= Order({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          dateTime : req.body.dateTime,
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
          res.send("customer order created!")
        });
    });

/* =========================== Owner ============================ */

  /* Renders Owners home page */
  app.get("/owner/", function(req,res){
    res.render("owner_landing");
  })

  /* Query to print out all pending orders */
  app.get("/pendingorderdata", function(req,res){

    Order.find({status:"Pending"}, function(err,docs){
      res.json(docs);

    });
  });


  /* Query to print out total fuels sold during a period of time */

  app.get("/fuelsolddata", function(req,res){

    var start = req.query.start
    var end = req.query.end

    Order.aggregate([
          { $match: { dateTime: { $gt: start, $lt: end }}},
          { $group:
              { _id: '$type', total_products: { $sum: "$amount" } }
          }],
          function (err, docs) {
          if (err)
            return handleError(err);

          res.json(docs)
          }
    );
  });

  /* Query to print out the profit for the sales of each fuel during a */
  /* specified time                                                    */
  app.get("/profitdata", function(req,res){

    var start = req.query.start
    var end = req.query.end

    Order.aggregate([
          { $match: { dateTime: { $gt: start, $lt: end }}},
          { $group:
              { _id: '$type', profit_per_fuel: { $sum: "$price" } }
          }],
          function (err, docs) {
          if (err)
            return handleError(err);

          res.json(docs);
          }
    );
  });

  app.get("/owner/report", function(req,res){
      res.render("owner_report");
  })

  app.get("/owner/pendingorders", function(req,res){
      res.render("owner_orderspending");
  })

  app.get("/owner/inventorylist", function(req,res){
      res.render("owner_inventory");
  })
  app.get("/owner/orderlist", function(req,res){
      res.render("owner_orderlist");
  })

/* =========================== Authentication ============================ */

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
          else if(req.body.type == "owner"){
            res.redirect("/owner");
          }
        });
      });
    });
	
	//about page
	app.get("/about",function(req,res){
			res.render("about");
	})
	
	//contact page
	app.get("/contact",function(req,res){
				res.render("contact");
	})
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
        if (user.type === "owner"){
          return res.redirect("/owner")
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
