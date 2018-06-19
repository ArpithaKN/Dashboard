var app = angular.module('myApp', []);
var completetransaction = [];
//var baseURL = "http://43.251.80.79:13060/api/";
var baseURL = "https://www.mytrintrin.com:13060/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
//var tempURL = "http://43.251.80.79:13080/api/";              //to unlock and create a checkouts record,transactions
var ipURL = "http://43.251.80.79:13090/api/";      //unlock,create a checkout and opentransaction and delete opentransaction      
var todayDate = new Date(); //current date
var idlist = [];
app.controller('customersCtrl', function ($scope, $http) {
    
       
        swal("Loading....");
        $http({
            method: "GET",
            url: baseURL + "transactions/corrections", //complete transaction
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response3, status) {
            $scope.completeData = response3.data.data;
          swal.close();
        },function (response) {
            sweetAlert(response.data.message);
        });
    $scope.recordUpdae = function (data,checkOutTime) {
       var checkOutTime1 = new Date ( data.checkOutTime);
       checkOutTime = new Date ( checkOutTime );
       var checkInTime = checkOutTime;
       var duration;
//       for(var i=0;i<5;i++){
           var randomMin = Math.floor((Math.random() * 35)+20); 
           checkInTime.setMinutes ( checkInTime.getMinutes() + randomMin );
//           var randomSec = Math.floor((Math.random() * 10)+1); 
//           checkInTime.setSeconds ( checkInTime.getSeconds() + randomSec );
           var duration1 = checkInTime - checkOutTime1; 
           duration =Math.round(((duration1 % 86400000) % 3600000) / 60000);
//           alert("RandomNumber:"+randomMin+"\ncheckOutTime:"+checkOutTime1+"\nCheckInTime:"+checkInTime+"\nDuration:"+duration);
//       }
       data.checkInTime = checkInTime;
//       alert(data.checkInTime);
       data.duration = duration;
//       alert(data.duration);
//       $http({
//            method: "PUT",
//            url: baseURL + "transactions/"+data._id, //complete transaction
//            data: data,
//            headers: {
//                "Content-Type": "application/json"
//            }
//        }).then(function (response2, status) {
////            $scope.completeData = response2.data.data;
//            sweetAlert(response2.data.message);
//          swal.close();
//        },function (response) {
//            sweetAlert(response.data.message);
//        });
       
    };
});




















