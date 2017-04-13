   var fuelApp=angular.module('fuelApp',[]);

    fuelApp.controller('fuelController',function($scope,$http){
        $http.get('/fuelData').success(function(response){
            $scope.myData = response;
        });
    });
