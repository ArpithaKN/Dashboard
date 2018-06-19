var app = angular.module('myApp', []);
var completetransaction = [], opentransaction = [], memberDetails = [], dockingStationInformation = [], ports = [], vehicle1 = [], transationarray = [];
var ip, portsid, card1, phone1, userId, vehicleuid, stationname;
var baseURL60 = "https://www.mytrintrin.com:13060/api/";
var ipURL80 = "http://43.251.80.79:13080/api/"; //ports checkin, UMclear,bridge clear,unlock
var ipURL60 = "http://43.251.80.79:13060/api/"; //ports checkin, UMclear,bridge clear,unlock
var baseURL70 = "https://www.mytrintrin.com:13070/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
var tempURL80 = "http://43.251.80.79:14090/api/";              //to unlock and create a checkouts record,transactions
var ipURL90 = "http://43.251.80.79:13090/api/";      //unlock,create a checkout and opentransaction and delete opentransaction      
var todayDate = new Date(); //current date
var oldcycles = [];
var SID,CRFID,VRFID;//Socket Unlock
var valdity, statuses, swal, origin;
var dockingStatus, memberStatus, _id;          //to set a flag(if its true it allows to unlock and checkout create)
var ipstatus, unitstatus, portstatus, vehiclestatus, userstatus; //to set a flag(if its true it allows to unlock and checkout create)
app.controller('customersCtrl', function ($scope, $http) {
    
    
       $scope.findcard = function (card)                                      //Find member details using CARDNUMBER
    {
        card1 = parseInt(card, 10);
        if(card1 > 0){
        $http({
            method: "GET",
            url: baseURL70 + "users/search/" + card1, //Take a particular member details
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.memberData = response2.data.data;
            memberDetails = $scope.memberData;
            memberStatus = 1;
            if ($scope.memberData.length > 0)
            {
                for (var i = 0; i < memberDetails.length; i++)
                {
                    if (memberDetails[i].cardNum === card1)
                    {
                        $scope.name1 = memberDetails[i].Name + '  ' + memberDetails[i].lastName;            //member Name
                        $scope.bal = memberDetails[i].creditBalance;                                 //member balance
                        $scope.phone = memberDetails[i].phoneNumber;                                 //member phonenumber
                        $scope.card = memberDetails[i].cardNum;
                        $scope.userID = memberDetails[i].UserID;
                        userId = memberDetails[i].UserID;
                        $scope.statuscolour = memberDetails[i].status;
                        $scope.memberprofilePic = imgsrc + memberDetails[i].UserID + '/' + memberDetails[i].profilePic + '.png';   //member profilepic 
                        statuses = memberDetails[i].status;
                        valdity = memberDetails[i].validity;
                        origin = memberDetails[i]._type;
                        CRFID = memberDetails[i].smartCardNumber;
                        _id = memberDetails[i]._id;
                        break;
                    }
                }
                if ($scope.bal < 0)
                    swal("Negative Balance\n" + $scope.bal);
                else if ($scope.bal === 0)
                    swal("Zero Balance\n" + $scope.bal);
                var valdate = new Date(valdity);
                var vdate = valdate.getDate();
                var vmonth = valdate.getMonth() + 1;
                var vyear = valdate.getFullYear();
                $scope.valid = vdate + "-" + vmonth + "-" + vyear;
                if (statuses === 0)
                {
                    $scope.status = "Prospective";
                    $scope.statuscolor = 0;
                    sweetAlert("MemberShip" + " " + $scope.status);
                } else if (statuses === -1)
                {
                    $scope.status = "Cancelled";
                    $scope.statuscolor = -1;
                    sweetAlert("MemberShip" + " " + $scope.status);
                } else if (statuses === -2)
                {
                    $scope.status = "Suspended";
                    $scope.statuscolor = -2;
                    swal({
                      title: "MemberShip" + " " + $scope.status, 
                      html: "<span style=\"color: red;\"><b>"+memberDetails[i].comments+"</b></span>"
                     });
//                    sweetAlert("MemberShip" + " " + $scope.status+"\n"+memberDetails[i].comments);
                    
                } else if ((statuses === -3) || (valdate < todayDate))
                {
                    $scope.status = "Valdity Expired ";
                    $scope.statuscolor = -3;
                    sweetAlert($scope.status);
                } else if (statuses === 1)
                {
                    $scope.status = " Registered ";
                    $scope.statuscolor = 1;
                }
                
                
            } else
                sweetAlert("Invalid card Number");
        }, function errorCallback(response) {
            sweetAlert(response.data.message);
        });
    }
    else{
        sweetAlert("Enter a card Number");
    }
    };

    
    
    $scope.findphone = function (phone)                           //Find member details using Phonenumber
    {
        phone1 = "91-" + phone;
        var data = {
            name: phone1
        };
        $http({
            method: "POST",
            url: baseURL60 + "users/search", //Take a particular member details
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.memberData = response2.data.data;
            memberDetails = $scope.memberData;
            memberStatus = 1;
            if ($scope.memberData.length > 0)
            {
                for (var i = 0; i < memberDetails.length; i++)
                {
                    if (memberDetails[i].phoneNumber === phone1)
                    {
                        $scope.name1 = memberDetails[i].Name + '  ' + memberDetails[i].lastName;            //member Name
                        $scope.bal = memberDetails[i].creditBalance;                                 //member balance
                        $scope.phone = memberDetails[i].phoneNumber;                                 //member phonenumber
                        $scope.card = memberDetails[i].cardNum;
                         $scope.userID = memberDetails[i].UserID;
                        userId = memberDetails[i].UserID;
                        $scope.statuscolour = memberDetails[i].status;
                        $scope.memberprofilePic = imgsrc + memberDetails[i].UserID + '/' + memberDetails[i].profilePic + '.png';   //member profilepic 
                        statuses = memberDetails[i].status;
                        valdity = memberDetails[i].validity;
                        origin = memberDetails[i]._type;
                        CRFID = memberDetails[i].smartCardNumber;
                        _id = memberDetails[i]._id;
                        break;
                    }
                }
                card1 = $scope.card;
                if ($scope.bal < 0)
                    swal("Negative Balance\n" + $scope.bal);
                else if ($scope.bal === 0)
                    swal("Zero Balance\n" + $scope.bal);
                var valdate = new Date(valdity);
                var vdate = valdate.getDate();
                var vmonth = valdate.getMonth() + 1;
                var vyear = valdate.getFullYear();
                $scope.valid = vdate + "-" + vmonth + "-" + vyear;
                if (statuses === 0)
                {
                    $scope.status = "Prospective";
                    $scope.statuscolor = 0;
                    sweetAlert("MemberShip" + " " + $scope.status);
                } else if (statuses === -1)
                {
                    $scope.status = "Cancelled";
                    $scope.statuscolor = -1;
                    sweetAlert("MemberShip" + " " + $scope.status);
                } else if (statuses === -2)
                {
                    $scope.status = "Suspended";
                    $scope.statuscolor = -2;
                    sweetAlert("MemberShip" + " " + $scope.status);
                } else if ((statuses === -3) || (valdate < todayDate))
                {
                    $scope.status = "Valdity Expired";
                    $scope.statuscolor = -3;
                    sweetAlert($scope.status);
                } else if (statuses === 1)
                {
                    $scope.status = " Registered ";
                    $scope.statuscolor = 1;
                }
            } else
                sweetAlert("Invalid Phone Number");
        }, function errorCallback(response) {
            sweetAlert("Invalid Phone Number\n"+response.data.message);
        });
    };
    $scope.removeTagOnBackspace = function (event, card) {                //backSpace function
        if (card.length <= 1) {
            if (event.keyCode === 8) {
                $scope.card = '';
                $scope.unit = '';
                $scope.port = '';
                $scope.cyclenumber = '';
                $scope.phoneNumber = '';
                $scope.name1 = '';
                $scope.name = '';
                $scope.bal = '';
                $scope.phone = '';
                $scope.memberprofilePic = 'th.jpg';
                $scope.status = '';
                $scope.completetransactiondata = [];
                $scope.trans = [];
                $scope.count = '';
                $scope.valid = '';
                $scope.opencheckoutcount = '';
//                $scope.trans = [];
                document.getElementById('demo1').style.display = "none";
              
            }
        }
        document.getElementById('demo1').style.display = "block";
    };
 
    function clearall()
    {
        $scope.card = '';
        $scope.unit = '';
        $scope.port = '';
        $scope.cyclenumber = '';
        $scope.name1 = '';
        $scope.name = '';
        $scope.bal = '';
        $scope.phone = '';
        $scope.memberprofilePic = 'th.jpg';
        $scope.status = '';
        $scope.completetransactiondata = [];
        $scope.trans = [];
        $scope.count = '';
        $scope.valid = '';
        $scope.opencheckoutcount = '';
        // ipstatus = 0;
        document.getElementById('onfocus1').focus();
    };
 
$scope.submit = function ()            //to port clear and port checkin
    {
        var _debitAmount = document.getElementById("debitamount").value;
        var _paymentMode = document.getElementById("paymentMode").value;
        var _paymentThrough = document.getElementById("paymentThrough").value;
        var paymentDescription = document.getElementById("paymentDescription").value;
        var gatewayTransactionId = document.getElementById("gatewayTransactionId").value;
        _debitAmount = parseInt(_debitAmount, 10);
      $scope.RefundObject = {
        balance:0,
        comments:'Tool based refund record created: ',
        createdAt:$scope.refunddate,
        createdBy:'',
        credit:0,
        debit:_debitAmount,
        gatewayTransactionId:gatewayTransactionId,
        invoiceNo:'',
        location:'Other Location',
        memberId:_id,
        paymentDescription:'Pay Gov Refund',//paymentDescription,
        paymentMode:'Pay Gov',//_paymentMode,
        paymentThrough:'PayGov',//_paymentThrough,
        updateStatus:''
    };
    alert($scope.RefundObject.comments);
    $http({
            method: "POST",
            url: baseURL60 + "paymenttransaction/payment/reverse", //complete transaction
            data: $scope.RefundObject,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
//            alert();
             sweetAlert(response.data.data.paymentDescription+" "+"created");
        });
       
    };
});

