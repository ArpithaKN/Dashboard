var app = angular.module('myApp', []);
var completetransaction = [];
var baseURL = "https://www.mytrintrin.com:13060/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
//var tempURL = "http://43.251.80.79:13080/api/";              //to unlock and create a checkouts record,transactions
var ipURL = "http://43.251.80.79:13090/api/";      //unlock,create a checkout and opentransaction and delete opentransaction      
var ipURL60 = "http://43.251.80.79:13060/api/"; 
var todayDate = new Date(); //current date
var idlist = [];
app.controller('customersCtrl', function ($scope, $http) {
    $scope.getdata = function (from, to, min, max)
    {
        $scope.dups = [];
        $scope.uniq = [];
        $scope.singlecount = 0;
        $scope.multicount = 0;
        $scope.multi = [];
        $scope.single = [];
        idlist = [];      //to store the selected _id to delete
        var completedata = {
            fromdate: from,
            todate: to
        };
        swal("Loading....");
           var daywiseRegistration1 = {
                    fromdate:from,
                    todate:to,
                    location:'',
                    paymentThrough:'',
                    transactionType :'Refund Unused Balance' //Refund Unused Balance //Refund
                };
         $http({
            method: "POST",
            url: baseURL + "paymenttransaction/daywisecollection", //complete transaction
            data: daywiseRegistration1,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.daywiseRefundData = response.data.data;
            $scope.securityRefundCount = 0,$scope.securityRefundAmount = 0;
            $scope.RefundCount = 0,$scope.RefundAmount = 0;
            for( var i=0;i<$scope.daywiseRefundData.length;i++){
                if($scope.daywiseRefundData[i].debit === 250){
                    $scope.securityRefundCount++;
                    $scope.securityRefundAmount = $scope.securityRefundAmount + $scope.daywiseRefundData[i].debit;
                }else{
                     $scope.RefundCount++;
                     $scope.RefundAmount = $scope.RefundAmount + $scope.daywiseRefundData[i].debit;
                }
            }
        });
         var daywiseRegistration = {
                    fromdate:from,
                    todate:to,
                    location:'',
                    paymentThrough:'',
                    transactionType :'Security Deposit'
                };
         $http({
            method: "POST",
            url: baseURL + "paymenttransaction/daywisecollection", //complete transaction
            data: daywiseRegistration,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.daywiseRegistrationData = response.data.data;
            $scope.totalRegistration = 0;$scope.totalRegistration360 = 0;$scope.totalRegistration480 = 0;$scope.totalRegistration600 = 0;$scope.totalRegistration900 = 0;
           //alert($scope.daywiseRegistrationData[0]); 
           $scope.CanRegistration = 0;$scope.shortTermRegistration = 0;
        for(var i=0;i<$scope.daywiseRegistrationData.length;i++){
             if($scope.daywiseRegistrationData[i].memberId.membershipId && $scope.daywiseRegistrationData[i].memberId.membershipId.subscriptionType){
                if($scope.daywiseRegistrationData[i].debit === 250 ||$scope.daywiseRegistrationData[i].credit === 250){
                    $scope.totalRegistration++;  
                    if($scope.daywiseRegistrationData[i].memberId.membershipId.subscriptionType==='Monthly Member Plan'){
                        $scope.totalRegistration360++;
                    }
                    else if($scope.daywiseRegistrationData[i].memberId.membershipId.subscriptionType==='Quarterly Plan'){
                        $scope.totalRegistration480++;
                    }
                    else if($scope.daywiseRegistrationData[i].memberId.membershipId.subscriptionType==='Half Yearly Plan'){
                        $scope.totalRegistration600++;
                    }
                    else if($scope.daywiseRegistrationData[i].memberId.membershipId.subscriptionType==='Yearly Plan'){
                        $scope.totalRegistration900++;
                    }
//                    $scope.shortTermRegistration++;
                }else{
                    if($scope.daywiseRegistrationData[i].memberId.membershipId.subscriptionType==='Three Day Plan'){
                          $scope.shortTermRegistration++;
                    }
                    else if($scope.daywiseRegistrationData[i].memberId.membershipId.subscriptionType==='Weekly Plan'){
                        $scope.shortTermRegistration++;
                    }
                }
                }else{
                 $scope.CanRegistration++;
             }
            }//memberId.membershipId.subscriptionType
            $scope.totalRegistration1 = $scope.daywiseRegistrationData.length;
        });
         var daywiseTopUps = {
                    fromdate:from,
                    todate:to,
                    location:'',
                    paymentThrough:'',
                    transactionType :'Topup'
                };
         $http({
            method: "POST",
            url: baseURL + "paymenttransaction/daywisecollection", //complete transaction
            data: daywiseTopUps,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.daywiseTopUpsData = response.data.data;
            $scope.totalT50 = 0;$scope.totalT20 = 0;$scope.totalT50 = 0;$scope.totalT60 = 0;$scope.totalT180 = 0;$scope.totalT300 = 0;$scope.totalT600 = 0;$scope.totalTopup = 0;
            for(var i=0;i<$scope.daywiseTopUpsData.length;i++){
                if($scope.daywiseTopUpsData[i].credit === 50){
                    $scope.totalT50++;
                }else if($scope.daywiseTopUpsData[i].credit === 20){
                    $scope.totalT20++;
                }else if($scope.daywiseTopUpsData[i].credit === 50){
                    $scope.totalT50++;
                }else if($scope.daywiseTopUpsData[i].credit === 60){
                    $scope.totalT60++;
                }else if($scope.daywiseTopUpsData[i].credit === 180){
                    $scope.totalT180++;
                }else if($scope.daywiseTopUpsData[i].credit === 300){
                    $scope.totalT300++;
                }else if($scope.daywiseTopUpsData[i].credit === 600){
                    $scope.totalT600++;
                }else{
                    $scope.totalTopup++;
                }
            }
            $scope.totalTopup = $scope.totalT50 + $scope.totalT20;
            if($scope.totalTopup !== $scope.daywiseCollectionData.length){
                $scope.totalT50 = "NILL" ; $scope.totalT20 = "NILL";
            }  
            
        });
//        $http({
//            method: "POST",
//            url: baseURL + "transactions/completed", //complete transaction
//            data: completedata,
//            headers: {
//                "Content-Type": "application/json"
//            }
//        }).then(function (response3, status) {
//            $scope.completeData = response3.data.data;
//            $scope.total = $scope.completeData.length;
//            var completetransaction = [];
////            completetransaction = $scope.completeData;
//            for(var i=0;i<$scope.completeData.length;i++){
//                if(($scope.completeData[i].user.Name !== 'Prime Test') && ($scope.completeData[i].user.Name !=='Prime Test 2'))
//                {
//                    completetransaction.push($scope.completeData[i]);
//                }
//            }
//
//            var unique = [], duplicatedata = [], sortcompletetransaction = [];
//            sortcompletetransaction = _.sortBy(completetransaction, 'checkOutTime');    //its sort the array based on checkOutTime
//            var map = {};
//
////              map.push(cardEntry);
//            for (var i = 0; i < sortcompletetransaction.length; i++)
//            {
//                if (sortcompletetransaction[i].user.cardNum in map)                  //if card in map[index] push record the same index
//                {
//                    var transactions = map[sortcompletetransaction[i].user.cardNum];
//                    transactions.push(sortcompletetransaction[i]);
//                    //map[sortcompletetransaction[i].user.cardNum].transactions.push();
//
//                } else                                                                //otherwise create a new object
//                {
//                    var transactions = new Array();
//                    transactions.push(sortcompletetransaction[i]);
//
//                    map[sortcompletetransaction[i].user.cardNum] = transactions;
//                }
//            }
//           var len = Object.keys(map).length; //to find the object length
////            var len = (Object.keys(map).length);
////            alert(len);
//            var multipletransaction = {}, singletransaction = {};
//            for (var i = 0; i < sortcompletetransaction.length; i++)
//            {
//                for (var j = 0; j < map[sortcompletetransaction[i].user.cardNum].length; j++)
//                {
//                    if (map[sortcompletetransaction[i].user.cardNum].length > 1)
//                        multipletransaction[sortcompletetransaction[i].user.cardNum] = map[sortcompletetransaction[i].user.cardNum];
//                    else
//                        singletransaction[sortcompletetransaction[i].user.cardNum] = map[sortcompletetransaction[i].user.cardNum];
//                }
//            }
//
//            for (var key in multipletransaction)
//            {
//                var data = [];
//                data = multipletransaction[key];
//                var transacionscount = data.length;
////                for(var j=0;j<data.length-1;j++) 
//                var j = 0;
//                while (transacionscount)
//                {
////                    var temp = data[j].checkOutTime;
////                     if (data.indexOf(temp) === -1) {
////                    duplicatedata.push(data[j]);;
////                } else {
////                   unique.push(data[j]);
////                }
//                    if (transacionscount !== 1) {
//                        if (data[j].checkOutTime === data[j + 1].checkOutTime)
//                        {
//                            duplicatedata.push(data[j]);
//                            duplicatedata.push(data[j + 1]);
//                            transacionscount -= 2;
//                            j += 1;
//                        } else {
//                            unique.push(data[j]);
//                            transacionscount--;
//                            j++;
//                        }
//                    } else {
//                        unique.push(data[j]);
//                        transacionscount--;
//                        j++;
//                    }
//                }
////                unique.push(data[len]);
//            }
//            var dupes = [];
//            for (var j = 0; j < duplicatedata.length; j++)
//            {
//                var dataEntry = {
//                    card: duplicatedata[j].user.cardNum,
//                    checkOutTime: duplicatedata[j].checkOutTime,
//                    from: duplicatedata[j].fromPort.Name,
//                    checkInTime: duplicatedata[j].checkInTime,
//                    to: duplicatedata[j].toPort.Name,
//                    vehicle: duplicatedata[j].vehicle.vehicleNumber,
//                    id: duplicatedata[j]._id
//                };
//                dupes.push(dataEntry);
//            }
////            }
//            $scope.multi = dupes;
//            $scope.multicount = dupes.length;
//
////            $scope.multicount = $scope.multi.length;
//            for (var key in singletransaction)
//            {
//                var data = [];
//                data = singletransaction[key];
//                for (var j = 0; j < data.length; j++)
//                {
//                    unique.push(data[j]);
//                }
//            }
//            $scope.single = unique;
//            $scope.singlecount = $scope.single.length;
//            $scope.filt = [];
//            $scope.filt1 = [];
//            $scope.dur = 0;
//            $scope.usagecharge = 0;
//            for (var j = 0; j < unique.length; j++) {
//                if (min <= unique[j].duration && unique[j].duration < max)
//                {
//                    if (unique[j].user.cardNum !== 83)
//                    {
//                    if (unique[j].checkOutTime < unique[j].checkInTime)
//                    {
//                        $scope.filt.push(unique[j]);
//                        $scope.usagecharge += unique[j].creditsUsed;
//                    }
//                }else if (min > unique[j].duration){
//                  $scope.filt1.push(unique[j]);  
//                }
//                $scope.dur = $scope.dur + unique[j].duration;
//            }
//            }
//            $scope.singlecount1 = $scope.filt.length;
//            $scope.lessthanmin = $scope.filt1.length;
//          swal.close();
//        },function (response) {
//            sweetAlert(response.data.message);
//        });
    };
    $scope.addData = function () {
//        $scope.TotalRegistrations = 0;$scope.Rs50TopUps = 0;$scope.Rs20TopUps = 0;
       $scope.TotalRegistrations = $scope.pRegistrations+$scope.totalRegistration;
       $scope.Rs50TopUps = $scope.p50TopUps + $scope.totalT50;
       $scope.Rs20TopUps = $scope.p20TopUps + $scope.totalT20;
    };
});




















