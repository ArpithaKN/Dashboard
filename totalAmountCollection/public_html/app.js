var app = angular.module('myApp', []);
var completetransaction = [];
var baseURL = "https://www.mytrintrin.com:13060/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
//var tempURL = "http://43.251.80.79:13080/api/";              //to unlock and create a checkouts record,transactions
var ipURL = "http://43.251.80.79:13090/api/";      //unlock,create a checkout and opentransaction and delete opentransaction      
var todayDate = new Date(); //current date
var idlist = [];
app.controller('customersCtrl', function ($scope, $http) {
    $scope.getdata = function (from, to)
    {
        swal("Loading....");
         var totalCashCollection = {
                    fromdate:from,
                    todate:to,
                    location:"All"
                };
         $http({
            method: "POST",
            url: baseURL + "paymenttransaction/totalcollection", //complete transaction
            data: totalCashCollection,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.daywiseRegistrationData = response.data.data;
            alert($scope.daywiseRegistrationData[0].regPOS);
            $scope.totalRegistration = {
                regCash:0,
                regPG:0,
                regPOS:0,
                moneregCash:0,
                topupCash:0,
                topupPG:0,
                topupPOS:0,
                monetopupCash:0,	
                refunds:0
            };
            for(var i=0;i<$scope.daywiseRegistrationData.length;i++){
                if($scope.daywiseRegistrationData[i].regCash >= 0){
                    $scope.totalRegistration.regCash += $scope.daywiseRegistrationData[i].regCash;
                }
                if($scope.daywiseRegistrationData[i].regPG >= 0){
                    $scope.totalRegistration.regPG += $scope.daywiseRegistrationData[i].regPG;
                }
               if($scope.daywiseRegistrationData[i].regPOS >= 0){
                    $scope.totalRegistration.regPOS += $scope.daywiseRegistrationData[i].regPOS;
                }if($scope.daywiseRegistrationData[i].moneregCash >= 0){
                    $scope.totalRegistration.moneregCash += $scope.daywiseRegistrationData[i].moneregCash;
                }
                if($scope.daywiseRegistrationData[i].topupCash >= 0){
                    $scope.totalRegistration.topupCash += $scope.daywiseRegistrationData[i].topupCash;
                }
                if($scope.daywiseRegistrationData[i].topupPG >= 0){
                    $scope.totalRegistration.topupPG += $scope.daywiseRegistrationData[i].topupPG;
                }
                if($scope.daywiseRegistrationData[i].topupPOS >= 0){
                    $scope.totalRegistration.topupPOS += $scope.daywiseRegistrationData[i].topupPOS;
                }
                if($scope.daywiseRegistrationData[i].monetopupCash >= 0){
                    $scope.totalRegistration.monetopupCash += $scope.daywiseRegistrationData[i].monetopupCash;
                }
                if($scope.daywiseRegistrationData[i].refunds >= 0){
                    $scope.totalRegistration.refunds += $scope.daywiseRegistrationData[i].refunds;
                }
            }
            
            	
//            cash	Number	7880	
//            pos	Number	700	
//            topup	Number	2240	
//            $scope.totalRegistration = $scope.daywiseRegistrationData.length;
          swal.close();
      
        });
    };
   
});




















