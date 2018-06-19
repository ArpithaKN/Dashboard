var app = angular.module('myApp', []);
var completetransaction = [], transaction = [], member = [];
var card1, phone1,userid;
var baseURL60 = "https://www.mytrintrin.com:13060/api/";
var baseURL70 = "https://www.mytrintrin.com:13070/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
var ipURL = "http://43.251.80.79:13080/api/";              //to unlock and create a checkouts record,transactions
var tempURL = "http://43.251.80.79:13060/api/";
var todayDate = new Date(); //current date
var valdity, statuses, swal;
app.controller('customersCtrl', function ($scope, $http) {
    $scope.findcard = function (card)                                      //Find member details using CARDNUMBER
    {
card1 = parseInt(card, 10);
//        var data = {
//            name: card
//        };
swal({
        title: 'Loading...',
        // text: 'Still API Calling .',
        showCancelButton: false,
        showConfirmButton: false
    }).then(
        $http({
            method: "GET",
            url: baseURL70 + "users/search/"+card1,                 //Take a particular member details
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.memberData = response2.data.data;
        member = $scope.memberData;
        
        for (var i = 0; i < member.length; i++)
        {
                $scope.name1 = member[i].Name + '  ' + member[i].lastName;            //member Name
                $scope.balance = member[i].creditBalance;                                 //member balance
                $scope.phone = member[i].phoneNumber;                                 //member phonenumber
                $scope.card = member[i].cardNum;
                $scope.emailid = member[i].email;
                $scope.statuscolour = member[i].status;
                $scope.memberprofilePic = imgsrc + member[i].UserID + '/' + member[i].profilePic + '.png';   //member profilepic 
                $scope.lastmodified = member[i].lastModifiedAt;		
                statuses = member[i].status;
                valdity = member[i].validity;
                userid = member[i].UserID;
                origin = member[i]._type;
                break;
        }
        if ($scope.balance < 0)
                swal("Negative Balance\n" + $scope.balance);
            else if ($scope.bal === 0)
                swal("Zero Balance\n" + $scope.balance);
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
            }
            else if ((statuses === -3) || (valdate < todayDate))
            {
                $scope.status = "Valdity Expired ";
                $scope.statuscolor = -3;
                sweetAlert($scope.status);
            }
             else if (statuses === 1)
            {
                $scope.status = " Registered ";
                $scope.statuscolor = 1;
            } 
        $http({
            method: "GET",
            url: baseURL70 + "transactions/myrides/all/" + card1, //complete transaction
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response3, status) {
            $scope.completeData = response3.data.data;
            completetransaction = $scope.completeData;
            $scope.completetransactiondata = completetransaction;
            $scope.count = $scope.completetransactiondata.length;
		 swal.close();
        });
        $http({
        method: "GET",
        url: baseURL60 + "transactions/checkout/card/"+card1, //Open CheckOuts
        data: '',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response4, status) {
                $scope.transactionsData = response4.data.data;
                transaction = $scope.transactionsData;
                $scope.transaction1 = transaction;
             
            });
        }));
    };
//      $scope.delete = function (id) {                              // Delete CompeteTransaction
//        id1 = 'transactions/correction/' + id;
//        $http({
//            method: 'DELETE',
//            url: baseURL60 + id1,
//            data: '',
//            headers: {
//                "Content-Type": "application/json"
//            }
//        }).then(function (response2, status) {
//            $scope.CompeteTransactionData = response2.data;
//            deletetransaction = $scope.CompeteTransactionData.message;
//            sweetAlert($scope.CompeteTransactionData.message);
//            var index ;
//             for(var i=0;i<completetransaction.length;i++)
//                if(id===completetransaction[i]._id)
//                    index = i;
//                completetransaction.splice(index, 1);
//                $scope.completetransactiondata = completetransaction;
//                $scope.balance = completetransaction[0].creditBalance;
//                $scope.count = $scope.completetransactiondata.length;
//                if(completetransaction.length<=0)
//                    $scope.balance = 50;
//        });
//    };
    $scope.deleteTransaction = function (id) {                                //Delete OpenTransaction in SDC
        id1 = 'transactions/' + id;
        $http({
            method: 'DELETE',
            url: baseURL60 + id1,
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.deleteTransactionData = response2.data;
                        var index ;
             for(var i=0;i<transaction.length;i++)
                if(id===transaction[i]._id)
                    index = i;
            transaction.splice(index, 1);
            $scope.transaction1 = transaction;
            sweetAlert($scope.deleteTransactionData.message);
        });
    };
    
     $scope.closeTransaction = function (id) {                                //close OpenTransaction in SDC
        id1 = 'transactions/checkout/close/' + id;
        $http({
            method: 'PUT',
            url: baseURL60 + id1,
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.deleteTransactionData = response2.data;
                        var index ;
             for(var i=0;i<transaction.length;i++)
                if(id===transaction[i]._id)
                    index = i;
            transaction.splice(index, 1);
            $scope.transaction1 = transaction;
            sweetAlert($scope.deleteTransactionData.message);
        });
    };
    
     $scope.CreditData = function (card,balance) {                     //balance update
        var data = {
            credit: balance
        };
        $http({
            method: "PUT",
            url:baseURL60+'member/'+card+'/credit/correction',
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.creditData = response2.data.message;
            sweetAlert($scope.creditData);

        });
    };
    $scope.removeTagOnBackspace = function (event, card) {                //backSpace function
        if (card.length <= 1) {
            if (event.keyCode === 8) {
                clearall();
                document.getElementById('demo1').style.display = "none";
            }
        }
        document.getElementById('demo1').style.display = "block";
    };
    $scope.EmailUpdate = function (mailid)                                      //To update a Email id
    {
        //sweetAlert(mailid+userid);
        var mail = {
            email: mailid
        };
        $http({
            method: "PUT",
            url:baseURL60+"member/email/"+userid,
            data: mail,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.emailData = response2.data.message;
            sweetAlert($scope.emailData);
        }, function(response) {
        sweetAlert(response.data.message);
    });
    };
     function clearall()
    {
        $scope.name1 = '';
        $scope.name = '';
        $scope.balance = '';
        $scope.phone = '';
        $scope.memberprofilePic = 'th.jpg';
        $scope.status = '';
        $scope.completetransactiondata = [];
        $scope.transaction1 = [];
        $scope.count = '';
        $scope.emailid = '';
        $scope.valid = '';
        $scope.lastmodified = '';
        userid ='';
        document.getElementById('onfocus1').focus();
    };
    
     $scope.recordUpdae = function (data,lastBalance,checkInTimeValues) {
//        data.creditBalance = data.creditBalance + 5;	
       alert(checkInTimeValues);
       if(checkInTimeValues !== undefined){
         data.checkInTime =  checkInTimeValues; 
       }
       var checkOutTime = data.checkOutTime;
       var checkInTime = data.checkInTime;
       checkOutTime = new Date(checkOutTime);
       checkInTime = new Date(checkInTime);
       var duration = checkInTime.getTime() - checkOutTime.getTime();
       data.duration = (duration / 60000); //converting a seconds to Hours
       if(data.duration < 31){
           data.creditsUsed = 0;
           data.creditBalance = lastBalance - 0;
       }else if(data.duration < 61){
           data.creditsUsed = 5;
           data.creditBalance = lastBalance - 5;
       }else if(data.duration < 121){
           data.creditsUsed = 15;
           data.creditBalance = lastBalance - 15;
       }else if(data.duration < 181){
           data.creditsUsed = 35;
           data.creditBalance = lastBalance -35;
       }else if(data.duration < 241){
           data.creditsUsed = 65;
           data.creditBalance = lastBalance - 65;
       }else if(data.duration < 361){
           data.creditsUsed = 95;
           data.creditBalance = lastBalance - 95;
       }else if(data.duration < 481){
           data.creditsUsed = 120;
           data.creditBalance = lastBalance - 120;
       }else if(data.duration < 720){
           data.creditsUsed = 145;
           data.creditBalance = lastBalance - 145;
       }else if(data.duration > 720){
           data.creditsUsed = 245;
           data.creditBalance = lastBalance - 245;
       }
      var balance = data.creditBalance;
       $http({
            method: "PUT",
            url: baseURL60 + "transactions/"+data._id, //complete transaction
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
//            $scope.completeData = response2.data.data;
            sweetAlert(response2.data.message);
            var data = {
            credit: balance
        };
        $http({
            method: "PUT",
            url:baseURL60+'member/'+card1+'/credit/correction',
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.creditData = response2.data.message;
            sweetAlert($scope.creditData);

        });
        },function (response) {
            sweetAlert(response.data.message);
             
        });
       
    };
});


  
