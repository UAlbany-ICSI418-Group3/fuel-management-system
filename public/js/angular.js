    var orderApp=angular.module('orderApp',[]);

    orderApp.controller('orderController',function($scope,$http){
        $http.get('/ordersData').success(function(response){
            $scope.myData = response;
        });
        $scope.removeName = function(row) {
            $scope.myData.splice($scope.myData.indexOf(row),1);
        }
    });