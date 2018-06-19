var app = angular.module('myApp', []);
var memberdetails = [];//it stor the memer information
var baseURL70 = "https://www.mytrintrin.com:13070/api/";
var baseURL60 = "https://www.mytrintrin.com:13060/api/";   //opencheckouts,ports clear,clear aopen checkouts,dockingsatation,memberdetails,complete transaction,balance update,negative balance list
var ipURL80 = "http://43.251.80.79:13080/api/"; //ports checkin, UMclear,bridge clear
var ipURL60 = "http://43.251.80.79:13070/api/";
var ipURL90 = "http://43.251.80.79:13090/api/";      //to get a local opencheckouts
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
var swal, statuses, valdity;
var todayDate = new Date();
todayDate = new Date(todayDate);
var oldcycles = [];
var stationid, dockingstation = [];
var ipAddress;
var userdetails = [];            //all users data(members and Employees)  
var idlist = [];//to store the _id to delete the opencheckouts
var transaction = []; //its store the member open checkout
app.controller('customersCtrl', function ($scope, $http) {
                    $http({
                        method: "GET",
                        url: baseURL60 + "member/validity/before/expiry", //complete transaction
                        data: '',
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(function (response3, status) {
                        $scope.memberdata = response3.data.data;
        var today = new Date();
        $scope.tddaydate = today;
        var month = today.getMonth();
        var date = today.getDate();
        $scope.validityexpiretoday = [];
        $scope.validityexpiredinoneday = [];
        $scope.validityexpiredintwodays = [];
        for (var i = 0; i < $scope.memberdata.length; i++)
        {
            var validity = $scope.memberdata[i].validity;
            validity = new Date(validity);
            var validmonth = validity.getMonth();
            var validdate = validity.getDate();
            if (month === validmonth)
            {
                if ((date === validdate) || (date === validdate - 1) || (date === validdate - 2))
                {
                    var valid = '';
                    var val = validdate - date;
                    if (val === 0) {
                        var data = {
                            Name: $scope.memberdata[i].Name,
                            cardNum: $scope.memberdata[i].cardNum,
                            phoneNumber: $scope.memberdata[i].phoneNumber,
                            validity: 'Today'
                        };
                        $scope.validityexpiretoday.push(data);
                    } else if (val === 1) {
                        var data = {
                            Name: $scope.memberdata[i].Name,
                            cardNum: $scope.memberdata[i].cardNum,
                            phoneNumber: $scope.memberdata[i].phoneNumber,
                            validity: '1 day'
                        };
                        $scope.validityexpiredinoneday.push(data);
                    } else if (val === 2) {
                        var data = {
                            Name: $scope.memberdata[i].Name,
                            cardNum: $scope.memberdata[i].cardNum,
                            phoneNumber: $scope.memberdata[i].phoneNumber,
                            validity: '2 days'
                        };
                        $scope.validityexpiredintwodays.push(data);
                    }
                }
            }
        }
        $scope.validityexpiredtoday = $scope.validityexpiretoday.length;
        $scope.validityexpiredin1 = $scope.validityexpiredinoneday.length;
        $scope.validityexpiredin2 = $scope.validityexpiredintwodays.length;
         swal.close();
                        swal("Its ready to Use");
    });
});

