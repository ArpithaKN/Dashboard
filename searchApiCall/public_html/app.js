/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var app = angular.module('myApp', ['toastr']);

var baseURL60 = "https://www.mytrintrin.com:13060/api/";
var ipURL80 = "http://43.251.80.79:13080/api/"; //ports checkin, UMclear,bridge clear,unlock
var baseURL70 = "https://www.mytrintrin.com:13070/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
var tempURL80 = "http://43.251.80.79:14090/api/";              //to unlock and create a checkouts record,transactions
var ipURL90 = "http://43.251.80.79:13090/api/"; 

 app.controller('customersCtrl', function ($scope, $http,toastr) {
     kinput.onkeydown = kinput.onkeyup = kinput.onkeypress = findphone;
   $scope.findphone = function (searchData)                           //Find member details using Phonenumber
    {
//        search = 
        var data = {
            name: searchData
        };
        $http({
            method: "POST",
            url: baseURL60 + "users/search", //Take a particular member details
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.membersData = response2.data.data;
            memberDetails = $scope.membersData;
            memberStatus = 1;
//            if ($scope.membersData.length > 0)
//            {
//                for (var i = 0; i < memberDetails.length; i++)
//                {
//                    if (memberDetails[i].phoneNumber === phone1)
//                    {
//                    a
//                        $scope.name1 = memberDetails[i].Name + '  ' + memberDetails[i].lastName;            //member Name
//                        $scope.bal = memberDetails[i].creditBalance;                                 //member balance
//                        $scope.phone = memberDetails[i].phoneNumber;                                 //member phonenumber
//                        $scope.card = memberDetails[i].cardNum;
//                         $scope.userID = memberDetails[i].UserID;
//                        userId = memberDetails[i].UserID;
//                        $scope.statuscolour = memberDetails[i].status;
//                        $scope.memberprofilePic = imgsrc + memberDetails[i].UserID + '/' + memberDetails[i].profilePic + '.png';   //member profilepic 
//                        statuses = memberDetails[i].status;
//                        valdity = memberDetails[i].validity;
//                        origin = memberDetails[i]._type;
//                        CRFID = memberDetails[i].smartCardNumber;
//                        break;
//                    }
//                }
//                card1 = $scope.card;
//                if ($scope.bal < 0)
//                    swal("Negative Balance\n" + $scope.bal);
//                else if ($scope.bal === 0)
//                    swal("Zero Balance\n" + $scope.bal);
//                var valdate = new Date(valdity);
//                var vdate = valdate.getDate();
//                var vmonth = valdate.getMonth() + 1;
//                var vyear = valdate.getFullYear();
//                $scope.valid = vdate + "-" + vmonth + "-" + vyear;
//                if (statuses === 0)
//                {
//                    $scope.status = "Prospective";
//                    $scope.statuscolor = 0;
//                    sweetAlert("MemberShip" + " " + $scope.status);
//                } else if (statuses === -1)
//                {
//                    $scope.status = "Cancelled";
//                    $scope.statuscolor = -1;
//                    sweetAlert("MemberShip" + " " + $scope.status);
//                } else if (statuses === -2)
//                {
//                    $scope.status = "Suspended";
//                    $scope.statuscolor = -2;
//                    sweetAlert("MemberShip" + " " + $scope.status);
//                } else if ((statuses === -3) || (valdate < todayDate))
//                {
//                    $scope.status = "Valdity Expired";
//                    $scope.statuscolor = -3;
//                    sweetAlert($scope.status);
//                } else if (statuses === 1)
//                {
//                    $scope.status = " Registered ";
//                    $scope.statuscolor = 1;
//                }
//               
//                
//            } else
//                sweetAlert("Invalid Phone Number");
        }, function errorCallback(response) {
            sweetAlert("Invalid Phone Number\n"+response.data.message);
        });
    };
});