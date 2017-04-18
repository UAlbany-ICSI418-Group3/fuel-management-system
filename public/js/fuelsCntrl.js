   var fuelApp=angular.module('fuelApp',[]);

    fuelApp.controller('fuelController',function($scope,$http){
        $http.get('/fuels').success(function(response){
            $scope.myData = response;
        });
    });
