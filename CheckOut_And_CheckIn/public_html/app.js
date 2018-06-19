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
var oldcycles = [];
var stationid, dockingstation = [];
var ipAddress;
var userdetails = [];            //all users data(members and Employees)  
var idlist = [];//to store the _id to delete the opencheckouts
var transaction = []; //its store the member open checkout
app.controller('customersCtrl', function ($scope, $http) {
         $scope.daywiseCollection={
            fromdate:'',
            todate:''
        };    
        $scope.sendDaywiseDetails = function ()
        {
         $http({
                        method: "POST",
                        url: ipURL80+"transactions/reqlog", // transaction
                        data: $scope.daywiseCollection,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(function (response3, status) {
                        $scope.usersData = response3.data.data;
                        $scope.checkOut = [];$scope.checkIn = [];
                        for(var i=0;i<$scope.usersData.length;i++){
                            if($scope.usersData[i].Namespace === "CO"){
                                var checkouttime = new Date($scope.usersData[i].Data.checkOutTime);
                                var hour = checkouttime.getHours();
                                if(hour >= 5 && hour < 10){
                                   $scope.checkOut.push($scope.usersData[i].Data); 
                                }
                            }else if($scope.usersData[i].Namespace === "CIN"){
                                var checkintime = new Date($scope.usersData[i].Data.checkInTime);
                                var hour = checkintime.getHours();
                                 if(hour >= 5 && hour < 10){
                                    $scope.checkIn.push($scope.usersData[i].Data);
                                }
                            }
                        }
                        $scope.checkOutCount = $scope.checkOut.length;
                        $scope.checkInCount = $scope.checkIn.length;

                    });
        };
        $scope.checkout = function (data)
        {
            alert(JSON.stringify(data));
             $http({
                        method: "POST",
                        url: ipURL80+"transactions/checkout/bridge", // transaction
                        data: data,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(function (response3, status) {
                        sweetAlert("Chekout created");
                    });
        };
        $scope.checkin = function (data)
        {
            alert(JSON.stringify(data));
             $http({
                        method: "POST",
                        url: ipURL80+"transactions/checkin/bridge", // transaction
                        data: data,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(function (response3, status) {
                        sweetAlert("Chekin created");
                    });
        };
});

