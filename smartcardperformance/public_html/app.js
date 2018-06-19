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
    $scope.submit = function (fromdateinput, todate)
    {
        var details = {
            fromdate: fromdateinput,
            todate: todate,
            month: '',
            year: '',
            stationState: 0,
            duration: 0
        };
        $http({
            method: "POST",
            url: baseURL60 + "kpi/cardreport", //complete transaction
            data: details,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response3, status) {
            $scope.cardreport = response3.data.data.checkouts;
            $scope.length = response3.data.data.checkouts.length;
            $scope.requireddata = [];
            for(var i=0;i<$scope.cardreport.length;i++)
            {
                var details = {
                    Date:$scope.cardreport[i].checkOutTime,
                    DockingHub:$scope.cardreport[i].fromPort.DockingStationName,
                    Duration:$scope.cardreport[i].duration
                };
                $scope.requireddata.push(details);
            }
            var len = $scope.requireddata.length;
            var map = {};
            var transacionscount1 = [];
            for (var i = 0; i < $scope.requireddata.length; i++)
            {
                if ($scope.requireddata[i].DockingHub in map)                  //if card in map[index] push record the same index
                {
                    var transactions = map[$scope.requireddata[i].DockingHub];
                    transactions.push($scope.requireddata[i]);

                } else                                                                //otherwise create a new object
                {
                    var transactions = new Array();
                    transactions.push($scope.requireddata[i]);

                    map[$scope.requireddata[i].DockingHub] = transactions;
                }
            }
           var len1 = Object.keys(map).length; //to find the object length
           var from = new Date(fromdateinput);
            var to = new Date(todate);
            var days = (to - from) / (1000 * 60 * 60 * 24);
            
           for (var key in map)
            {
                var data = [];
                data = map[key];
                var transacionscount = [];
               for (var i = 0, j = 0; i <= days; i++)
               {
                var datestation = {
                    date: '',
                    duration:0,
                    count:0
                };
                transacionscount.push(datestation);
                j = 1;
            }
            for (var i = 0; i < data.length; i++)
               {
                var registrationdate = data[i].Date;
                registrationdate = new Date(registrationdate);
                registrationdate.setHours(00, 00, 00);
                var fromdate = new Date(fromdateinput);
                var index1 = (registrationdate - fromdate) / (1000 * 60 * 60 * 24);
                var index = ~~index1;
                            if(data[i].Duration < 1000){
                           transacionscount[index].duration++;
                            }
                           transacionscount[index].count++;
                           transacionscount[index].date = data[i].Date;
               }
               for (var i = 0; i <= days; i++)
               {
                   if((transacionscount[i].duration !== 0) && (transacionscount[i].count !== 0))
                   {
//                       var x = ((Math.random() * 5.00) + 0.00);
                    var datestation = {
                    date: transacionscount[i].date,
                    Name:data[0].DockingHub,
                    duration1sec:transacionscount[i].duration,
                    total:transacionscount[i].count,
                    cal:(transacionscount[i].duration / transacionscount[i].count)*100
                };
                transacionscount1.push(datestation);
            }
               }
            }
               $scope.rep = transacionscount1;
        });
    };
});




















