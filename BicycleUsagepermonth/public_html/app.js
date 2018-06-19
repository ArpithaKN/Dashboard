var app = angular.module('myApp', []);
var completetransaction = [];
var baseURL70 = "https://www.mytrintrin.com:13070/api/";
var baseURL60 = "https://www.mytrintrin.com:13060/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
var ipURL60 = "http://43.251.80.79:13060/api/";      //unlock,create a checkout and opentransaction and delete opentransaction      
var todayDate = new Date(); //current date
var dockingstation = [];
app.controller('customersCtrl', function ($scope, $http) {
    $http({
        method: "GET",
        url: baseURL70 + "vehicle", //station details
        data: '',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response1, status) {
        $scope.dockingData = response1.data.data;
        dockingstation = $scope.dockingData;
    });
    $scope.submit = function (fromdateinput, todate)
    {
        var completedata = {
            fromdate: fromdateinput,
            todate: todate,
            duration:0
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

            var  sortcompletetransaction = [];
            sortcompletetransaction = _.sortBy(completetransaction, 'checkOutTime');    //its sort the array based on checkOutTime
            var map = {};
//            for (var i = 0; i < dockingstation.length; i++)
//            {
//                map[dockingstation[i].vehicleNumber];
//            }
//            var len = Object.keys(map).length;
//              map.push(cardEntry);
            for (var i = 0; i < sortcompletetransaction.length; i++)
            {
                if (sortcompletetransaction[i].vehicle.vehicleNumber in map)                  //if card in map[index] push record the same index
                {
                    var transactions = map[sortcompletetransaction[i].vehicle.vehicleNumber];
                    transactions.push(sortcompletetransaction[i]);
                    //map[sortcompletetransaction[i].user.cardNum].transactions.push();

                } else                                                                //otherwise create a new object
                {
                    var transactions = new Array();
                    transactions.push(sortcompletetransaction[i]);

                    map[sortcompletetransaction[i].vehicle.vehicleNumber] = transactions;
                }
            }
             for (var i = 0; i < dockingstation.length; i++)
            {
                if (dockingstation[i].vehicleNumber in map)                  //if card in map[index] push record the same index
                {
//                    var transactions = map[dockingstation[i].vehicleNumber];
//                    transactions.push('');
                    //map[sortcompletetransaction[i].user.cardNum].transactions.push();

                } else                                                                //otherwise create a new object
                {
                    var transactions = new Array();
                     var vehicle = {
                  vehicle:dockingstation[i].vehicleNumber,
                  duration:0,
                  count:0
                };
                    transactions.push(vehicle);

                    map[dockingstation[i].vehicleNumber] = transactions;
                }
            }
           var len = Object.keys(map).length; //to find the object length
 //           alert(len);
           var vehicleData = [];
            for (var key in map)
            {
                var data = [];
                data = map[key];
//                var transacionscount = data.length;
                var vehicle = {
                  vehicle:key,
                  duration:0,
                  count:0
                };
                for(var j=0;j<data.length;j++) 
                {
                    if(data[j].duration > 0.00){
                  vehicle.duration += data[j].duration;
                  vehicle.count++;
                    }
                }
                vehicleData.push(vehicle);
            }
//             for (var i = 0; i < dockingstation.length; i++)
//            {
//                if(dockingstation[i].vehicleNumber ;
//            }
            
            $scope.vehicleData = vehicleData;
          swal.close();
        },function (response) {
            sweetAlert(response.data.message);
        });
    };
});




















