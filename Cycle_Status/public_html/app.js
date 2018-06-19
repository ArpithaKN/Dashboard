var app = angular.module('myApp', []);

app.controller('customersCtrl', function ($scope, $http) {
    var data = [];
    var baseURL = "https://www.mytrintrin.com:13060/api/";
    $http({
        method: "GET",
        url: baseURL + "vehicle",
        data: '',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response, status) {
        $scope.vehicle = response.data.data;
        
    });
   // var myvar1 = setInterval(getdata, 15000);//setInterval for 15 sec
    function getdata()  //calling function for setInterval
    {
        $http({
        method: "GET",
        url: baseURL + "vehicle",
        data: '',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response, status) {
        $scope.vehicle = response.data.data;
    });
    }
});
    