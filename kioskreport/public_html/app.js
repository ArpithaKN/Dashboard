var app = angular.module('myApp', []);
var completetransaction = [];
var baseURL70 = "https://www.mytrintrin.com:13070/api/";
var baseURL60 = "https://www.mytrintrin.com:13060/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
var ipURL60 = "http://43.251.80.79:13060/api/";      //unlock,create a checkout and opentransaction and delete opentransaction      
var todayDate = new Date(); //current date
var dockingstation = [];
app.controller('customersCtrl', function ($scope, $http) {
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
    $scope.submit = function (fromdateinput, todate)
    {
        var details = {
            fromdate: fromdateinput,
            todate: todate,
            duration:0
        };
        $http({
            method: "POST",
            url: baseURL60 + "kpi/kioskreport", //complete transaction
            data: details,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response3, status) {
            $scope.durationData = response3.data.data.kiosks;
             var transacionscount = [];
             $scope.report = [];
             var from = new Date(fromdateinput);
            var to = new Date(todate);
             var days = (to - from) / (1000 * 60 * 60 * 24);
//             for (var i = 0,k=0; i <= $scope.durationData.length; i++)
//             {
//                 if($scope.durationData[i].duration >= 4000)
//                 {
//                     alert("DockingHub:"+$scope.durationData[i].stationName+'\nduration:'+$scope.durationData[i].duration+'\ndate:'+$scope.durationData[i].InitiatedTime);
//                 }
//             }
             for (var i = 0,k=0; i <= days; i++)
             { 
                 var currentdate = from;
                 var currentdate1 = currentdate.setDate(currentdate.getDate() + k);
                 for(var j=0;j<dockingstation.length;j++){
                     
                     var details = {
                         date :currentdate1,
                         DockingHub:dockingstation[j].name,
                         Duration:'',
                         Total:''
                     };
                     transacionscount.push(details);
                 k = 1;
                 }
             }
            
             for(var i=0;i<transacionscount.length;i++)
             {
                 for(var j=0;j<$scope.durationData.length;j++)
                 {
                     if(transacionscount[i].DockingHub===$scope.durationData[j].stationName)
                     {
                     var durationdate = $scope.durationData[j].InitiatedTime;
                     durationdate = new Date(durationdate);
                     var d = durationdate.getDate();
                     var m = durationdate.getMonth();
                     
                     var recorddate = transacionscount[i].date;
                     recorddate = new Date(recorddate);
                     var d1 = recorddate.getDate();
                     var m1 = recorddate.getMonth();
                         if((d===d1) && (m===m1))
                         { 
                             if($scope.durationData[j].duration <= 4000)
                             {
                             transacionscount[i].Duration++;
                         }
                             transacionscount[i].Total++;
                         }
                     }
                     
                     
                 }
             }
             
              for (var i = 0,k=0; i < transacionscount.length; i++)
             {
                 var details = {
                     Date : transacionscount[i].date,
                     DockingHub:transacionscount[i].DockingHub,
                     per:(transacionscount[i].Duration /transacionscount[i].Total)*100
                 };
                 $scope.report.push(details);
             }
             $scope.kiosk = [];
              for (var i = 0; i < $scope.report.length; i++)
             {
             if(isNaN($scope.report[i].per)){
	$scope.report[i].per = 0;
 }else{
     $scope.kiosk.push($scope.report[i]);
 }
             }
//               {
////                var currentdate = from;
////                currentdate = addDays(new Date(currentdate), i);
////                   currentdate = currentdate.addDays(i);
//                var datestation = {
//                    date: '',
//                    name:'',
//                    duration:0,
//                    count:0
//                };
//                transacionscount.push(datestation);
//                transacionscount[i].duration = 840;
//                j = 1;
//            }
//            var map = {};
//            for (var i = 0; i < dockingstation.length; i++)
//            {
//                map[dockingstation[i].name] = [];
//            }
//            $scope.requireddata = []; //to find the object length
//            for (var i = 0; i < $scope.durationData.length; i++)
//            {
//                var details = {
//                    Date: $scope.durationData[i].starttime,
//                    DockingHub: $scope.durationData[i].stationid.name,
//                    Duration: $scope.durationData[i].timeduration
//                };
//                $scope.requireddata.push(details);
//            }
//            for (var i = 0; i < $scope.requireddata.length; i++)
//            {
//                if ($scope.requireddata[i].DockingHub in map)                  //if card in map[index] push record the same index
//                {
//                    var transactions = new Array();
//                    var transactions = map[$scope.requireddata[i].DockingHub];
//                    transactions.push($scope.requireddata[i]);
//
//                } else                                                                //otherwise create a new object
//                {
//                    var transactions = new Array();
//                    transactions.push($scope.requireddata[i]);
//
//                    map[$scope.requireddata[i].DockingHub] = transactions;
//                }
//            }
//            var from = new Date(fromdateinput);
//            var to = new Date(todate);
//             var transacionscount1 = [];
//            var days = (to - from) / (1000 * 60 * 60 * 24);
//           for (var key in map)
//            {
//                var data = [];
//                data = map[key];
//                var names = data[0].DockingHub;
//                var transacionscount = [];
//               for (var i = 0, j = 0; i <= days; i++)
//               {
////                var currentdate = from;
////                currentdate = addDays(new Date(currentdate), i);
////                   currentdate = currentdate.addDays(i);
//                var datestation = {
//                    date: '',
//                    name:'',
//                    duration:0,
//                    count:0
//                };
//                transacionscount.push(datestation);
//                transacionscount[i].duration = 840;
//                j = 1;
//            }
//            for (var i = 0; i < data.length; i++)
//               {
//                var registrationdate = data[i].Date;
//                registrationdate = new Date(registrationdate);
//                registrationdate.setHours(00, 00, 00);
//                var fromdate = new Date(fromdateinput);
//                var index1 = (registrationdate - fromdate) / (1000 * 60 * 60 * 24);
//                var index = ~~index1;
////                            if(data[i].Duration < 1000){
//                           transacionscount[index].duration = transacionscount[index].duration - data[i].Duration;
////                            }
//                           transacionscount[index].count++;
//                           transacionscount[index].date = data[i].Date;
//                           transacionscount[index].name = names;
//               }
//               for (var i = 0; i < days; i++)
//               {
//                    var datestation = {
//                    date: transacionscount[i].date,
//                    Name:transacionscount[i].name,
//                    cal:(transacionscount[i].duration / 840)*100
//                };
//                transacionscount1.push(datestation);
//               }
//            }
//               $scope.rep = transacionscount1;
//            alert($scope.rep.length);
        });
    };
});




















