    var orderApp=angular.module('orderApp',[]);

    orderApp.controller('orderController',function($scope,$http){


      $http.get('/ordersData')
        .success(function(response){
          console.log("HEREEE")
          console.log(response);
            $scope.orderData = response;
        })
          .error(function(data,status){
          console.log('error!');
          console.log(data);
        });


        //not sure what this is doing - BG
        $scope.removeName = function(row) {
            $scope.myData.splice($scope.myData.indexOf(row),1);
        }
    });
