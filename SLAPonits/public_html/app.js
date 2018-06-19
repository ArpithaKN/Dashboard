var app = angular.module('myApp', []);
var completetransaction = [];
var baseURL60 = "https://www.mytrintrin.com:13060/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
//var baseURL60 = "http://43.251.80.79:13060/api/";      //unlock,create a checkout and opentransaction and delete opentransaction      
var todayDate = new Date(); //current date
var idlist = [];
var junecleaningData = [];
            var julycleaningData = [];
app.controller('customersCtrl', function ($scope, $http) {
    var fleetAt6AmDataupdate =[];
    $scope.fleetAt6Am = function (fromdate, todate)
    {  
        $scope.details={
            fromdate:fromdate,
            todate:todate,
            stationState:0,
            duration:0
        };
        fleetAt6AmDataupdate = [];
         swal({
        title: 'Loading...',
        showCancelButton: false,
        showConfirmButton: false
    }).then(
         $http({
            method: "POST",
            url: baseURL60 + "kpi/hourlyreport", //hourlyreport
            data: $scope.details,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
           $scope.fleetAt6AmData = response.data.data;
           $scope.fleetAt6AmData1 = [];
           var cyclesWithMa;
           for(var i=0;i<$scope.fleetAt6AmData.length;i++){
//               cyclesWithMa = Math.floor(Math.random() * 10) + 1  ;
//            $scope.fleetAt6AmData[i].cyclesWithMa = cyclesWithMa;
//            $scope.fleetAt6AmData[i].cyclesWithHa = 464-($scope.fleetAt6AmData[i].cyclesInPort+$scope.fleetAt6AmData[i].cyclesWithMa + $scope.fleetAt6AmData[i].cyclesWithRv+$scope.fleetAt6AmData[i].cyclesWithMembers);
            $scope.fleetAt6AmData1.push($scope.fleetAt6AmData[i]);
            fleetAt6AmDataupdate = $scope.fleetAt6AmData1;
        }
             swal.close();
        }));
    };
    $scope.fleetAt6AmUpdate = function ()
    { 
        for(var i=0;i<fleetAt6AmDataupdate.length;i++){
                 $http({
            method: "PUT",
            url: baseURL60 + "kpi/hourlyreport/update/"+fleetAt6AmDataupdate[i]._id, //hourlyreport
            data: fleetAt6AmDataupdate[i],
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
           $scope.fleetAt6AmupdatedData = response.data.data;
             swal.close();
        });
            }
        
    };
    
    
    
    
    $scope.OccavenuSubmit = function (fromdateinput, todate)
    {
         swal("Loading....");
           var daywiseRegistration1 = {
                    fromdate:fromdateinput,
                    todate:todate,
                    location:'',
                    paymentThrough:'',//'CCAvenue',
                    transactionType :'Refund'//CCAvenu Payment Reverse'//Refund
                };
         $http({
            method: "POST",
            url: baseURL60 + "paymenttransaction/daywisecollection", //complete transaction
            data: daywiseRegistration1,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.CCAvenuData = response.data.data;
        });
       
    };
    $scope.OnlineSubmit = function (fromdateinput, todate)
    {
        $scope.kioskfailureData = [];
        var details = {
            fromdate: fromdateinput,
            todate: todate,
            stationState:0,
            duration:0
        };
         swal({
        title: 'Loading...',
        showCancelButton: false,
        showConfirmButton: false
    }).then(
         $http({
            method: "POST",
            url: baseURL60 + "kpi/paymentreport", //complete transaction
            data: details,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
           $scope.PaymentProcessing = response.data.data;
                $scope.Value = response.data.data.total;
                $scope.OnlinefailureData = [];
                for(var i=0;i<response.data.length;i++)
                {
                    $scope.PaymentProcessing.push(response.data[i]);
                }
                $scope.within24count = 0;$scope.morethan24count = 0;
                for(var i=0;i<$scope.PaymentProcessing.length;i++)
                {
                    if($scope.PaymentProcessing[i].duration <= 24){
                       $scope.within24count = $scope.within24count + 1; 
                    }
                    else{
                        $scope.morethan24count = $scope.morethan24count + 1;
                        $scope.OnlinefailureData.push($scope.PaymentProcessing[i]);
                    }
                }
             swal.close();
        }));
    };
    
    
    
    $scope.KioskSubmit = function (fromdateinput, todate)
    {
        $scope.kioskfailureData = [];
        var details = {
            fromdate: fromdateinput,
            todate: todate,
             stationState:0,
            duration:0
        };
         swal({
        title: 'Loading...',
        showCancelButton: false,
        showConfirmButton: false
    }).then(
         $http({
            method: "POST",
            url: baseURL60 + "kpi/kioskreport", //complete transaction
            data: details,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response3, status) {
            $scope.kioskReport = response3.data.data.kiosks;
            for(var i=0;i<$scope.kioskReport.length;i++)
            {
                if($scope.kioskReport[i].duration > 4000){
                    $scope.kioskfailureData.push($scope.kioskReport[i]);
                }
            }
            $scope.total = $scope.kioskReport.length;
             swal.close();
        }));
    };
    $scope.submit = function (fromdateinput, todate)
    {
        $scope.rep = [];
        $scope.rep1 = [];
        var details = {
            fromdate: fromdateinput,
            todate: todate,
            month: '',
            year: '',
            stationState: 0,
            duration: 0
        };
         swal({
        title: 'Loading...',
        showCancelButton: false,
        showConfirmButton: false
    }).then(
        $http({
            method: "POST",
            url: baseURL60 + "kpi/cardreport", //complete transaction
            data: details,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response3, status) {
            $scope.cardreport = response3.data.data.checkouts;
             $scope.failureData = [];
            for(var i=0;i<$scope.cardreport.length;i++)
            {
                if($scope.cardreport[i].duration > 1000){
                    $scope.failureData.push($scope.cardreport[i]);
                }
            }
//            $scope.length = response3.data.data.checkouts.length;
//            $scope.requireddata = [];
//            $scope.failureData = [];
//            for(var i=0;i<$scope.cardreport.length;i++)
//            {
//                if($scope.cardreport[i].duration > 1000){
//                    $scope.failureData.push($scope.cardreport[i]);
//                }
//            }
//            for(var i=0;i<$scope.cardreport.length;i++)
//            {
//                var details = {
//                    Date:$scope.cardreport[i].checkOutTime,
//                    DockingHub:$scope.cardreport[i].fromPort.DockingStationName,
//                    Duration:$scope.cardreport[i].duration
//                };
//                $scope.requireddata.push(details);
//            }
//            var len = $scope.requireddata.length;
//            var map = {};
//            var transacionscount1 = [];
//            for (var i = 0; i < $scope.requireddata.length; i++)
//            {
//                if ($scope.requireddata[i].DockingHub in map)                  //if card in map[index] push record the same index
//                {
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
//           var len1 = Object.keys(map).length; //to find the object length
//          var transacionscount = [];
//           for (var key in map)
//            {
//                var data = [];
//                data = map[key];
//                
//                $scope.datestation = {
//                    dockingHub:data[0].DockingHub,
//                    durationWithinSec:0,
//                    durationMoreThanSec:0,
//                    count:0
//                };
//               for (var i = 0; i < data.length; i++)
//               {
//                   if(data[i].Duration >= 1000){
//                       $scope.datestation.durationMoreThanSec++;
//                   }else{
//                       $scope.datestation.durationWithinSec++;
//                   }
//                   $scope.datestation.count++;
//               }
//                transacionscount.push($scope.datestation);
//                
//            }
//               for (var i = 0; i <transacionscount.length; i++)
//               {
//                    var datestation = {
//                    Name:transacionscount[i].dockingHub,
//                    duration1sec:transacionscount[i].durationWithinSec,
//                    durationmoreThansec:transacionscount[i].durationMoreThanSec,
//                    total:transacionscount[i].count,
//                    cal:(transacionscount[i].durationMoreThanSec / transacionscount[i].count)*100
//                };
//                transacionscount1.push(datestation);
//            }
//               $scope.rep = transacionscount1;
//               for (var i = 0; i < $scope.rep.length; i++)
//               {
//                   if($scope.rep[i].total !== $scope.rep[i].duration1sec){
//                       $scope.rep1.push($scope.rep[i]);
//                   }
//               }
              swal.close();

        }));
    };
     $scope.update = function (data)
    {
        var data = data;
         $http({
            method: "PUT",
            url: baseURL60 + "kpi/cardreport/correction", //complete transaction
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response3, status) {
            $scope.cardreport = response3.data.message;
            alert($scope.cardreport);
        });
    };
    
});




















