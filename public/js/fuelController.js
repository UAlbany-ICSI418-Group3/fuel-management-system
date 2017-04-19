    var fuelApp=angular.module('FuelApp',[]);

    fuelApp.controller('fuelController',['$scope','$http',
    function($scope,$http){

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
