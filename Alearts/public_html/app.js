/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var app = angular.module('myApp', ['toastr']);
var socket = io('43.251.80.79:5959');
var snd = new Audio('./tornado_siren.mp3');
var ipURL80 = "http://43.251.80.79:13080/api/"; //Alert
var baseURL60 = "https://www.mytrintrin.com:13060/api/";     // Employee Details
var usersList = [];

var EmployeeName = '',ResonType = '';
 app.controller('customersCtrl', function ($scope, $http,toastr) {
     var _this = this;
     $.getJSON('usersList.json')
            .success(function(data) {
                angular.extend(_this, data);
                usersList = data;
                for(var i=0;i<usersList.length;i++){
                    //alert(usersList[i].type+"\n"+JSON.stringify(usersList[i].Data));
                    socket.emit(usersList[i].type,usersList[i].Data);
                }
                
            })
            .error(function() {
                defer.reject('could not find someFile.json');
            });
     
     $scope.Resons = ["Falls Alert","Athorized CheckOut","Unathorized CheckOut","Employee CheckOut","Testing CheckOut","Others"];
//    fs.readFile('usersList.json',function(err,data){
//			console.log("Reading Users list..." + JSON.stringify(usersList))
//			if(err){
//		    		console.log(err);
//		    		return;
//			}
//			if(Object.keys(usersList).length==0){
//		    		usersList=JSON.parse(data);
//		    		console.log("Using Users Data from File..."+Object.keys(usersList).length)
//                            }
//                        });

//           $http({
//        method: "GET",
//        url: baseURL60 + "employee", //Required for employees Name and UserID
//        data: '',
//        headers: {
//            "Content-Type": "application/json"
//        }
//    }).then(function (response, status) {
//            $scope.employeeData = response.data.data;
//            $scope.employee = [];
//            for(var i=0;i<$scope.employeeData.length;i++){
//                $scope.employee.push($scope.employeeData[i].Name);
//            }
//            swal({
//  title: 'Alert Message',
//  input: 'select',
//  inputOptions: $scope.employee,
//  inputPlaceholder: 'Select a Employee',
//  html: 'Response: <input id="response" class="form-control swal2-input">',
//  preConfirm: function (selectedOption) {
//    return new Promise(function (resolve) {
//        resolve({selectedOption: selectedOption, value: document.getElementById('response').value})
//    });
//  },
//  onOpen: function () {
//    $('#swal-input1').focus();
//  }
//}).then(function (result) {
//  var employee = $scope.employeeData[result.selectedOption].Name;
//  swal(employee + '\n'+result.value);
//}).catch(swal.noop);
//        },function(response) {
//        sweetAlert(response.data.message);
//    });   
     

     


//    socket.on('BCS', function(data) {
//        sweetAlert("Card Status Update");
////    snd.play();
//    });
    socket.on('ALERT', function(data) {
    //        sweetAlert("UCO");
//        if(data.Type!=="UCO"){
//            toastr.warning('Card Miss Use', 'UCO');
//        }else{
            sweetAlert(JSON.stringify(data));
            snd.play();
//        }
        $http({
            method: "GET",
            url: ipURL80 + "alert", //vehicle details
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.alertData = response.data.data;
            $scope.alertCount = $scope.alertData.length;
        });
    });
    $http({
        method: "GET",
        url: ipURL80 + "alert", //vehicle details
        data: '',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response, status) {
        $scope.alertData = response.data.data;
        $scope.alertCount = $scope.alertData.length;
    },function(response) {
        sweetAlert(response.data.message);
    });
    $http({
        method: "GET",
        url: baseURL60 + "employee", //Required for employees Name and UserID
        data: '',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response2, status) {
        $scope.employeeData = response2.data.data;
    },function(response) {
        sweetAlert(response.data.message);
    });
    
    //select Employee Name
    $scope.selecteEmployee = function (data)
    {
        EmployeeName = data.Name;
    };
    //select Resontype
    $scope.selectedReson = function (data)
    {
        ResonType = data;
    };
    
    //alert closeing
    $scope.alertResponse = function (data)
    {
        var url = "alert/"+data._id;
        if(EmployeeName!==""){
            data.closedBy = EmployeeName;
            var _Response = document.getElementById("Response").value;
             $scope.Response = _Response;
            if($scope.Response!==""){
                data.Response = $scope.Response;
                $http({
                    method: "PUT",
                    url:ipURL80+url,
                    data: data,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response, status) {
                    sweetAlert(response.data.message);
                },function(response) {
                    sweetAlert(response.data.message);
                });
            }else{
                sweetAlert("First Enter a Response");
            }
        }else{
            sweetAlert("First Selecte Employee");
        }
    };
});