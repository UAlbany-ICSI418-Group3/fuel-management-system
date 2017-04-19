    var fuelApp=angular.module('FuelApp',[]);

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

        $scope.click = function(){
          console.log("click!")
        }

        //posts delivery order...
        //should make a record of transaction and reduce amount of total fuel
        $scope.postOrderFromDelivery = function(){

          if($scope.type == 'Oil'){
            $scope.fuelID = "58f6c93ff09dac76237d911f"
          }
          else if($scope.type == 'Propane'){
            $scope.fuelID = "58f556b2cee2624033ea93b2"
          }
          else if($scope.type == 'Gasoline'){
            $scope.fuelID = "58f556c7cee2624033ea93b3"
          }
          console.log("here!")
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

          $http.post('/fuels',
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

    //posts fuels
    $scope.postFuelFromDelivery = function(){
      console.log("here!")
      $http.post('/orders',
          {
            type: $scope.type,
            amount: $scope.amount,
            })
     .success(function (result) {
          $scope.msg="posted";
          console.log("posted!")
      })
      .error(function (data, status) {
          console.log(data);
      });
}




  }]);


        //not sure what this is doing - BG
    //     $scope.removeName = function(row) {
    //         $scope.myData.splice($scope.myData.indexOf(row),1);
    //     }
    // });
