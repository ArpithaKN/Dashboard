var app = angular.module('myApp', []);
//var baseURL60 = "https://www.mytrintrin.com:13060/api/";
var baseURL60 = "http://43.251.80.79:13060/api/";
 app.controller('customersCtrl', function ($scope, $http) {
    $scope.submit = function (msg) {
         alert(msg);
         $scope.data = {
             msg:msg
         };
          $http({
        method: "POST",
        url: baseURL60 + "gateway/paygovresponse", //complete transaction
        data: $scope.data,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response2, status) {
        alert(response2);
    }, function (error) {  
             alert(error);
        })  ;
    };
});
