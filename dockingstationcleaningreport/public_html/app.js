var app = angular.module('myApp', []);
var completetransaction = [];
var baseURL60 = "https://www.mytrintrin.com:13060/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
var ipURL60 = "http://43.251.80.79:13060/api/";      //unlock,create a checkout and opentransaction and delete opentransaction      
var todayDate = new Date(); //current date
var idlist = [];
var junecleaningData = [],dockingStationInformation=[];
            var julycleaningData = [];
app.controller('customersCtrl', function ($scope, $http) {
     $http({
                method: "GET",
                url: baseURL60 + "dockstation", //station details
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response1, status) {
        $scope.dockingstationData = response1.data.data;
//        dockingStationInformation = $scope.dockingstationData;
            dockingStationInformation = _.sortBy($scope.dockingstationData, 'name');  
            $scope.dock = dockingStationInformation;
    });
    $scope.submit = function (from, to)
    {
        var completedata = {
            fromdate: from,
            todate: to,
            stationState:0,
            duration:0
        };
        $http({
            method: "POST",
            url: baseURL60 + "dockstation/cleanstation/info", //complete transaction
            data: completedata,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response3, status) {
            $scope.cleaningData = response3.data.data;
            $scope.cleaningData1 = [];
            for (var i = 0; i < $scope.cleaningData.length; i++)
            {
            junecleaningData.push($scope.cleaningData[i].stationId.name);
            }
//            fruits.sort();
            junecleaningData = $scope.cleaningData;
            $scope.cleaningData1 = junecleaningData;
            $scope.total = $scope.cleaningData.length;
        });
    };
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
    $scope.cler = function () {   
        var idlists = idlist;
        idlist = [];
        for (var i = 0; i < idlists.length; i++)
        {
            $http({
                method: 'DELETE',
                url: baseURL60 +  "dockstation/clean/"+ idlists[i], //In Local
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
  $scope.updatecleaningdata = function (data) {   
//      var ch = data;
//      da
//var details = {
//    empId:data.empId._id
//};    
//        var date = data.cleaneddate;
//        date = new Date(date);
//        var d = date.getDate(date);
//        var m = date.getMonth(date);
//        
//        var date1 = data.fromtime;
//        date1 = new Date(date1);
//        var d2 = date1.setDate(d);
//        d2 = date1.setMonth(m);
//        
//        var date2 = data.totime;
//        date2 = new Date(date2);
//        var d3 = date2.setDate(d);
//        d3 = date1.setMonth(m);
//        
//        data.cleaneddate = date;
//        data.fromtime = d2;
//        data.totime = d3;
        
        if (data.empId.Name === 'Murugesh') {
            data.empId = "595c6d73f205bf16af3bb2df";
        } else if (data.empId.Name === 'Mani') {
            data.empId = "595c6a7bf205bf16af3b6db0";
        } else {
            data.empId = "595c706ef205bf16af3c5050";
        }
   $http({
            method: "PUT",
            url: baseURL60 + "dockstation/clean/"+data._id, 
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response3, status) {
            $scope.cleaningData = response3.data.data;
            alert(response3.data.message);
            var index ;
             for(var i=0;i<junecleaningData.length;i++)
                if(data._id===junecleaningData[i]._id)
                    index = i;
                junecleaningData.splice(index, 1);
                $scope.julycount = $scope.june.length;
                $scope.june = junecleaningData;
            
        });
    };    
    $scope.deletecleaningdata = function (id) {   //delete the cleaning data in sdc
   $http({
            method: "DELETE",
            url: baseURL60 + "dockstation/clean/"+id,
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response3, status) {
            $scope.cleaningData = response3.data.data;
            alert(response3.data.message);
             var index ;
             for(var i=0;i<junecleaningData.length;i++)
                if(id===junecleaningData[i]._id)
                    index = i;
                junecleaningData.splice(index, 1);
                $scope.julycount = $scope.june.length;
                $scope.cleaningData1 = junecleaningData;
                 $scope.total = junecleaningData.length;
            
            
        });
    };    
});




















