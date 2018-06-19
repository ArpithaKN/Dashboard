var app = angular.module('myApp', []);
var baseURL = "https://www.mytrintrin.com:13060/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
var ipURL = "http://43.251.80.79:13080/api/";              //to unlock and create a checkouts record,transactions
var tempURL = "http://43.251.80.79:13090/api/";
var todayDates = new Date(); //current date
var todayDate = new Date(todayDates);
var todaydate = todayDate.getDate();
var todaymonth = todayDate.getMonth();
var todayyear = todayDate.getFullYear();
var percentage = [],swal,dockingstation = [];
app.controller('customersCtrl', function ($scope, $http) {
    
    $scope.bridgepercentages = [];
    $http({
            method: "GET",
            url: ipURL + "transactions/checkout/count",        //Summary of checkout counts
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.checkoutsData = response.data.data;
            $scope.totalcheckouts = $scope.checkoutsData.bridge + $scope.checkoutsData.techsupport;
            $scope.bridgepercentage = ($scope.checkoutsData.bridge/$scope.totalcheckouts)*100;
            $scope.techsupportpercentage = ($scope.checkoutsData.techsupport/$scope.totalcheckouts)*100;
            
        });
        
        var url = "transactions/checkout/all";
                $http({
                    method: "GET",
                    url: tempURL + url,                          // CheckOuts   in local
                    data: '',
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response4, status) {
                    $scope.controlopentransactionsData = response4.data.data;
                    $scope.controlOpentotalcount = $scope.controlopentransactionsData.length;
                    var hourlycheckouts = [];
                    for(var i=5;i<22;i++){
                        var hoursEntry = {
                            time:i+'-'+(i+1),
                            bridge:0,
                            techsupport:0,
                            total:0
                        };
                        hourlycheckouts.push(hoursEntry);
                    }
                    for(var i=0;i<$scope.controlopentransactionsData.length;i++)
                    {
                        var checkouttime = $scope.controlopentransactionsData[i].checkOutTime;
                        checkouttime = new Date(checkouttime);
                        var checkoutdate = checkouttime.getDate();
                        var checkoutmonth = checkouttime.getMonth();
                        var checkoutyear = checkouttime.getFullYear();
                        if((checkoutdate===todaydate)&&(checkoutmonth===todaymonth)&&(checkoutyear===todayyear))
                        {
                        var checkout = $scope.controlopentransactionsData[i].checkOutTime;
                        checkout = new Date(checkout);
                        var index = checkout.getHours();
                        index = index - 5;
                        if($scope.controlopentransactionsData[i].origin==="bridge")
                        {
                            hourlycheckouts[index].bridge++;
                            hourlycheckouts[index].total++;
                        }
                        else if($scope.controlopentransactionsData[i].origin==="techSupport")
                        {
                            hourlycheckouts[index].techsupport++;
                            hourlycheckouts[index].total++;
                        }
                    }
                    }
                    var hourlyPercentage = [];
                    for(var i=0;i<hourlycheckouts.length;i++){
//                        var bridgeper = (hourlycheckouts[i].bridge/hourlycheckouts[i].total)*100;
//                        var techsupportper = (hourlycheckouts[i].techsupport/hourlycheckouts[i].total)*100;
                        var hoursobject = {
                            time:hourlycheckouts[i].time,
                            bridge:(hourlycheckouts[i].bridge/hourlycheckouts[i].total)*100,
                            techsupport:(hourlycheckouts[i].techsupport/hourlycheckouts[i].total)*100
                        };
                        hourlyPercentage.push(hoursobject);
                    }
                    $scope.hoursdata = hourlyPercentage;
                });
         setInterval(checkoutcounts, 30000);//setInterval for 30 sec
    function checkoutcounts()  //calling function for setInterval
    {
         $http({
            method: "GET",
            url: ipURL + "transactions/checkout/count", 
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.checkoutsData = response.data.data;
            $scope.totalcheckouts = $scope.checkoutsData.bridge + $scope.checkoutsData.techsupport;
            $scope.bridgepercentage = ($scope.checkoutsData.bridge/$scope.totalcheckouts)*100;
            $scope.techsupportpercentage = ($scope.checkoutsData.techsupport/$scope.totalcheckouts)*100;
        });
    }
});