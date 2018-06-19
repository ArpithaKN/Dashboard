var app = angular.module('myApp', []);
var baseURL60 = "https://www.mytrintrin.com:13060/api/";
var ipURL80 = "http://43.251.80.79:13080/api/";
var ipURL90 = "http://43.251.80.79:13090/api/";
var todayDates = new Date(); //current date
var todayDate = new Date(todayDates);
var dockingHubsName = [];        //Docking hubs name to find hourly checkouts
var userdetails = [];            //all users data(members and Employees)  
app.controller('customersCtrl', function ($scope, $http) {
    $scope.todayDate = new Date();
    $scope.date = $scope.todayDate.toLocaleDateString();
    $scope.time = $scope.todayDate.toLocaleTimeString();

    $http({
        method: "GET",
        url: ipURL90 + "users/qweuird78fj3498asdjkfhahsysd98y4rsdjhf", //To find the open transactions
        data: '',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response1, status) {
        $scope.userData = response1.data.data;
        userdetails = $scope.userData;
        $http({
            method: "GET",
            url: baseURL60 + "dockstation", //dockstation to find the cyclecount in every station
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.myData = response.data.data;
            dockingHubsName = $scope.myData;
            var checkoutdata = {
                fromdate: todayDate,
                todate: todayDate
            };
            $http({
                method: "POST",
                url: ipURL80 + "transactions/all/checkout/bydate", //complete transaction
                data: checkoutdata,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response3, status) {
                $scope.checkouts = response3.data.data;
                var checkouts = [];                                       //to store the response data
                checkouts = $scope.checkouts;
                var hourlytotal = [];                                   //Store all the hours total count
                var nonOperationalhourscheckoutemployee = [];                   // to store the non operational hours data
                var nonOperationalhourscheckoutMember = [];
                for (var j = 6; j < 20; j++)
                {
                    var hoursEntry = {//to count hourly       
                        time: j + "-" + (j + 1),
                        counts: 0

                    };
                    hourlytotal.push(hoursEntry);
                }
                var StationHourlyCheckouts = [];                             //Store all the stations hourly counts

                for (i = 0; i < dockingHubsName.length; i++)
                {
                    var hourlycounts = [];                                   //hourly checkout counts
                    for (var j = 6; j < 20; j++)
                    {
                        var hoursEntry = {//to count hourly  in stationwise    
                            time: j + "-" + (j + 1),
                            count: 0

                        };
                        hourlycounts.push(hoursEntry);
                    }
                    var total = 0;
                    var Name = dockingHubsName[i].name;
                    for (k = 0; k < checkouts.length; k++) {
                        var checkout = checkouts[k].checkouttime;
                        checkout = new Date(checkout);
                        var index = checkout.getHours();
                        index = index - 6;
                        if (Name === checkouts[k].stationName)
                        {
                            if ((index >= 0) && (index < 14))
                            {
                                if (checkouts[k].origin === "techSupport")
                                {
                                    hourlycounts[index].count++;
                                    hourlytotal[index].counts++;
                                    total++;
                                }
                            } else {
                                for (var n = 0; n < userdetails.length; n++) {
                                    if (checkouts[k].user === userdetails[n].UserID)
                                    {
                                        if (userdetails[n]._type === 'member')
                                        {
                                            if (checkouts[k].origin === "techSupport")
                                            {
                                                var nonoperationEntery = {//to store the nonoperational hours data 
                                                    stationname: checkouts[k].stationName,
                                                    checkouttime: checkouts[k].checkouttime,
                                                    orign: checkouts[k].origin,
                                                    card: userdetails[n].cardNum,
                                                    name: userdetails[n].Name
                                                };
                                                nonOperationalhourscheckoutMember.push(nonoperationEntery);
                                            }
                                        } else {
                                            if (checkouts[k].origin === "techSupport")
                                            {
                                                var nonoperationEntery = {//to store the nonoperational hours data 
                                                    stationname: checkouts[k].stationName,
                                                    checkouttime: checkouts[k].checkouttime,
                                                    orign: checkouts[k].origin,
                                                    card: userdetails[n].cardNum,
                                                    name: userdetails[n].Name
                                                };
                                                nonOperationalhourscheckoutemployee.push(nonoperationEntery);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    var stationhours = {//to store station information(hourly counts,name and toatalcount) 
                        name: Name,
                        hours: hourlycounts,
                        total: total
                    };
                    StationHourlyCheckouts.push(stationhours);
                }
                $scope.hourlycheckouts = StationHourlyCheckouts;
                $scope.totalcount = 0;
                for (var i = 0; i < StationHourlyCheckouts.length; i++)
                {
                    $scope.totalcount += StationHourlyCheckouts[i].total;         //to find overall checkouts
                }
                $scope.nonoperationalhours = nonOperationalhourscheckoutemployee;
                $scope.employeecount = nonOperationalhourscheckoutemployee.length;
                $scope.nonoperationalhoursMebers = nonOperationalhourscheckoutMember;
                $scope.membercount = nonOperationalhourscheckoutMember.length;
//                    var limithours = [];
//                    for (var i = 0; i < hourlytotal.length; i++)
//                    {
//                        if((i>0)&&(i<17))
//                        limithours.push(hourlytotal[i]);
//                    }
                $scope.hourlyTotals = hourlytotal;
            });
        });
    });


    $scope.hourlycheckoutcounts = function (fromdate, todate)
    {
        var data = {
            fromdate: fromdate,
            todate: todate
        };
        swal({
            title: 'Loading...',
            showCancelButton: false,
            showConfirmButton: false
        }).then(
                $http({
                    method: "POST",
                    url: ipURL80 + "transactions/all/checkout/bydate", //complete transaction
                    data: data,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response3, status) {
            $scope.checkouts = response3.data.data;
            var StationHourlyCheckouts = [];
            var checkouts = [];
            checkouts = $scope.checkouts;
//            var hours = [];
//            for (k = 0; k < checkouts.length; k++) {
//                var checkout = checkouts[k].checkouttime;
//                        checkout = new Date(checkout);
//                        var index = checkout.getHours();
//                        hours.push(index);
//            }
//            var max = Math.max(...hours);
//             var min = Math.min(...hours);
            var hourlytotal = [], nonOperationalhourscheckoutemployee = [], nonOperationalhourscheckoutMember = [];
            for (var j = 6; j < 20; j++)
            {
                var hoursEntry = {
                    time: j + "-" + (j + 1),
                    counts: 0

                };
                hourlytotal.push(hoursEntry);
            }


            for (i = 0; i < dockingHubsName.length; i++)
            {
                var hourlycounts = [];
                for (var j = 6; j < 20; j++)
                {
                    var hoursEntry = {
                        time: j + "-" + (j + 1),
                        count: 0

                    };
                    hourlycounts.push(hoursEntry);

                }
                var total = 0;
                //                    var len = hourlycounts.length;
                var Name = dockingHubsName[i].name;
                for (k = 0; k < checkouts.length; k++) {
                    var checkout = checkouts[k].checkouttime;
                    checkout = new Date(checkout);
                    var index = checkout.getHours();
                    index = index - 6;
                    if (Name === checkouts[k].stationName)
                    {
                        if ((index >= 0) && (index < 14))
                        {
                            if (checkouts[k].origin === "techSupport")
                            {
                                hourlycounts[index].count++;
                                hourlytotal[index].counts++;
                                total++;
                            }
                        } else {
                            for (var n = 0; n < userdetails.length; n++) {
                                if (checkouts[k].user === userdetails[n].UserID)
                                {
                                    if (userdetails[n]._type === 'member')
                                    {
                                        if (checkouts[k].origin === "techSupport")
                                        {
                                            var nonoperationEntery = {//to store the nonoperational hours data 
                                                stationname: checkouts[k].stationName,
                                                checkouttime: checkouts[k].checkouttime,
                                                orign: checkouts[k].origin,
                                                card: userdetails[n].cardNum,
                                                name: userdetails[n].Name
                                            };
                                            nonOperationalhourscheckoutMember.push(nonoperationEntery);
                                        }
                                    } else {
                                        if (checkouts[k].origin === "techSupport")
                                        {
                                            var nonoperationEnteryEmp = {//to store the nonoperational hours data 
                                                stationname: checkouts[k].stationName,
                                                checkouttime: checkouts[k].checkouttime,
                                                orign: checkouts[k].origin,
                                                card: userdetails[n].cardNum,
                                                name: userdetails[n].Name
                                            };
                                            nonOperationalhourscheckoutemployee.push(nonoperationEnteryEmp);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                var stationhours = {
                    name: Name,
                    hours: hourlycounts,
                    total: total
                };
                StationHourlyCheckouts.push(stationhours);
            }
            $scope.hourlycheckouts = StationHourlyCheckouts;
            $scope.totalcount = 0;
            for (var i = 0; i < StationHourlyCheckouts.length; i++)
            {
                $scope.totalcount += StationHourlyCheckouts[i].total;
            }
            $scope.nonoperationalhours = nonOperationalhourscheckoutemployee;
            $scope.employeecount = nonOperationalhourscheckoutemployee.length;
            $scope.nonoperationalhoursMebers = nonOperationalhourscheckoutMember;
            $scope.membercount = nonOperationalhourscheckoutMember.length;
//            var limithours = [];
//                    for (var i = 0; i < hourlytotal.length; i++)
//                    {
//                        if((i>0)&&(i<17))
//                        limithours.push(hourlytotal[i]);
//                    }
            $scope.hourlyTotals = hourlytotal;
            swal.close();
        }));
    };
});
