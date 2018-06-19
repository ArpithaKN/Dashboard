var app = angular.module('myApp', []);
var completetransaction = [];
var baseURL = "https://www.mytrintrin.com:13060/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
//var tempURL = "http://43.251.80.79:13080/api/";              //to unlock and create a checkouts record,transactions
var ipURL = "http://43.251.80.79:13090/api/";      //unlock,create a checkout and opentransaction and delete opentransaction      
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
        $http({
            method: "POST",
            url: baseURL + "transactions/completed", //complete transaction
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
            $scope.singlecount1 = $scope.filt.length;
            $scope.lessthanmin = $scope.filt1.length;
          swal.close();
        },function (response) {
            sweetAlert(response.data.message);
        });
    };
    $scope.selectedList = function (selected, id) {
        //idlist = [];
        var idx = idlist.indexOf(id);
        if (selected) {

            idlist.push(id);
        } else
        {
            idlist.splice(idx, 1);
        }
    };


    $scope.delete = function () {                                          //delete the opentransaction in sdc
        for (var i = 0; i < idlist.length; i++)
        {
//            id1 = 'transactions/correction/' + id;
            $http({
                method: 'DELETE',
                url: baseURL + 'transactions/correction/' + idlist[i],
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response2, status) {
                $scope.opentransactionsdelete = response2.data.message;
                sweetAlert($scope.opentransactionsdelete);
            });
        }
    };
});




















