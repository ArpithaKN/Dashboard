var app = angular.module('myApp', []);
var completetransaction = [];
var baseURL60 = "https://www.mytrintrin.com:13060/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
//var tempURL = "http://43.251.80.79:13080/api/";              //to unlock and create a checkouts record,transactions
var ipURL = "http://43.251.80.79:13090/api/";      //unlock,create a checkout and opentransaction and delete opentransaction      
var ipURL60 = "http://43.251.80.79:13060/api/"; 
var todayDate = new Date(); //current date
var idlist = [];
var from=new Date();
var to=new Date();
app.controller('customersCtrl', function ($scope, $http) {
    $scope.getdata = function (fromdate, todate)
    {
    from = fromdate;
    to = todate;   
var daywisePayGov = {
                    fromdate:fromdate,
                    todate:todate,
                    location:'',
                    paymentThrough:'PayGov',
                    transactionType :'Registration'//'Ondemand'
                };
         $http({
            method: "POST",
            url: baseURL60 + "paymenttransaction/daywisecollection", //complete transaction
            data: daywisePayGov,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.daywisePayGov = response.data.data;
            $scope.totalRegistration150Count = $scope.daywisePayGov.length;
            $scope.totalRegistration150 = [],$scope.totalRegistration = [];
            $scope.totalRegistration150Amount = 0;
            for(var i=0;i<$scope.daywisePayGov.length;i++){
                 $scope.totalRegistration150Amount =  $scope.totalRegistration150Amount + $scope.daywisePayGov[i].debit;
                if($scope.daywisePayGov[i].debit === 150){
                    $scope.totalRegistration150.push($scope.daywisePayGov[i]);
                }else{
                    $scope.totalRegistration.push($scope.daywisePayGov[i]);
                }
            }
//            $scope.totalRegistration150Count = $scope.totalRegistration150.length;
        });
    };
    $scope.recordUpdae = function(data){
        var id = data.memberId._id;
           $http({
            method: "PUT",
            url: baseURL60 + "paymenttransaction/correction/urefund/"+id, //complete transaction
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            var daywisePayGov = {
                    fromdate:from,
                    todate:to,
                    location:'',
                    paymentThrough:'',
                    transactionType :'Refund Unused Balance'
                };
         $http({
            method: "POST",
            url: baseURL60 + "paymenttransaction/daywisecollection", //complete transaction
            data: daywisePayGov,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.RefundUnusedBal = response.data.data;
            $scope.RefundUnusedBalCount = $scope.RefundUnusedBalCount.length;
            alert($scope.RefundUnusedBalCount);
        });
        });
    };
});




















