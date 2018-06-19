var app = angular.module('myApp', []);
//var baseURL60 = "http://43.251.80.79:13060/api/";
var baseURL60 = "https://www.mytrintrin.com:13060/api/";   //opencheckouts,ports clear,clear aopen checkouts,dockingsatation,memberdetails,complete transaction,balance update,negative balance list
var ipURL80 = "http://43.251.80.79:13080/api/"; //ports checkin, UMclear,bridge clear
var ipURL60 = "http://43.251.80.79:13060/api/";
var ipURL90 = "http://43.251.80.79:13090/api/";      //to get a local opencheckouts
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
var stationid,dockingStation = [];
app.controller('customersCtrl', function ($scope, $http) {
    $scope.show_me = false;
    $http({
        method: "GET",
        url: baseURL60 + "dockstation", //To get the registration centers name
        data: '',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response, status) {
        $scope.registrationcentersname = response.data.data;
        dockingStation = $scope.registrationcentersname;
    });
    
    $scope.selecteddockingstation = function (data) {                   //Docking Station  names and Ip address
               stationid = data.StationID;
//               portids = [];
//               for(var i=0;i<stationid.length;i++){
//                   portids.push(stationid[i].dockingPortId.PortID);
//               }
            };
    $scope.stationselect = function ()                                              //To change the ondemand to members 
    {
         if($scope.station === 'all'){
            $scope.show_me = false;
        }else{
            $scope.show_me = true;
        }
    };
    $scope.transactionCret = function () //To change the ondemand to members 
    {
        $http({
        method: "DELETE",
        url: ipURL60+"transactions/clear/open/assoc", //to create transaction
        data: "data",
        headers: {
             "Content-Type": "application/json"
         }
        }).then(function (response2, status) {
            $scope.memberData = response2.data.message;
            swal($scope.memberData);
        },function (response) {
            sweetAlert(response.data.description+"\n"+response.data.message);
        });
    };
  
    $scope.restartapp = function (card,creditBalance,name)                                              //To change the ondemand to members 
    {
        var _application = document.getElementById("application").value;
        var SID = stationid;
        //swal($scope.station);
        var data = {
            SID: SID,
            name:_application
        };
        swal(JSON.stringify(data));
        if($scope.station === 'all'){
            $scope.show_me = false;
            for(var i=0;i<dockingStation.length;i++){
            var data = {
                SID: dockingStation[i].StationID,
                name:_application
            };  
        $http({
        method: "POST",
        url: ipURL80 + "transactions/restart", //to re-assign card
        data: data,
        headers: {
             "Content-Type": "application/json"
         }
        }).then(function (response2, status) {
            $scope.memberData = response2.data.message;
            swal($scope.memberData);
        },function (response) {
            sweetAlert(response.data.description+"\n"+response.data.message);
        });
            }
        }else{
            $scope.show_me = true;
            var data = {
            SID: SID,
            name:_application
        };
        $http({
        method: "POST",
        url: ipURL80 + "transactions/restart", //to re-assign card
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
        }).then(function (response2, status) {
            $scope.memberData = response2.data.message;
            swal($scope.memberData);
        },function (response) {
            sweetAlert(response.data.description+"\n"+response.data.message);
        });
        }

    };
  
});

