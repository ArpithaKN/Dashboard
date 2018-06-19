var app = angular.module('myApp', []);
var baseURL60 = "https://www.mytrintrin.com:13060/api/";   //opencheckouts,ports clear,clear aopen checkouts,dockingsatation,memberdetails,complete transaction,balance update,negative balance list
var ipURL80 = "http://43.251.80.79:13080/api/"; //ports checkin, UMclear,bridge clear
var ipURL60 = "http://43.251.80.79:13060/api/";
var ipURL90 = "http://43.251.80.79:13090/api/";      //to get a local opencheckouts
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
app.controller('customersCtrl', function ($scope, $http) {
    
    $http({
        method: "GET",
        url: baseURL60 + "registrationcenter", //dockstation to find the cyclecount in every station
        data: '',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response, status) {
        $scope.registrationcentersname = response.data.data;
    });
    $scope.cardassign = function (card,name)                                              //get member details in negative balance
    {
        var location = name.location;
        var data = {
            cardNum: card,
            location:location
        };
        $http({
            method: "PUT",
            url: ipURL60 + "users/change/ondemand", //to re-assign card
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.memberData = response2.data.message;
            swal($scope.memberData);
        });
    };
});

