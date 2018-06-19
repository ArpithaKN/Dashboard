var app = angular.module('myApp', []);
var completetransaction = [], opentransaction = [], memberDetails = [], dockingStationInformation = [], ports = [], vehicle1 = [], transationarray = [];
var ip, portsid, card1, phone1, userId, vehicleuid, stationname;
var baseURL60 = "https://www.mytrintrin.com:13060/api/";
var baseURL70 = "https://www.mytrintrin.com:13070/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
//var tempURL80 = "http://43.251.80.79:13080/api/";              //to unlock and create a checkouts record,transactions
var ipURL90 = "http://43.251.80.79:13090/api/";      //unlock,create a checkout and opentransaction and delete opentransaction      
var todayDate = new Date(); //current date
var _station_id;
var dockingStatus, memberStatus, vehicleStatus;          //to set a flag(if its true it allows to unlock and checkout create)
var ipstatus, unitstatus, portstatus, vehiclestatus, userstatus; //to set a flag(if its true it allows to unlock and checkout create)
app.controller('customersCtrl', function ($scope, $http) {
    $scope.details = {
                fromdate: '',
                todate: '',
                month: '',
                year: '',
                stationState: 0,
                duration: 0
            };
            $http({
                method: "GET",
                url: baseURL70 + "dockstation", //station details
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response1, status) {
        $scope.dockingstationData = response1.data.data;
        dockingStationInformation = $scope.dockingstationData;
      
    }),
   

    $scope.selecteddockingstation = function (data) {                   //Docking Station  names and Ip address
            _station_id = data._id;
    };
   
    
    
    
   
    
    $scope.newUnlock = function () {                                       //Unlock the ports and create the checkouts records 
            if(_station_id === '' || _station_id === null || _station_id === undefined)
            {
                $scope.detail={
                    fromdate:$scope.details.fromdate,
                    todate:$scope.details.todate,
                    stationState:0,
                    duration:0
                };
            }
            else
                {
                    $scope.detail={
                        fromdate: $scope.details.fromdate,
                        todate: $scope.details.todate,
                        stationState: 0,
                        duration: 0,
                        stationId: _station_id
                    };
                }
             $http({
            method: "POST",
            url: baseURL60 + "kpi/dockstation", //Take a particular member details
            data: $scope.detail,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.kpidata = response2.data.data;
           $scope.fullEmptyInfo = [];
            for (var i = 0; i < dockingStationInformation.length; i++)
            {
                $scope.detailes = {
                    DochingHub:dockingStationInformation[i].name,
                    full:0,
                    empty:0
                    
                };
                 for (var j = 0; j < $scope.kpidata.length; j++)
                   {
                       if($scope.kpidata[j].stationid.name ===dockingStationInformation[i].name){
                           if ($scope.kpidata[i].status === 1)
                              $scope.detailes.full++;
                          else
                             $scope.detailes.empty++;
                       }
                   }
                   $scope.fullEmptyInfo.push($scope.detailes);
            
            }
        });
    };
 
});


