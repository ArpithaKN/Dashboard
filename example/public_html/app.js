var app = angular.module('myApp', []);
var completetransaction = [];
var baseURL = "https://www.mytrintrin.com:13060/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
//var tempURL = "http://43.251.80.79:13080/api/";              //to unlock and create a checkouts record,transactions
var ipURL = "http://43.251.80.79:13090/api/";      //unlock,create a checkout and opentransaction and delete opentransaction      
var ipURL = "http://43.251.80.79:13060/api/";
var todayDate = new Date(); //current date
var idlist = [],data1;
app.controller('customersCtrl', function ($scope, $http) {
   
    $scope.getdata = function (from, to)
    {
        var date = new Date();
        var month = from.getMonth();
        var day = from.getDate();
        date.setDate(day);
        date.setMonth(month+1);
         $scope.dailyUpdateData = {
      dateTime:date,  
      cashRegistration350Count:0,
      cashRegistration350Amount:0,
      cashRegistration50Count:0,
      cashRegistration50Amount:0,
      moneRegistrationCount:0,
      moneRegistrationAmount:0,
      posRegistrationCount:0,
      posRegistrationAmount:0,
      onlineRegistration350Count:0,
      onlineRegistration350Amount:0,
      onlineRegistration150Count:0,
      onlineRegistration150Amount:0,
      cashT20Count:0,
      cashT20Amount:0,
      cashT50Count:0,
      cashT50Amount:0,
      moneT20Count:0,
      moneT20Amount:0,
      moneT50Count:0,
      moneT50Amount:0,
      posT20Count:0,
      posT20Amount:0,
      posT50Count:0,
      posT50Amount:0,
      onlineT50Count:0,
      onlineT50Amount:0,
      onlineT20Count:0,
      onlineT20Amount:0,
      refundsCount:0,
      refundsAmount:0,
      rides:0,
      usageCost:0
    };
        
        swal("Loading....");
        var daywiseMone = {
                    fromdate:from,
                    todate:to,
                    location:'',
                    paymentThrough:'mone-cash',
                    transactionType :''
                };
                $http({
            method: "POST",
            url: baseURL + "paymenttransaction/daywisecollection", //complete transaction
            data: daywiseMone,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.daywiseMone = response.data.data;
            $scope.totalRegistration = 0;
            for(var i=0;i<$scope.daywiseMone.length;i++){
                if($scope.daywiseMone[i].credit === 50){
                    $scope.dailyUpdateData.moneT50Count++;
                    $scope.dailyUpdateData.moneT50Amount = $scope.dailyUpdateData.moneT50Amount + $scope.daywiseMone[i].credit;
                }else if($scope.daywiseMone[i].credit === 20){
                     $scope.dailyUpdateData.moneT20Count++;
                    $scope.dailyUpdateData.moneT20Amount = $scope.dailyUpdateData.moneT20Amount + $scope.daywiseMone[i].credit;
                }else{
                     $scope.dailyUpdateData.moneRegistrationCount++;
                     $scope.dailyUpdateData.moneRegistrationAmount = $scope.dailyUpdateData.moneRegistrationAmount + $scope.daywiseMone[i].credit;
                }
            }
//            $scope.totalRegistration = $scope.daywiseRegistrationData.length;
        });
        var daywisePOS = {
                    fromdate:from,
                    todate:to,
                    location:'',
                    paymentThrough:'POS',
                    transactionType :''
                };
                $http({
            method: "POST",
            url: baseURL + "paymenttransaction/daywisecollection", //complete transaction
            data: daywisePOS,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.daywisePOS = response.data.data;
            $scope.totalRegistration = 0;
            for(var i=0;i<$scope.daywisePOS.length;i++){
                if($scope.daywisePOS[i].credit === 50){
                    $scope.dailyUpdateData.posT50Count++;
                    $scope.dailyUpdateData.posT50Amount = $scope.dailyUpdateData.posT50Amount + $scope.daywisePOS[i].credit;
                }else if($scope.daywisePOS[i].credit === 20){
                     $scope.dailyUpdateData.posT20Count++;
                    $scope.dailyUpdateData.posT20Amount = $scope.dailyUpdateData.posT20Amount + $scope.daywisePOS[i].credit;
                }else{
                     $scope.dailyUpdateData.posRegistrationCount++;
                     $scope.dailyUpdateData.posRegistrationAmount = $scope.dailyUpdateData.posRegistrationAmount + $scope.daywisePOS[i].credit;
                }
            }
//            $scope.totalRegistration = $scope.daywiseRegistrationData.length;
        });
        var daywisePayGov = {
                    fromdate:from,
                    todate:to,
                    location:'',
                    paymentThrough:'PayGov',
                    transactionType :''
                };
         $http({
            method: "POST",
            url: baseURL + "paymenttransaction/daywisecollection", //complete transaction
            data: daywisePayGov,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.daywisePayGov = response.data.data;
            $scope.totalRegistration = 0;
            for(var i=0;i<$scope.daywisePayGov.length;i++){
                if($scope.daywisePayGov[i].credit === 50){
                    $scope.dailyUpdateData.onlineT50Count++;
                    $scope.dailyUpdateData.onlineT50Amount = $scope.dailyUpdateData.onlineT50Amount + $scope.daywisePayGov[i].credit;
                }else if($scope.daywisePayGov[i].credit === 20){
                     $scope.dailyUpdateData.onlineT20Count++;
                    $scope.dailyUpdateData.onlineT20Amount = $scope.dailyUpdateData.onlineT20Amount + $scope.daywisePayGov[i].credit;
                }else  if($scope.daywisePayGov[i].credit === 150){
                     $scope.dailyUpdateData.onlineRegistration150Count++;
                     $scope.dailyUpdateData.onlineRegistration150Amount = $scope.dailyUpdateData.onlineRegistration150Amount + $scope.daywisePayGov[i].credit;
                }else{
                     $scope.dailyUpdateData.onlineRegistration350Count++;
                     $scope.dailyUpdateData.onlineRegistration350Amount = $scope.dailyUpdateData.onlineRegistration350Amount + $scope.daywisePayGov[i].credit;
                }
            }
//            $scope.totalRegistration = $scope.daywiseRegistrationData.length;
        });
         var daywiseCash = {
                    fromdate:from,
                    todate:to,
                    location:'',
                    paymentThrough:'Cash',
                    transactionType :''
                };
         $http({
            method: "POST",
            url: baseURL + "paymenttransaction/daywisecollection", //complete transaction
            data: daywiseCash,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.daywiseTopUpsData = response.data.data;
            $scope.totalRegistration = 0;
            for(var i=0;i<$scope.daywiseTopUpsData.length;i++){
                if($scope.daywiseTopUpsData[i].credit === 50){
                    {
                        if($scope.daywiseTopUpsData[i].paymentDescription === 'Topup'){
                            $scope.dailyUpdateData.cashT50Count++;
                    $scope.dailyUpdateData.cashT50Amount = $scope.dailyUpdateData.cashT50Amount + $scope.daywiseTopUpsData[i].credit;
                        }else{
                            $scope.dailyUpdateData.cashRegistration50Count++;
                    $scope.dailyUpdateData.cashRegistration50Amount = $scope.dailyUpdateData.cashRegistration50Amount + $scope.daywiseTopUpsData[i].credit;
                        }
                    }
                    
                }else if($scope.daywiseTopUpsData[i].credit === 20){
                     $scope.dailyUpdateData.cashT20Count++;
                    $scope.dailyUpdateData.cashT20Amount = $scope.dailyUpdateData.cashT20Amount + $scope.daywiseTopUpsData[i].credit;
                }else{
                     $scope.dailyUpdateData.cashRegistration350Count++;
                     $scope.dailyUpdateData.cashRegistration350Amount = $scope.dailyUpdateData.cashRegistration350Amount + $scope.daywiseTopUpsData[i].credit;
                }
            }
//            $scope.totalRegistration = $scope.daywiseRegistrationData.length;
        });
         var daywiseRefund = {
                    fromdate:from,
                    todate:to,
                    location:'',
                    paymentThrough:'',
                    transactionType :'Refund'
                };
         $http({
            method: "POST",
            url: baseURL + "paymenttransaction/daywisecollection", //complete transaction
            data: daywiseRefund,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.daywiseRefund = response.data.data;
           $scope.dailyUpdateData.refundsCount = $scope.daywiseRefund.length;
            for(var i=0;i<$scope.daywiseRefund.length;i++){
                $scope.dailyUpdateData. refundsAmount = $scope.dailyUpdateData. refundsAmount + $scope.daywiseRefund[i].debit;
            }
        });
        var completedata = {
            fromdate: from,
            todate: to
        };
        $http({
            method: "POST",
            url: baseURL + "transactions/completed", //complete transaction
            data: completedata,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response3, status) {
            $scope.completeData = response3.data.data;
            $scope.dailyUpdateData.rides = $scope.completeData.length;
            for(var i=0;i<$scope.completeData.length;i++){
                $scope.dailyUpdateData.usageCost += $scope.completeData[i].creditsUsed;
            }
            data1 = $scope.dailyUpdateData;
          swal.close();
        },function (response) {
            sweetAlert(response.data.message);
        });
    };
//    $scope.addData = function () {
////        $scope.TotalRegistrations = 0;$scope.Rs50TopUps = 0;$scope.Rs20TopUps = 0;
//       $scope.TotalRegistrations = $scope.pRegistrations+$scope.totalRegistration;
//       $scope.Rs50TopUps = $scope.p50TopUps + $scope.totalT50;
//       $scope.Rs20TopUps = $scope.p20TopUps + $scope.totalT20;
//    };
    $scope.addData = function () {
        
    $http({//to unlock                          
                    method: "POST",
                    url: ipURL + "dailysummary",
                    data: data1,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response6, status) {
                    alert("Success");
                });
            };
});




















