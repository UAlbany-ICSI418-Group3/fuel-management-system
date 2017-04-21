    var fuelApp=angular.module('FuelApp',[]);

    //We'll try to just use this one angular controller for all of our client side javascript
    //We might need more if we run into scoping problems with the variables
    
    fuelApp.controller('fuelController',['$scope','$http',
    function($scope,$http){

      //gets orders
      $http.get('/orders')
        .success(function(response){
            $scope.orderData = response;
        })
          .error(function(data,status){
          console.log('error!');
          console.log(data);
        });

        //posts delivery order...
        //creates a record of the transaction and substracts amount of total fuel (done on the server)
        $scope.postOrderFromDelivery = function(){

          //Probably wouldn't actually want these hardcoded, but is a quick hack
          if($scope.type == 'Oil'){
            $scope.fuelID = "58f6c93ff09dac76237d911f"
          }
          else if($scope.type == 'Propane'){
            $scope.fuelID = "58f6d297ada98b84e775bdcf"
          }
          else if($scope.type == 'Gasoline'){
            $scope.fuelID = "58f556c7cee2624033ea93b3"
          }

          $http.post('/orders',
              {
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                date: $scope.date,
                time: $scope.time,
                city: $scope.city,
                state: $scope.state,
                zip: $scope.zip,
                address: $scope.address,
                amount: $scope.amount,
                type: $scope.type,
                price: $scope.price,
                })
         .success(function (result) {
              console.log("posted orders!")
          })
          .error(function (data, status) {
              console.log(data);
          });

          $http.post('/fuelsDelivery',
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

    //gets fuels
    $http.get('/fuels')
    .success(function(response){
      console.log("success")
        $scope.fuelData = response;
    })
    .error(function(data,status){
    console.log('error!');
    console.log(data);
  });


    //posts fuels - probably can remove, we shouldn't need to post new fuels
//     $scope.postFuelFromDelivery = function(){
//       console.log("here!")
//       $http.post('/orders',
//           {
//             type: $scope.type,
//             amount: $scope.amount,
//             })
//      .success(function (result) {
//           $scope.msg="posted";
//           console.log("posted!")
//       })
//       .error(function (data, status) {
//           console.log(data);
//       });
// }
  }]);
