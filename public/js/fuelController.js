    var fuelApp=angular.module('FuelApp',[]);

    //We'll try to just use this one angular controller for all of our client side javascript
    //We might need more if we run into scoping problems with the variables

    fuelApp.controller('fuelController',['$scope','$http', '$window',
    function($scope,$http,$window){


        //Probably wouldn't actually want these hardcoded, but is a quick hack
      $scope.checkFuelType = function(fuelType){
        var fuelID = 0
            if(fuelType == 'Oil'){
              fuelID = "58f6c93ff09dac76237d911f"
            }
            else if(fuelType == 'Propane'){
            fuelID = "58f6d297ada98b84e775bdcf"
            }
            else if(fuelType == 'Gasoline'){
            fuelID = "58f556c7cee2624033ea93b3"
            }
            return fuelID
      }


      //gets all orders
      $http.get('/delivery/orders')
        .success(function(response){
            $scope.orderData = response;
        })
          .error(function(data,status){
          console.log('error!');
          console.log(data);
        });


      //posts delivery order and updates fuel total
      $scope.postOrderFromDelivery = function(){

        $http.post('/delivery/orders',
            {
              firstName: $scope.firstName,
              lastName: $scope.lastName,
              dateTime: $scope.dateTime,
              city: $scope.city,
              state: $scope.state,
              zip: $scope.zip,
              address: $scope.address,
              amount: $scope.amount,
              type: $scope.type,
              price: $scope.price,
              status: "Delivered"
              })
        .success(function (result) {
            console.log("posted orders!")
        })
        .error(function (data, status) {
            console.log(data);
        });

        fuelId =  $scope.checkFuelType($scope.type)

        $http.post('/fuels/delivery',
            {
              id: fuelId,
              type: $scope.type,
              amount: $scope.amount,
              })
        .success(function (result) {
            console.log("updated fuels!")
        })
        .error(function (data, status) {
            console.log(data);
        });
    }


    //Posts an order from a customer. Doesn't update fuel total
    $scope.postOrderFromCustomer = function(){

      $http.post('/customer/orders',
          {
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            dateTime: $scope.dateTime,
            city: $scope.city,
            state: $scope.state,
            zip: $scope.zip,
            address: $scope.address,
            amount: $scope.amount,
            type: $scope.type,
            price: $scope.price,
            status: "Pending"
          })
          .success(function (res) {
        		$window.location.href = "/customer/success"
    }, function (res) {
        console.log("error" + res.type)
    });
    console.log("outside")
  }


    //updates the status of the order, and the fuel total
    $scope.updateStatus = function(orderId, type, amount){

      console.log("order id first" + orderId)
      $http.post('/delivery/orders',
          {
            id: orderId,
            status: "Delivered"
          })
          .success(function (res) {
              console.log("success updating to delivered")
          })
        .error(function (err, status) {
                console.log(err);
            });

          fuelId =  $scope.checkFuelType(type)

          console.log(fuelId)
      $http.post('/fuels/delivery',
              {
                id: fuelId,
                type: type,
                amount: amount,
                })
         .success(function (result) {
          console.log("success")
          $window.location.reload();

          })
          .error(function (data, status) {
              console.log(data);
          });
    }
    // Adds shipment to DB, and adds new fuel to inventory
     $scope.postOrderFromInvManager = function(){


          if($scope.type == 'Oil'){
            $scope.fuelID = "58f6c93ff09dac76237d911f"
          }
          else if($scope.type == 'Propane'){
            $scope.fuelID = "58f6d297ada98b84e775bdcf"
          }
          else if($scope.type == 'Gasoline'){
            $scope.fuelID = "58f556c7cee2624033ea93b3"
          }

          // Place new shipment in database
          $http.post('/inventory/order',
              {
                date: $scope.date,
                type: $scope.type,
                amount: $scope.amount,
                price: $scope.price
                })

         .success(function (result) {
              console.log("posted orders!")
          })
          .error(function (data, status) {
              console.log(data);
          });

          // Updates amount of fuels
          $http.post('/fuels/shipment',
              {
                id: $scope.fuelID,
                type: $scope.type,
                amount: $scope.amount,
                })
         .success(function (result) {
              console.log("updated fuels!")
          })
          .error(function (data, status) {
              console.log(data);
          });
    }


    $http.get('/fuels')
    .success(function(response){
      console.log("success")
        $scope.fuelData = response;
    })
    .error(function(data,status){
    console.log('error!');
    console.log(data);
  });


     $scope.QueryTwoDates = function(){
        $http.get('/fuelsolddata',
        {
          startDate = $scope.sDate,
          endDate = $scope.eDate,
        }
          .success(function (result) {
              console.log("updated fuels!")
          })
          .error(function (data, status) {
              console.log(data);
          });

     }
      
    $http.get('/fuelsolddata').success(function(response){
          $scope.fuelSoldData = response;
      });

    $http.get('/profitdata').success(function(response){
          $scope.profitData = response;
      });

    $http.get('/pendingorderdata').success(function(response){
          $scope.pendingOrderData = response;
      });


  }]);
