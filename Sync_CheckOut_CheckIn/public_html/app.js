var app = angular.module('myApp', []);
var memberdetails = [];//it stor the memer information
var baseURL70 = "https://www.mytrintrin.com:13070/api/";
var baseURL60 = "https://www.mytrintrin.com:13060/api/";   //opencheckouts,ports clear,clear aopen checkouts,dockingsatation,memberdetails,complete transaction,balance update,negative balance list
var ipURL80 = "http://43.251.80.79:13080/api/"; //ports checkin, UMclear,bridge clear
var ipURL60 = "http://43.251.80.79:13070/api/";
var ipURL90 = "http://43.251.80.79:13090/api/";      //to get a local opencheckouts
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
var swal, statuses, valdity;
var todayDate = new Date();
todayDate = new Date(todayDate);
 var portids = [];
var stationid;
app.controller('customersCtrl', function ($scope, $http) {
         $scope.daywiseCollection={
            fromdate:'',
            todate:'',
            portids:''
        };    
        
        $http({
                method: "GET",
                url: baseURL70 + "dockstation", //station details
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response1, status) {
                $scope.dockingData = response1.data.data;
                dockingstation = $scope.dockingData;
            });
            
            
            $scope.selecteddockingstation = function (data) {                   //Docking Station  names and Ip address
               stationid = data.portIds;
               portids = [];
               for(var i=0;i<stationid.length;i++){
                   portids.push(stationid[i].dockingPortId.PortID);
               }
            };
            
       
        $scope.sendDaywiseDetails = function ()
        {
         $scope.daywiseCollection.portids = portids;
         $http({
            method: "POST",
            url: ipURL80+"transactions/all/checkouts", // transaction
            data: $scope.daywiseCollection,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response3, status) {
            $scope.checkOut = response3.data.data;
        });
        $http({
            method: "POST",
            url: ipURL80+"transactions/all/checkins", // transaction
            data: $scope.daywiseCollection,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response3, status) {
            $scope.checkIn = response3.data.data;
        });
    };
});

