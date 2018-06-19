/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var app = angular.module('myApp', []);

var ipURL80 = "http://43.251.80.79:13060/api/"; //Alert
var baseURL60 = "https://www.mytrintrin.com:13060/api/";     // Employee Details



 app.controller('customersCtrl', function ($scope, $http) {
    $scope.getdata = function (from, to, min, max)
    {
        var daywiseRegistration = {
                    fromdate:from,
                    todate:to,
                    location:'',
                    paymentThrough:'PayGov',
                    transactionType :'Registration'
                };
         $http({
            method: "POST",
            url: baseURL60 + "paymenttransaction/daywisecollection", //complete transaction
            data: daywiseRegistration,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.RegistrationData = response.data.data;
            $scope.QRCodeRegistration = [];
            for(var i=0;i<$scope.RegistrationData.length;i++){
                if($scope.RegistrationData[i].credit === 150 ){
                    $scope.QRCodeRegistration.push($scope.RegistrationData[i]);
                }
            }
            $scope.RegistrationCount = $scope.QRCodeRegistration.length;
        });
        var daywiseRefund = {
                    fromdate:from,
                    todate:new Date(),
                    location:'',
                    paymentThrough:'',
                    transactionType :'Refund Unused Balance'
                };
                $scope.RefundData = [];
         $http({
            method: "POST",
            url: baseURL60 + "paymenttransaction/daywisecollection", //complete transaction
            data: daywiseRefund,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.RefundData = response.data.data;
             
            $http({
            method: "GET",
            url: baseURL60 + "onlinerefund", //complete transaction
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.onlinetransaction = response.data.data;
            for(var i=0;i<$scope.onlinetransaction.length;i++){
                var object = {
                    createdAt:$scope.onlinetransaction[i].createdAt,
                    debit:$scope.onlinetransaction[i].debit,
                    memberId:{
                        Name:$scope.onlinetransaction[i].user.Name,
                        UserID:$scope.onlinetransaction[i].user.UserID,
                        cardNum:$scope.onlinetransaction[i].user.cardNum
                    }
                };
                $scope.RefundData.push(object);
            }
            $scope.refundMembers = [];
            for(var i=0;i<$scope.RefundData.length;i++){
                if($scope.RefundData[i].debit > 0){
                    $scope.refundMembers.push($scope.RefundData[i]);
                }
            }
           $scope.RefundCount = $scope.refundMembers.length;
        });
        });
    };
    
});
 