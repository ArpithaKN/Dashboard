var app = angular.module('myApp',[]);
var baseURL60 = "https://www.mytrintrin.com:13060/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
var ipURL80 = "http://43.251.80.79:13080/api/";              //to unlock and create a checkouts record,transactions
var ipURL60 = "http://43.251.80.79:13060/api/";
var ipURL10 = "http://43.251.80.79:14010/api/";
var todayDate = new Date(); //current date
var idlist = [];
app.controller('customersCtrl', function ($scope, $http) {
//    alert("Hai");
    $http({
        method: "GET",
        url: ipURL10 + "transactions/open", //complete transaction
        data: '',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response3, status) {
        $scope.manBasedCheckout = [];
        for(var i=0;i<response3.data.data.length;i++){
            var data = {
                name:response3.data.data[i].name,
                phoneNumber:response3.data.data[i].phoneNumber,
                vehicleNumber:response3.data.data[i].vehicleNumber,
                checkOutTime:response3.data.data[i].checkOutTime,
                img:imgsrc+response3.data.data[i].user+'/'+response3.data.data[i].profilePic+'.png'
            };
        $scope.manBasedCheckout.push(data);
    }
    });
});
