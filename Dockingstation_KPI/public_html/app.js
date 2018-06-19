var app = angular.module('myApp', []);
var baseURL60 = "https://www.mytrintrin.com:13060/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
var ipURL80 = "http://43.251.80.79:13080/api/";              //to unlock and create a checkouts record,transactions
var ipURL60 = "http://43.251.80.79:13060/api/";
var todayDate = new Date(); //current date
var idlist = [];
app.controller('customersCtrl', function ($scope, $http) {
    $http({
        method: "GET",
        url: baseURL60 + "kpi/dockstation/all", //complete transaction
        data: '',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response3, status) {
        $scope.kpidata = response3.data.data;
        $scope.totalrecords = $scope.kpidata.length;
        var kpiData = [];
        for (var i = 0; i < $scope.kpidata.length; i++)
        {
            var statues;
            if ($scope.kpidata[i].status === 1)
                statues = 'Full';
            else
                statues = 'Empty';
            var starttime = new Date($scope.kpidata[i].starttime);
            var endtime = new Date($scope.kpidata[i].endtime);
            var kpidataEntry = {
                _id:$scope.kpidata[i]._id,
                stationtype: $scope.kpidata[i].stationtype,
                name: $scope.kpidata[i].stationid.name,
                stationid:$scope.kpidata[i].stationid._id,
                peekduration: $scope.kpidata[i].peekduration,
                timeduration: $scope.kpidata[i].timeduration,
                updateStatus: $scope.kpidata[i].updateStatus,
                endtime: endtime,
                starttime: starttime,
                status:$scope.kpidata[i].status,
                cyclenums:$scope.kpidata[i].cyclenums,
                RecordID:$scope.kpidata[i].RecordID,
                updatedcyclenums:$scope.kpidata[i].updatedcyclenums,
                status1: statues,
                offpeekduration: $scope.kpidata[i].offpeekduration
            };
            kpiData.push(kpidataEntry);
        }
        $scope.dockKPI = kpiData;
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
    $scope.deletekpirecord = function(id)
    {
         var idlists = idlist;
        idlist = [];
        for (var i = 0; i < idlists.length; i++)
        {
    $http({
            method: 'DELETE',
            url: baseURL60 + "kpi/dockstation/"+ idlists[i], //In Local
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
        $scope.kpidata = response.data.message;
        sweetAlert($scope.kpidata);
    });
        }
    };
    $scope.updatekpirecord = function(data)
    {
        var kpidataEntry = {
                _id:data._id,
                stationtype: data.stationtype,
                stationid:data.stationid,
                peekduration:data.peekduration,
                timeduration: data.timeduration,
                updateStatus: data.updateStatus,
                endtime: data.endtime,
                starttime:data.starttime,
                status:data.status,
                cyclenums:data.cyclenums,
                RecordID:data.RecordID,
                updatedcyclenums:data.updatedcyclenums,
                offpeekduration:data.offpeekduration
            };
            $http({
            method: 'PUT',
            url: baseURL60 + "kpi/dockstation/"+data._id, //In Local
            data:kpidataEntry,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
        $scope.kpidata = response.data.message;
        sweetAlert($scope.kpidata);
    });
    };
});