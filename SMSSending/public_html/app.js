 var app = angular.module('myApp', []);
app.controller('customersCtrl', function ($scope, $http) {
    $scope.smsData = {
       pRegistrations :'',
       p50TopUps :'',
       p20TopUps :''
   };
   $scope.data = {"outboundSMSMessageRequest":{
"address":["tel:8147151075"],
"senderAddress":"tel:MOBKAR",
"outboundSMSTextMessage":{
    "message":"TRIN TRIN Status Update\nDate: NOV 12 2017\nRegistrations:12\nRides:638\nUsageCost:Rs1080\nTotalRegistrations:7219\nRs.50TopUps(Total):4604\nRs.20TopUps(Total):658\n"},
"clientCorrelator":"",
"messageType":"0",
"category":"TRIN TRIN Status Update",
"receiptRequest": {"notifyURL":"",
"callbackData":"$(callbackData)"},
"senderName":"MOBKAR"}
};
//            alert(JSON.stringify($scope.data));
//var postData = angular.toJson($scope.data, true);
 $.ajax({
            url: "http://smspush.openhouseplatform.com/smsmessaging/1/outbound/tel%3A%2BMOBKAR/requests",
            type: 'POST',
            data: $scope.data,
            dataType: 'json',
            headers: {
//               "Content-Type": "application/json",
                "key":"05d62908-fd4f-4222-8472-896cc85b16f0"
            },
            success: function() {
                alert("Okay");
            },
            error:function (error) {
                alert(JSON.stringify(error));
            }
        });
        
        
//           $http({
//            method: "POST",
//            url: "http://smspush.openhouseplatform.com/smsmessaging/1/outbound/tel%3A%2BMOBKAR/requests",
//            data: $scope.data,
//            headers: {
//               "Content-Type": "application/json",
//                "key":"05d62908-fd4f-4222-8472-896cc85b16f0"
//            }
//        }).then(function (response, status) {
//            alert("Okay");
//        }, function myError(response) {
//       alert(JSON.stringify(response));
//    });
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
     $scope.sendSMS = function () {
         $scope.data = {
             "outboundSMSMessageRequest":{
                "address":["tel:8147151075"],
                "senderAddress":"tel:MOBKAR",
                "outboundSMSTextMessage":
                    {"message":"Hallo"},
                "clientCorrelator":"",
                "messageType":"0",
                "category":"TRIN TRIN Status Update",
                "receiptRequest": {
                    "notifyURL":"",
                    "callbackData":"$(callbackData)"},
                "senderName":"MOBKAR"}
            };
//            alert(JSON.stringify($scope.data));
//var postData = angular.toJson($scope.data, true);
 $.ajax({
            url: "http://smspush.openhouseplatform.com/smsmessaging/1/outbound/tel%3A%2BMOBKAR/requests",
            type: 'POST',
            data: $scope.data,
            dataType: 'json',
            success: function() {
                alert("Okay");
            },
            error:function (error) {
                alert(JSON.stringify(error));
            }
        });




//   $http({
//            method: "POST",
//            url: "http://smspush.openhouseplatform.com/smsmessaging/1/outbound/tel%3A%2BMOBKAR/requests",
//            data: $scope.data,
//            headers: {
////                "Content-Type": "application/json",
//                "key":"05d62908-fd4f-4222-8472-896cc85b16f0"
//            }
//        }).then(function (response, status) {
//            alert("Okay");
//        }, function myError(response) {
//       alert(JSON.stringify(response));
//    });
    };
 
   
});




















