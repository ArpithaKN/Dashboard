var app = angular.module('myApp', []);
var memberdetails = [];//it stor the memer information
var baseURL70 = "https://www.mytrintrin.com:13070/api/";
var baseURL60 = "https://www.mytrintrin.com:13060/api/";   //opencheckouts,ports clear,clear aopen checkouts,dockingsatation,memberdetails,complete transaction,balance update,negative balance list
var ipURL80 = "http://43.251.80.79:13080/api/"; //ports checkin, UMclear,bridge clear
var ipURL60 = "http://43.251.80.79:13070/api/";
var ipURL90 = "http://43.251.80.79:13090/api/";      //to get a local opencheckouts
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic

var transaction = []; //its store the member open checkout
app.controller('customersCtrl', function ($scope, $http) {
    
    $http({
                    method: "GET",
                    url: baseURL70 + "transactions", //Open CheckOuts
                    data: '',
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response, status) {
                    $scope.TransactionData = response.data.data;
//                    $scope.Opentotalcount = $scope.TransactionData.length;
                    transaction = $scope.TransactionData;
                    $scope.Transaction = [];
                    for (var j = 0; j < transaction.length; j++)
                    {
                        var checkouttime = transaction[j].checkOutTime;
                        var today = new Date();
                        var check = new Date(checkouttime);
                        var to = new Date(today);
                        var duration = to.getTime() - check.getTime();
                        var hours = (duration / 3600000); //converting a seconds to Hours
                        if (1.0 > hours) // compare duration lessthan 1 hours
                        {
                            var opencheckoutEntry = {
                                cardNum: transaction[j].user.cardNum,
                                Name: transaction[j].user.Name,
                                vehicleId: transaction[j].vehicle.vehicleNumber,
                                checkoutTime: transaction[j].checkOutTime,
                                port: transaction[j].fromPort.Name,
                                hour:hours,
                                _id: transaction[j]._id
                            };
                            $scope.Transaction.push(opencheckoutEntry); //push data to new array, the member who are checkout lessthan 1 hours
                        } else if ((1.0 < hours) && (hours < 2.0)) // compare duration more than 1 hours
                        {
                            var opencheckoutEntry = {
                                cardNum: transaction[j].user.cardNum,
                                Name: transaction[j].user.Name,
                                vehicleId: transaction[j].vehicle.vehicleNumber,
                                checkoutTime: transaction[j].checkOutTime,
                                port: transaction[j].fromPort.Name,
                                hour:hours,
                                _id: transaction[j]._id
                            };
                            $scope.Transaction.push(opencheckoutEntry); //push data to new array, the member who are checkout morethan 1 hours
                        } else if ((2.0 < hours) && (hours < 3.0)) // compare duration more than 2 hours
                        {
                            var opencheckoutEntry = {
                                cardNum: transaction[j].user.cardNum,
                                Name: transaction[j].user.Name,
                                vehicleId: transaction[j].vehicle.vehicleNumber,
                                checkoutTime: transaction[j].checkOutTime,
                                port: transaction[j].fromPort.Name,
                                hour:hours,
                                _id: transaction[j]._id
                            };
                            $scope.Transaction.push(opencheckoutEntry); //push data to new array, the member who are checkout morethan 2 hours
                        } else if ((3.0 < hours) && (hours < 4.0)) // compare duration more than 3 hours
                        {
                            var opencheckoutEntry = {
                                cardNum: transaction[j].user.cardNum,
                                Name: transaction[j].user.Name,
                                vehicleId: transaction[j].vehicle.vehicleNumber,
                                checkoutTime: transaction[j].checkOutTime,
                                port: transaction[j].fromPort.Name,
                                hour:hours,
                                _id: transaction[j]._id
                            };
                            $scope.Transaction.push(opencheckoutEntry); //push data to new array, the member who are checkout morethan 3 hours
                        } else if ((4.0 < hours)) // compare duration more than 4 hours
                        {
                            var opencheckoutEntry = {
                                cardNum: transaction[j].user.cardNum,
                                Name: transaction[j].user.Name,
                                vehicleId: transaction[j].vehicle.vehicleNumber,
                                checkoutTime: transaction[j].checkOutTime,
                                port: transaction[j].fromPort.Name,
                                hour:hours,
                                _id: transaction[j]._id
                            };
                            $scope.Transaction.push(opencheckoutEntry); //push data to new array, the member who are checkout morethan 4 hours
                        }
                    if ((5.0 < hours) && (hours < 6.0)) // compare duration more than 5 hours
                    {
                    var opencheckoutEntry = {
                                cardNum:transaction[j].user.cardNum,
                                Name:transaction[j].user.Name,
                                vehicleId:transaction[j].vehicle.vehicleNumber,
                                checkoutTime:transaction[j].checkOutTime,
                                port:transaction[j].fromPort.Name,
                                hour:hours,
                                _id:transaction[j]._id
                            };
                        $scope.Transaction.push(opencheckoutEntry); //push data to new array, the member who are checkout morethan 5 hours
                    }
                    }
                    $scope.total = $scope.Transaction.length;
                });
    var refresh = setInterval(gettransaction, 30000); //setInterval for 30 sec
    function gettransaction()
    {
        $http({
                    method: "GET",
                    url: baseURL70 + "transactions", //Open CheckOuts
                    data: '',
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response, status) {
                    $scope.TransactionData = response.data.data;
//                    $scope.Opentotalcount = $scope.TransactionData.length;
                    transaction = $scope.TransactionData;
                    $scope.Transaction = [];
                    for (var j = 0; j < transaction.length; j++)
                    {
                        var checkouttime = transaction[j].checkOutTime;
                        var today = new Date();
                        var check = new Date(checkouttime);
                        var to = new Date(today);
                        var duration = to.getTime() - check.getTime();
                        var hours = (duration / 3600000); //converting a seconds to Hours
                        if (1.0 > hours) // compare duration lessthan 1 hours
                        {
                            var opencheckoutEntry = {
                                cardNum: transaction[j].user.cardNum,
                                Name: transaction[j].user.Name,
                                vehicleId: transaction[j].vehicle.vehicleNumber,
                                checkoutTime: transaction[j].checkOutTime,
                                port: transaction[j].fromPort.Name,
                                hour:hours,
                                _id: transaction[j]._id
                            };
                            $scope.Transaction.push(opencheckoutEntry); //push data to new array, the member who are checkout lessthan 1 hours
                        } else if ((1.0 < hours) && (hours < 2.0)) // compare duration more than 1 hours
                        {
                            var opencheckoutEntry = {
                                cardNum: transaction[j].user.cardNum,
                                Name: transaction[j].user.Name,
                                vehicleId: transaction[j].vehicle.vehicleNumber,
                                checkoutTime: transaction[j].checkOutTime,
                                port: transaction[j].fromPort.Name,
                                hour:hours,
                                _id: transaction[j]._id
                            };
                            $scope.Transaction.push(opencheckoutEntry); //push data to new array, the member who are checkout morethan 1 hours
                        } else if ((2.0 < hours) && (hours < 3.0)) // compare duration more than 2 hours
                        {
                            var opencheckoutEntry = {
                                cardNum: transaction[j].user.cardNum,
                                Name: transaction[j].user.Name,
                                vehicleId: transaction[j].vehicle.vehicleNumber,
                                checkoutTime: transaction[j].checkOutTime,
                                port: transaction[j].fromPort.Name,
                                hour:hours,
                                _id: transaction[j]._id
                            };
                            $scope.Transaction.push(opencheckoutEntry); //push data to new array, the member who are checkout morethan 2 hours
                        } else if ((3.0 < hours) && (hours < 4.0)) // compare duration more than 3 hours
                        {
                            var opencheckoutEntry = {
                                cardNum: transaction[j].user.cardNum,
                                Name: transaction[j].user.Name,
                                vehicleId: transaction[j].vehicle.vehicleNumber,
                                checkoutTime: transaction[j].checkOutTime,
                                port: transaction[j].fromPort.Name,
                                hour:hours,
                                _id: transaction[j]._id
                            };
                            $scope.Transaction.push(opencheckoutEntry); //push data to new array, the member who are checkout morethan 3 hours
                        } else if ((4.0 < hours)) // compare duration more than 4 hours
                        {
                            var opencheckoutEntry = {
                                cardNum: transaction[j].user.cardNum,
                                Name: transaction[j].user.Name,
                                vehicleId: transaction[j].vehicle.vehicleNumber,
                                checkoutTime: transaction[j].checkOutTime,
                                port: transaction[j].fromPort.Name,
                                hour:hours,
                                _id: transaction[j]._id
                            };
                            $scope.Transaction.push(opencheckoutEntry); //push data to new array, the member who are checkout morethan 4 hours
                        }
                    if ((5.0 < hours) && (hours < 6.0)) // compare duration more than 5 hours
                    {
                    var opencheckoutEntry = {
                                cardNum:transaction[j].user.cardNum,
                                Name:transaction[j].user.Name,
                                vehicleId:transaction[j].vehicle.vehicleNumber,
                                checkoutTime:transaction[j].checkOutTime,
                                port:transaction[j].fromPort.Name,
                                hour:hours,
                                _id:transaction[j]._id
                            };
                        $scope.Transaction.push(opencheckoutEntry); //push data to new array, the member who are checkout morethan 5 hours
                    }
                    }
                    $scope.total = $scope.Transaction.length;
                });
    }
});

