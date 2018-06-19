var app = angular.module('myApp', []);
var completetransaction = [];
var baseURL60 = "https://www.mytrintrin.com:13060/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
var ipURL60 = "http://43.251.80.79:13060/api/";      //unlock,create a checkout and opentransaction and delete opentransaction      
var todayDate = new Date(); //current date
var idlist = [];
var junecleaningData = [];
            var julycleaningData = [];
app.controller('customersCtrl', function ($scope, $http) {
    $scope.submit = function (from, to)
    {
        var details={
                    fromdate:from,
                    todate:to,
                    stationState:0,
                    duration:0
                };
        $http({
            method: "POST",
            url: baseURL60 + "kpi/dockstation", //complete transaction
            data: details,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response3, status) {
            $scope.cleaningData = response3.data.data;
            var array = [];
            for(var k=0;k<$scope.cleaningData.length;k++)
            {
                if($scope.cleaningData[k].stationtype === "Major"){
                    if($scope.cleaningData[k].peekduration > 0)
                            {
                var details = {
                    Date:$scope.cleaningData[k].starttime,
                    DockingHub:$scope.cleaningData[k].stationid.name,
                    Duration:$scope.cleaningData[k].peekduration,
                    type:$scope.cleaningData[k].stationtype
                };
                array.push(details);
            }
        }
        }
       
            array = _.sortBy(array, 'DockingHub'); 
             $scope.data = array;
            $scope.report = [];
//            var len = array.length;
            var j,k=0;
            var morning =0,evening = 0;
            var time = array[0].Date;
                time = new Date(time);
                var hour = time.getHours(time);
                if(hour < 16)
                {
                    morning = array[0].Duration;
                }else
                {
                    evening = array[0].Duration;
                }
            var data = {
                        date:array[0].Date,
                        DockingHub:array[0].DockingHub,
                        morningpeek:morning,
                        eveningpeek:evening
                    };
                    $scope.report.push(data);
                    j = 0;
            for(var i=0;i<array.length;i++)
            {
                var time1 = array[i].Date;
                time1 = new Date(time1);
                var hour1 = time1.getHours(time1);
                var date1 = time1.getDate(time1);
                var month1 = time1.getMonth(time1);
                var year1 = time1.getFullYear(time1);
                var time2 = array[i+1].Date;
                time2 = new Date(time2);
                var date2 = time2.getDate(time2);
                var hour1 = time2.getHours(time2);
                var month2 = time2.getMonth(time2);
                var year2 = time2.getFullYear(time2);
                morning = 0;evening = 0;
                if(hour1 < 16)
                {
                    morning = array[i+1].Duration;
                }else
                {
                    evening = array[i+1].Duration;
                }
//                if(i===0)
//                     {
//                }
                if(array[i].DockingHub === array[i+1].DockingHub)
                {
                    if((date1===date2)&&(month1===month2)&&(year1===year2))
                    {
//                        if(hour1 < 16)
//                {
//                    $scope.report[j].morningpeek += array[i+1].Duration;
//                }else
//                {
//                   $scope.report[j].eveningpeek += array[i+1].Duration;
//                }
                        $scope.report[j].morningpeek += morning;
                        $scope.report[j].eveningpeek += evening;
                    }else{
                        var data = {
                        date:array[i+1].Date,
                        DockingHub:array[i+1].DockingHub,
                         morningpeek:morning,
                        eveningpeek:evening
                    };
                    $scope.report.push(data);
                    j = $scope.report.length-1;
                    }
                }else{
                    var data = {
                        date:array[i+1].Date,
                        DockingHub:array[i+1].DockingHub,
                         morningpeek:morning,
                        eveningpeek:evening
                    };
                    $scope.report.push(data);
                    j = $scope.report.length-1;
                }
            }
            
        });
    };
    
   
});




















