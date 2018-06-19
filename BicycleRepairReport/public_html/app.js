var app = angular.module('myApp', []);
var baseURL60 = "https://www.mytrintrin.com:13060/api/";
var baseURL70 = "https://www.mytrintrin.com:13070/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
//var tempURL80 = "http://43.251.80.79:13080/api/";              //to unlock and create a checkouts record,transactions
var ipURL60 = "http://43.251.80.79:13060/api/";      //unlock,create a checkout and opentransaction and delete opentransaction      
var todayDate = new Date(); //current date
var vehicleuid, empID,actions,array = [],cycle,name,array1 = [];
app.controller('customersCtrl', function ($scope, $http) {
    swal({
        title: 'Loading...',
        showCancelButton: false,
        showConfirmButton: false 
    }).then(
             $http({
            method: "GET",
            url: baseURL60 + "employee", //vehicle details
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.emp = response2.data.data;
            $scope.Employee = [];
            for(var i=0;i<$scope.emp.length;i++){
                if($scope.emp[i]._type ==="maintenancecentre-employee" )
                {
                    $scope.Employee.push($scope.emp[i]);
                }
            }
            var act = [];
            act = ["Repair","Replace"];
            $scope.actions = act;
        $http({
            method: "GET",
            url: baseURL70 + "vehicle", //vehicle details
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.vehicleData = response2.data.data;
            swal.close();
            swal("Its ready to Use");
    });
        })
            );
    $scope.selectedVehicle = function (data) {                   //Docking Station  names and Ip address
                vehicleuid = data._id;
                cycle = data.vehicleNumber;
//                alert(data.vehicleNumber);
    };
     $scope.selectedEmployee = function (data) {                   //Docking Station  names and Ip address
                empID = data._id;
                name = data.Name;
//                alert(data.Name);
    };
     $scope.selectedAction = function (data) {                   //Docking Station  names and Ip address
                actions = data;
    };
//    $scope.records = [];
    $scope.create = function (){
     var from_time = $scope.fromtime.split(':');
     var _from_hours = from_time[0];
     var _from_minutes = from_time[1];

     var to_time = $scope.totime.split(':');
     var _to_hours = to_time[0];
     var _to_minutes = to_time[1];

     $scope.fromdate.setHours(_from_hours);
     $scope.fromdate.setMinutes(_from_minutes);
     $scope.todate.setHours(_to_hours);
     $scope.todate.setMinutes(_to_minutes);
     var from = new Date($scope.fromdate);
     var to = new Date($scope.todate);
     var duration = (to - from)/1000;
     var data = {
         reportedDate : from,
         repairedDate : to,
         vehicleId : vehicleuid,
         employeeId : empID,
         reason :$scope.reason,
         actionTaken:actions,
         createdBy:empID
//         duration:duration
     };
     array.push(data);
     var data1 = {
         reportedDate : from,
         repairedDate : to,
         vehicleId : cycle,
         employeeId : empID,
         reason :$scope.reason,
         actionTaken:actions,
         createdBy:empID
//         duration:duration
     };
     array1.push(data1);
     $scope.records = array1;
 };
     $scope.submit = function (){
     $http({
            method: "POST",
            url: baseURL60 + "maintenancecenter/repaired", //vehicle details
            data: array,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.vehicleData = response2.data.data;
            array = [];
            array1 = [];
            $scope.records = [];
        });
        };
});



