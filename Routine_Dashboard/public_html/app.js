var app = angular.module('myApp', []);
var completetransaction = [], transaction = [], member = [];
var card1, phone1,userid;
var baseURL = "https://www.mytrintrin.com:13060/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
var ipURL = "http://43.251.80.79:13080/api/";              //to unlock and create a checkouts record,transactions
var tempURL = "http://43.251.80.79:13060/api/";
var todayDate = new Date(); //current date
var valdity, statuses, swal;
app.controller('customersCtrl', function ($scope, $http) {
 $scope.deleteBridge = function () {                                  //to clear the bridge   in manage Transactions
//        id1 = 'transactions/clearall/';
        swal({
            title: 'Are you sure?',
            text: "You want clear thr Bridge!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, clear it!'
        }).then(function () {
            $http({
                method: 'DELETE',
                url: ipURL + 'transactions/clearall',
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response2, status) {
                $scope.bridgeData = response2.data;
                //deletetransaction = $scope.bridgeData.message;
//            sweetAlert($scope.myData2);
                sweetAlert($scope.bridgeData.message);
            });
        });
    };
     $scope.deleteLocal = function () {                                  //to clear the bridge   in manage Transactions
//        id1 = 'transactions/clearall/';
        swal({
            title: 'Are you sure?',
            text: "You want clear Local!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, clear it!'
        }).then(function () {
            $http({
                method: 'DELETE',
                url: ipURL + 'routine/local',
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response2, status) {
                $scope.localrestData = response2.data;
//            sweetAlert($scope.myData2);
                sweetAlert($scope.localrestData.message);
            });
        });
    };
     $scope.Userrest = function () {                                  //to clear the bridge   in manage Transactions
//        id1 = 'transactions/clearall/';
        swal({
            title: 'Are you sure?',
            text: "You want clear User!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, clear it!'
        }).then(function () {
            $http({
                method: 'PUT',
                url: baseURL + 'users/all/vehicles',
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response2, status) {
                $scope.userrestData= response2.data;
//            sweetAlert($scope.myData2);
                sweetAlert($scope.userrestData.message);
            });
        });
    };
});