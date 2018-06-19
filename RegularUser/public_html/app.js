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
    $scope.daywiseCollection={
            fromdate:'',
            todate:'',
            location:'',
            transactionType:'Topup'
        };
        $http({
                        method: "GET",
                        url: baseURL60 + "member/qweuird78fj3498asdjkfhahsysd98y4rsdjhf", //complete transaction
                        data: '',
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(function (response3, status) {
                        $scope.usersData = response3.data.data;
                        $scope.cancelMemberData = [];$scope.memberPhone = [];$scope.memberPhone1 = [];$scope.memberPhone2 = [];
                        //Cancel Member List
                        for(var i=0;i<$scope.usersData.length;i++){
                            if($scope.usersData[i].createdAt > "2017-06-04T00:00:00.000Z"){
                            if($scope.usersData[i].status === -1 && $scope.usersData[i]._type === 'member'){
                                $scope.cancelMemberData.push($scope.usersData[i]);
                            }
                        }
                        }
                        
                        $scope.cancelMemberCount = $scope.cancelMemberData.length;
                        //To get Phone Number
//                        for(var i=0;i<$scope.usersData.length;i++){
//                            if($scope.usersData[i].createdAt > "2017-06-04T00:00:00.000Z"){
//                            if($scope.usersData[i].status !== 0 && $scope.usersData[i]._type === 'member'){
//                                if((isNaN($scope.usersData[i].phoneNumber)) && ($scope.usersData[i].phoneNumber !=='undefined') && ($scope.usersData[i].phoneNumber !=='')){
//                                    var phoneNumber =$scope.usersData[i].phoneNumber;
////                                    if(phoneNumber.length >= 10){
//                                    $scope.memberPhone2.push(phoneNumber);
////                                }
//                            }
//                            else{
//                                $scope.memberPhone1.push($scope.usersData[i]);
//                            }
//                            }
//                        }
//                        }
//                        alert($scope.memberPhone2.length);
//                        for(var i=0;i<$scope.memberPhone2.length;i++){
//                            if($scope.memberPhone2[i].length >= 10 && $scope.memberPhone2[i].length <= 13){
//                                    $scope.memberPhone.push($scope.memberPhone2[i]);
//                                }
//                        }
//                        alert($scope.memberPhone.length);
                    });
        $scope.sendDaywiseDetails = function ()
        {
                   swal({
        title: 'Loading...',
        // text: 'Still API Calling .',
        showCancelButton: false,
        showConfirmButton: false
    }).then( $http({
                        method: "POST",
                        url: baseURL60 + "paymenttransaction/daywisecollection", //complete transaction
                        data: $scope.daywiseCollection,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(function (response3, status) {
                        $scope.memberdata = response3.data.data;
                        var refund = [];
                        for(var i=0;i<$scope.memberdata.length;i++){
                            if($scope.memberdata[i].debit === 250){
                                refund.push($scope.memberdata[i]);
                            }
                        }
                        $scope.length = refund.length;
                    var unique = [], duplicatedata = [], sortcompletetransaction = [];
            sortcompletetransaction = $scope.memberdata ;   //its sort the array based on checkOutTime
            var map = {};

//              map.push(cardEntry);
  
            for (var i = 0; i < sortcompletetransaction.length; i++)
            {
                if(sortcompletetransaction[i].memberId.cardNum > 0){
                if (sortcompletetransaction[i].memberId.cardNum in map)                  //if card in map[index] push record the same index
                {
                    var transactions = map[sortcompletetransaction[i].memberId.cardNum];
                    transactions.push(sortcompletetransaction[i]);
                    //map[sortcompletetransaction[i].user.cardNum].transactions.push();

                } else                                                                //otherwise create a new object
                {
                    var transactions = new Array();
                    transactions.push(sortcompletetransaction[i]);

                    map[sortcompletetransaction[i].memberId.cardNum] = transactions;
                }
            }
            }
           var len = Object.keys(map).length; //to find the object length
           $scope.regularUser = [];
           for (var key in map)
            {
                var data = [];
                data = map[key];
                $scope.regularUserData = {
                    Name:data[0].memberId.Name,
                    card:data[0].memberId.cardNum,
                    count:data.length
                };
                $scope.regularUser.push($scope.regularUserData);
            }
            $scope.total = $scope.regularUser.length;
         swal.close();
                        swal("Its ready to Use");
    }));
        };
});

