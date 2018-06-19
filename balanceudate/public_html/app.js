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
        $http({
            method: "POST",
            url: baseURL60 + "transactions/completed", //complete transaction
            data: completedata,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response3, status) {
            $scope.completeData = response3.data.data;
            $scope.total = $scope.completeData.length;
            var completetransaction = [];
//            completetransaction = $scope.completeData;
            for(var i=0;i<$scope.completeData.length;i++){
                if(($scope.completeData[i].user.Name !== 'Prime Test') && ($scope.completeData[i].user.Name !=='Prime Test 2'))
                {
                    completetransaction.push($scope.completeData[i]);
                }
            }

            var unique = [], duplicatedata = [], sortcompletetransaction = [];
            sortcompletetransaction = _.sortBy(completetransaction, 'checkOutTime');    //its sort the array based on checkOutTime
            var map = {};

//              map.push(cardEntry);
            for (var i = 0; i < sortcompletetransaction.length; i++)
            {
                if (sortcompletetransaction[i].user.cardNum in map)                  //if card in map[index] push record the same index
                {
                    var transactions = map[sortcompletetransaction[i].user.cardNum];
                    transactions.push(sortcompletetransaction[i]);
                    //map[sortcompletetransaction[i].user.cardNum].transactions.push();

                } else                                                                //otherwise create a new object
                {
                    var transactions = new Array();
                    transactions.push(sortcompletetransaction[i]);

                    map[sortcompletetransaction[i].user.cardNum] = transactions;
                }
            }
           var len = Object.keys(map).length; //to find the object length
//            var len = (Object.keys(map).length);
//            alert(len);
            var multipletransaction = {}, singletransaction = {};
            for (var i = 0; i < sortcompletetransaction.length; i++)
            {
                for (var j = 0; j < map[sortcompletetransaction[i].user.cardNum].length; j++)
                {
                    if (map[sortcompletetransaction[i].user.cardNum].length > 1)
                        multipletransaction[sortcompletetransaction[i].user.cardNum] = map[sortcompletetransaction[i].user.cardNum];
                    else
                        singletransaction[sortcompletetransaction[i].user.cardNum] = map[sortcompletetransaction[i].user.cardNum];
                }
            }

            for (var key in multipletransaction)
            {
                var data = [];
                data = multipletransaction[key];
                var transacionscount = data.length;
//                for(var j=0;j<data.length-1;j++) 
                var j = 0;
                while (transacionscount)
                {
//                    var temp = data[j].checkOutTime;
//                     if (data.indexOf(temp) === -1) {
//                    duplicatedata.push(data[j]);;
//                } else {
//                   unique.push(data[j]);
//                }
                    if (transacionscount !== 1) {
                        if (data[j].checkOutTime === data[j + 1].checkOutTime)
                        {
                            duplicatedata.push(data[j]);
                            duplicatedata.push(data[j + 1]);
                            transacionscount -= 2;
                            j += 1;
                        } else {
                            unique.push(data[j]);
                            transacionscount--;
                            j++;
                        }
                    } else {
                        unique.push(data[j]);
                        transacionscount--;
                        j++;
                    }
                }
//                unique.push(data[len]);
            }
            var dupes = [];
            for (var j = 0; j < duplicatedata.length; j++)
            {
                var dataEntry = {
                    card: duplicatedata[j].user.cardNum,
                    checkOutTime: duplicatedata[j].checkOutTime,
                    from: duplicatedata[j].fromPort.Name,
                    checkInTime: duplicatedata[j].checkInTime,
                    to: duplicatedata[j].toPort.Name,
                    vehicle: duplicatedata[j].vehicle.vehicleNumber,
                    id: duplicatedata[j]._id
                };
                dupes.push(dataEntry);
            }
//            }
            $scope.multi = dupes;
            $scope.multicount = dupes.length;

//            $scope.multicount = $scope.multi.length;
            for (var key in singletransaction)
            {
                var data = [];
                data = singletransaction[key];
                for (var j = 0; j < data.length; j++)
                {
                    unique.push(data[j]);
                }
            }
            $scope.single = unique;
            $scope.singlecount = $scope.single.length;
            $scope.filt = [];
            $scope.filt1 = [];
            $scope.dur = 0;
            $scope.usagecharge = 0;
            for (var j = 0; j < unique.length; j++) {
                if (min <= unique[j].duration && unique[j].duration < max)
                {
                    if (unique[j].user.cardNum !== 83)
                    {
                    if (unique[j].checkOutTime < unique[j].checkInTime)
                    {
                        $scope.filt.push(unique[j]);
                        $scope.usagecharge += unique[j].creditsUsed;
                    }
                }else if (min > unique[j].duration){
                  $scope.filt1.push(unique[j]);  
                }
                $scope.dur = $scope.dur + unique[j].duration;
            }
            }
            $scope.singlecount1 = $scope.filt.length;
            $scope.lessthanmin = $scope.filt1.length;
          swal.close();
        },function (response) {
            sweetAlert(response.data.message);
        });
    };
    
    
    
    
    
    
    $scope.recordUpdae = function (data)                                      //Find member details using CARDNUMBER
    {
card1 = parseInt(data.user.cardNum, 10);
//        var data = {
//            name: card
//        };
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
        var lastBalance;
        for (var i = 0; i < member.length; i++)
        {
            $scope.name1 = member[i].Name + '  ' + member[i].lastName;            //member Name
            lastBalance = member[i].creditBalance;                                 //member balance
            $scope.phone = member[i].phoneNumber;                                 //member phonenumber
            $scope.card = member[i].cardNum;
        }
        var updateBal = lastBalance + data.creditsUsed;
        var checkOutTime = data.checkOutTime;
       var checkInTime = data.checkOutTime;
       checkOutTime = new Date(checkOutTime);
       checkInTime = new Date(checkInTime);
       var randomMin = Math.random() * (28 - 17) + 17;
      checkInTime.setMinutes ( checkInTime.getMinutes() + randomMin);
       var duration = checkInTime.getTime() - checkOutTime.getTime();
       data.duration = (duration / 60000); //converting a seconds to Hours
       if(data.duration < 31){
           data.creditsUsed = 0;
           data.creditBalance = updateBal - 0;
       }else if(data.duration < 61){
           data.creditsUsed = 5;
           data.creditBalance = updateBal - 5;
       }else if(data.duration < 121){
           data.creditsUsed = 15;
           data.creditBalance = updateBal - 15;
       }else if(data.duration < 181){
           data.creditsUsed = 35;
           data.creditBalance = updateBal -35;
       }else if(data.duration < 241){
           data.creditsUsed = 65;
           data.creditBalance = updateBal - 65;
       }else if(data.duration < 361){
           data.creditsUsed = 95;
           data.creditBalance = updateBal - 95;
       }else if(data.duration < 481){
           data.creditsUsed = 120;
           data.creditBalance = updateBal - 120;
       }else if(data.duration < 720){
           data.creditsUsed = 145;
           data.creditBalance = updateBal - 145;
       }else if(data.duration > 720){
           data.creditsUsed = 245;
           data.creditBalance = updateBal - 245;
       }
       data.checkInTime = checkInTime;
       alert(data.creditBalance);
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
            var dataBalance = {
            credit: balance
        };
        $http({
            method: "PUT",
            url:baseURL60+'member/'+card1+'/credit/correction',
            data: dataBalance,
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
        });
    };


//       
//    };
});


  