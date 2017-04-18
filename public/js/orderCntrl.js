    var orderApp=angular.module('orderApp',[]);

    orderApp.controller('orderController',function($scope,$http){


      $http.get('/orders')
        .success(function(response){
          console.log("HEREEE")
          console.log(response);
            $scope.orderData = response;
        })
          .error(function(data,status){
          console.log('error!');
          console.log(data);
        });


        $scope.postOrderFromDelivery = function(){
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
  }


        //not sure what this is doing - BG
        $scope.removeName = function(row) {
            $scope.myData.splice($scope.myData.indexOf(row),1);
        }
    });
