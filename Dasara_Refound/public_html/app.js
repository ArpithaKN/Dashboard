var app = angular.module('myApp', []);
var completetransaction = [];
//var baseURL = "https://www.mytrintrin.com:13060/api/";  
var baseURL = "http://43.251.80.79:13060/api/";   
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";   
//var tempURL = "http://43.251.80.79:13080/api/";              
var ipURL = "http://43.251.80.79:13090/api/";            
var todayDate = new Date(); //current date
var idlist = [];
app.controller('customersCtrl', function ($scope, $http) {
     
        $http({
            method: "GET",
            url: baseURL + "onlinerefund", //complete transaction
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response3, status) {
            $scope.refundData = response3.data.data;
            
        });
    $scope.selectedList = function (selected, id) {
        //idlist = [];
        var idx = idlist.indexOf(id);
        if (selected) {

            idlist.push(id);
        } else
        {
            idlist.splice(idx, 1);
        }
    };
});




















