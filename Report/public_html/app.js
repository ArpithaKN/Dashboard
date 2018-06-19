var app = angular.module('myApp', []);
var completetransaction = [];
var baseURL = "https://www.mytrintrin.com:13060/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
//var tempURL = "http://43.251.80.79:13080/api/";              //to unlock and create a checkouts record,transactions
var ipURL = "http://43.251.80.79:13090/api/";      //unlock,create a checkout and opentransaction and delete opentransaction      
var ipURL60 = "http://43.251.80.79:13060/api/"; 
var todayDate = new Date(); //current date
var idlist = [];
app.controller('customersCtrl', function ($scope, $http) {
    $scope.getdata = function (from, to)
    { 
        swal("Loading....");
        var daywiseTopUps = {
                    fromdate:from,
                    todate:to,
                    location:''
                    
                };
         $http({
            method: "POST",
            url: baseURL + "kpi/paymentreport", //complete transaction
            data: daywiseTopUps,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.daywiseTopUpsData = response.data.data; 
             $scope.PaymentProcessing = [];
            for(var i=0;i<$scope.daywiseTopUpsData.length;i++)
                {
                    if($scope.daywiseTopUpsData[i].duration >= 24){
                          $scope.PaymentProcessing.push($scope.daywiseTopUpsData[i]);
                    }
                }
        });
    };
//    $scope.getdata = function (from, to)
//    {  
//        swal("Loading....");
//        var daywiseTopUps = {
//                    fromdate:from,
//                    todate:to,
//                    location:'',
//                    paymentThrough:'',
//                    transactionType :'Topup'
//                };
//         $http({
//            method: "POST",
//            url: baseURL + "paymenttransaction/daywisecollection", //complete transaction
//            data: daywiseTopUps,
//            headers: {
//                "Content-Type": "application/json"
//            }
//        }).then(function (response, status) {
//            $scope.daywiseTopUpsData = response.data.data;
//            $scope.totalT50 = 0;$scope.totalT20 = 0;$scope.totalT50 = 0;$scope.totalT60 = 0;$scope.totalT180 = 0;$scope.totalT300 = 0;$scope.totalT600 = 0;$scope.totalTopup = 0;
//            for(var i=0;i<$scope.daywiseTopUpsData.length;i++){
//                if($scope.daywiseTopUpsData[i].credit === 50){
//                    $scope.totalT50++;
//                }else if($scope.daywiseTopUpsData[i].credit === 20){
//                    $scope.totalT20++;
//                }else if($scope.daywiseTopUpsData[i].credit === 50){
//                    $scope.totalT50++;
//                }else if($scope.daywiseTopUpsData[i].credit === 60){
//                    $scope.totalT60++;
//                }else if($scope.daywiseTopUpsData[i].credit === 180){
//                    $scope.totalT180++;
//                }else if($scope.daywiseTopUpsData[i].credit === 300){
//                    $scope.totalT300++;
//                }else if($scope.daywiseTopUpsData[i].credit === 600){
//                    $scope.totalT600++;
//                }else{
//                    $scope.totalTopup++;
//                }
//            }
//            $scope.totalTopup = $scope.totalT50 + $scope.totalT20+$scope.totalT60+$scope.totalT180+$scope.totalT300+$scope.totalT600;
//            if($scope.totalTopup !== $scope.daywiseTopUpsData.length){
//                $scope.totalT50 = "NILL" ; $scope.totalT20 = "NILL";
//            } 
//        var daywiseRefund = {
//                    fromdate:from,
//                    todate:to,
//                    location:'',
//                    paymentThrough:'',
//                    transactionType :'Refund'
//                };
//         $http({
//            method: "POST",
//            url: baseURL + "paymenttransaction/daywisecollection", //complete transaction
//            data: daywiseRefund,
//            headers: {
//                "Content-Type": "application/json"
//            }
//        }).then(function (response, status) {
//            $scope.daywiseRefundData = response.data.data;
//            $scope.securityRefundCount = 0,$scope.securityRefundAmount = 0;
//         
//            for( var i=0;i<$scope.daywiseRefundData.length;i++){
//                if($scope.daywiseRefundData[i].debit === 250){
//                    $scope.securityRefundCount++;
//                    $scope.securityRefundAmount = $scope.securityRefundAmount + $scope.daywiseRefundData[i].debit;
//                }else{
//                    
//                }
//            }
//        });
//        var daywiseRefundUnused = {
//                    fromdate:from,
//                    todate:to,
//                    location:'',
//                    paymentThrough:'',
//                    transactionType :'Refund Unused Balance'
//                };
//         $http({
//            method: "POST",
//            url: baseURL + "paymenttransaction/daywisecollection", //complete transaction
//            data: daywiseRefundUnused,
//            headers: {
//                "Content-Type": "application/json"
//            }
//        }).then(function (response, status) {
//            $scope.daywiseUnusedRefundData = response.data.data;
//            
//            $scope.RefundCount = 0,$scope.RefundAmount = 0;
//            for( var i=0;i<$scope.daywiseUnusedRefundData.length;i++){
//                if($scope.daywiseUnusedRefundData[i].debit === 250){
//                    
//                }else{
//                     $scope.RefundCount++;
//                     $scope.RefundAmount = $scope.RefundAmount + $scope.daywiseUnusedRefundData[i].debit;
//                }
//            }
//        });
//       
//         var daywiseRegistration = {
//                fromdate:from,
//                todate:to,
//                location:'',
//                paymentThrough:'',
//                transactionType :'Security Deposit'
//            };
//         $http({
//            method: "POST",
//            url: baseURL + "paymenttransaction/daywisecollection", //complete transaction
//            data: daywiseRegistration,
//            headers: {
//                "Content-Type": "application/json"
//            }
//        }).then(function (response, status) {
//            $scope.daywiseRegistrationData = response.data.data;
//            $scope.totalRegistration = 0;$scope.totalRegistration350 = 0;$scope.totalRegistration360 = 0;$scope.totalRegistration480 = 0;$scope.totalRegistration600 = 0;$scope.totalRegistration900 = 0;
//           $scope.totalCancel = 0;$scope.totalRegistration150 = 0;
//        for(var i=0;i<$scope.daywiseRegistrationData.length;i++){
//            if($scope.daywiseRegistrationData[i].memberId.status !== -1){
//                if($scope.daywiseRegistrationData[i].debit === 250 || $scope.daywiseRegistrationData[i].credit === 250){
//                    $scope.totalRegistration++;  
//                    
//                    if($scope.daywiseRegistrationData[i].memberId.membershipId.subscriptionType==='Monthly Member Plan'){
//                        $scope.totalRegistration360++;
//                    }
//                    else if($scope.daywiseRegistrationData[i].memberId.membershipId.subscriptionType==='Quarterly Plan'){
//                        $scope.totalRegistration480++;
//                    }
//                    else if($scope.daywiseRegistrationData[i].memberId.membershipId.subscriptionType==='Half Yearly Plan'){
//                        $scope.totalRegistration600++;
//                    }
//                    else if($scope.daywiseRegistrationData[i].memberId.membershipId.subscriptionType==='Yearly Plan'){
//                        $scope.totalRegistration900++;
//                    }
//                    else{ 
////                        if($scope.daywiseRegistrationData[i].memberId.membershipId.subscriptionType==='Weekly Plan'){
//                        $scope.totalRegistration350++;
//                    }
//                }else 
////                    if($scope.daywiseRegistrationData[i].memberId.membershipId.subscriptionType==='Weekly Plan'){
//                        $scope.totalRegistration150++;
////                    }else if($scope.daywiseRegistrationData[i].memberId.membershipId.subscriptionType==='Three Day Plan'){
////                        $scope.totalRegistration150++;
////                    }
//                    
//            }else{
////                    if($scope.daywiseRegistrationData[i].memberId.membershipId.subscriptionType==='Monthly Member Plan'){
//                        $scope.totalCancel++;
//                    }
//               
//            } //memberId.membershipId.subscriptionType
//            $scope.totalRegistration1 = $scope.daywiseRegistrationData.length;
//        });
//          
//            
//        });
//    };
});




















