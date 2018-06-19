var app = angular.module('myApp', []);
var baseURL60 = "https://www.mytrintrin.com:13060/api/";
var baseURL70 = "https://www.mytrintrin.com:13070/api/";
var ipURL80 = "http://43.251.80.79:13080/api/";
var ipURL90 = "http://43.251.80.79:13090/api/";
var ipURL60 = "http://43.251.80.79:13060/api/";
var todayDates = new Date(); //current date
var todayDate = new Date(todayDates);
var dockingHubsName = [];        //Docking hubs name to find hourly checkouts
var membersdetails = [];         //registred members details
var userdetails = [];            //all users data(members and Employees)  
var StationName = '';
app.controller('customersCtrl', function ($scope, $http) {
    $scope.todayDate = new Date();
    $scope.date = $scope.todayDate.toLocaleDateString();
    $scope.time = $scope.todayDate.toLocaleTimeString();
    $scope.fromdate = $scope.date;
    $scope.todate = $scope.date;
    swal({
        title: 'Loading...',
        showCancelButton: false,
        showConfirmButton: false
    }).then(
            $http({
                method: "GET",
                url: baseURL60 + "users/count/detail", //member counts
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response, status) {
        $scope.memberData = response.data.data;
        $scope.membercount = $scope.memberData.Female + $scope.memberData.Male;
        $scope.agecount = $scope.memberData.greaterthan50 + $scope.memberData.gte40lt50 + $scope.memberData.gte30lt40 + $scope.memberData.gte20lt30 + $scope.memberData.lessthan20;

        $scope.Female = ($scope.memberData.Female / $scope.membercount) * 100;
        $scope.Male = ($scope.memberData.Male / $scope.membercount) * 100;
        $scope.greaterthan50 = ($scope.memberData.greaterthan50 / $scope.agecount) * 100;
        $scope.gte40lt50 = ($scope.memberData.gte40lt50 / $scope.agecount) * 100;
        $scope.gte30lt40 = ($scope.memberData.gte30lt40 / $scope.agecount) * 100;
        $scope.gte20lt30 = ($scope.memberData.gte20lt30 / $scope.agecount) * 100;
        $scope.lessthan20 = ($scope.memberData.lessthan20 / $scope.agecount) * 100;
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
                url: baseURL60 + "transactions/completed", //complete transaction
                data: checkoutdata,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response3, status) {
                $scope.checkouts = response3.data.data;
                var complete = $scope.checkouts;
                var unique = [], duplicatedata = [], sortcompletetransaction = [];
                sortcompletetransaction = _.sortBy(complete, 'checkOutTime');    //its sort the array based on checkOutTime
                var map = {};

                for (var i = 0; i < sortcompletetransaction.length; i++)
                {
                    if (sortcompletetransaction[i].user.cardNum in map)                  //if card in map[index] push record the same index
                    {
                        var transactions = map[sortcompletetransaction[i].user.cardNum];
                        transactions.push(sortcompletetransaction[i]);

                    } else                                                                //otherwise create a new object
                    {
                        var transactions = new Array();
                        transactions.push(sortcompletetransaction[i]);

                        map[sortcompletetransaction[i].user.cardNum] = transactions;
                    }
                }
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
                    var j = 0;
                    unique.push(data[j]);
                    while (transacionscount)
                    {

                        if (transacionscount !== 1) {
                            if (data[j].checkOutTime === data[j + 1].checkOutTime)
                            {
                                duplicatedata.push(data[j + 1]);
                                transacionscount -= 2;
                                j += 1;
                            } else {
                                unique.push(data[j + 1]);
                                transacionscount--;
                                j++;
                            }
                        } else {
                            transacionscount--;
                            j++;
                        }
                    }
                }
                for (var key in singletransaction)
                {
                    var data = [];
                    data = singletransaction[key];
                    for (var j = 0; j < data.length; j++)
                    {
                        unique.push(data[j]);
                    }
                }
                var checkouts = [];                                       //to store the response data
                checkouts = unique;
//                checkouts = $scope.checkouts;
                var StationHourlyCheckouts = [], StationHourlyCheckIns = [];
                var hourlycheckouttotal = [];
                var hourlycheckintotal = [];
                for (var j = 5; j < 22; j++)
                {
                    var hoursEntry = {
                        time: j + "-" + (j + 1),
                        counts: 0

                    };
                    hourlycheckouttotal.push(hoursEntry);
                }

                for (var i = 0; i < dockingHubsName.length; i++)
                {
                    var hourlycheckoutcounts = [];
                    for (var j = 5; j < 22; j++)
                    {
                        var hoursEntry = {
                            time: j + "-" + (j + 1),
                            count: 0

                        };
                        hourlycheckoutcounts.push(hoursEntry);
                    }
                    var checkouttotal = 0;
                    //                    var len = hourlycounts.length;
                    var Name = dockingHubsName[i].name;
                    for (var k = 0; k < checkouts.length; k++) {
                        var checkout = checkouts[k].checkOutTime;
                        checkout = new Date(checkout);
                        var index = checkout.getHours();
                        index = index - 5;
                        if (Name === checkouts[k].fromPort.DockingStationName)
                        {
                            if ((index >= 0) && (index < 17))
                            {
//                                if ((5 <= checkouts[k].duration) && (checkouts[k].duration <= 500.0))
//                                {
                                    if (checkouts[k].checkOutTime < checkouts[k].checkInTime)
                                    {
                                        hourlycheckoutcounts[index].count++;
                                        hourlycheckouttotal[index].counts++;
                                        checkouttotal++;
                                    }
//                                }
                            }
                        }
                    }
                    var stationhours = {
                        name: Name,
                        hours: hourlycheckoutcounts,
                        total: checkouttotal
                    };
                    StationHourlyCheckouts.push(stationhours);
                }
                $scope.hourlycheckouts = StationHourlyCheckouts;
                $scope.totalcheckoutcount = 0;
                for (var i = 0; i < StationHourlyCheckouts.length; i++)
                {
                    $scope.totalcheckoutcount += StationHourlyCheckouts[i].total;
                }

                $scope.hourlyTotalscheckout = hourlycheckouttotal;
                for (var j = 5; j < 22; j++)
                {
                    var hoursEntry = {
                        time: j + "-" + (j + 1),
                        counts: 0

                    };
                    hourlycheckintotal.push(hoursEntry);
                }

                for (var i = 0; i < dockingHubsName.length; i++)
                {
                    var hourlycheckincounts = [];
                    for (var j = 5; j < 22; j++)
                    {
                        var hoursEntry = {
                            time: j + "-" + (j + 1),
                            count: 0

                        };
                        hourlycheckincounts.push(hoursEntry);
                    }
                    var checkintotal = 0;
                    //                    var len = hourlycounts.length;
                    var Name = dockingHubsName[i].name;
                    for (var k = 0; k < checkouts.length; k++) {
                        var checkin = checkouts[k].checkInTime;
                        checkin = new Date(checkin);
                        var checkinindex = checkin.getHours();
                        checkinindex = checkinindex - 5;
                        if (Name === checkouts[k].toPort.DockingStationName)
                        {
                            if ((checkinindex >= 0) && (checkinindex < 17))
                            {
//                                if ((5 <= checkouts[k].duration) && (checkouts[k].duration <= 500.0))
//                                {
                                    if (checkouts[k].checkOutTime < checkouts[k].checkInTime)
                                    {
                                        hourlycheckincounts[checkinindex].count++;
                                        hourlycheckintotal[checkinindex].counts++;
                                        checkintotal++;
                                    }
//                                }
                            }
                        }
                    }
                    var stationcheckinhours = {
                        name: Name,
                        hours: hourlycheckincounts,
                        total: checkintotal
                    };
                    StationHourlyCheckIns.push(stationcheckinhours);
                }
                $scope.hourlycheckins = StationHourlyCheckIns;
                $scope.totalcheckincount = 0;
                for (var i = 0; i < StationHourlyCheckIns.length; i++)
                {
                    $scope.totalcheckincount += StationHourlyCheckIns[i].total;
                }
                $scope.hourlyTotalscheckin = hourlycheckintotal;
                swal.close();
            });
        });
          $http({
                method: "GET",
                url: ipURL90 + "users/qweuird78fj3498asdjkfhahsysd98y4rsdjhf", //To get user details
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response1, status) {
                $scope.userData = response1.data.data;
                userdetails = $scope.userData;
            });
        $http({
            method: "GET",
            url: baseURL60 + "registrationcenter", //dockstation to find the cyclecount in every station
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.registrationcentersname = response.data.data;
            var data = {
                fromdate: todayDate,
                todate: todayDate,
                location: '',
                transactionType: 'Security Deposit' //'Registration'
            };

            $http({
                method: "POST",
                url: baseURL60 + "paymenttransactions/daywisecollection", //Member Details
                data: data,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response, status) {
                $scope.paymenttransactionData = response.data.data;
                membersdetails = $scope.paymenttransactionData;
                $scope.paymenttransactionDatacount = $scope.paymenttransactionData.length;
                var TrintrinRegistrationData = [];  //array for storing final trintrinregistration data
                var Mysore1RegistrationData = [];   //array for storing final mysoreregistration data
                var TrintrinRegistrationEntry = {
                    date: todayDate,
                    rto: 0,
                    palace: 0,
                    KSRTCbusStand: 0,
                    CitybusStand: 0,
                    railwaystation: 0,
                    zoo: 0,
                    bulkregistrations: 0,
                    trintrintotal: 0
                };
                TrintrinRegistrationData.push(TrintrinRegistrationEntry);
                var mysore1RegistrationEntry = {
                    date: todayDate,
                    Gokulam: 0,
                    Krishnamurthypuram: 0,
                    Nazarabad: 0,
                    RamakrishnaNagar: 0,
                    SiddarthLayout: 0,
                    NewSheshadriIyerRoad: 0,
                    OtherLocation: 0,
                    mysore1total: 0
                };
                Mysore1RegistrationData.push(mysore1RegistrationEntry);
                for (var i = 0; i < $scope.paymenttransactionData.length; i++)
                {
                    var registrationdate = $scope.paymenttransactionData[i].createdAt;
                    registrationdate = new Date(registrationdate);
                    registrationdate.setHours(00, 00, 00);
                    var fromdate = new Date(todayDate);
                    var index1 = (registrationdate - fromdate) / (1000 * 60 * 60 * 24);
                    var index = ~~index1;                  //0
                    var centerName;
                    if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[0].location)
                        centerName = "rto";
                    else if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[1].location)
                        centerName = "mrs";
                    else if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[2].location)
                        centerName = "ksrtc";
                    else if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[3].location)
                        centerName = "cbs";
                    else if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[4].location)
                        centerName = "mp";
                    else if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[5].location)
                        centerName = "mz";
                    else if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[6].location)
                        centerName = "blukregistration";
                    else if ($scope.paymenttransactionData[i].location === 'Gokulam')
                        centerName = "Gokulam";
                    else if ($scope.paymenttransactionData[i].location === 'Krishnamurthypuram')
                        centerName = "Krishnamurthypuram";
                    else if ($scope.paymenttransactionData[i].location === 'Nazarabad')
                        centerName = 'Nazarabad';
                    else if ($scope.paymenttransactionData[i].location === 'Ramakrishna Nagar')
                        centerName = 'RamakrishnaNagar';
                    else if ($scope.paymenttransactionData[i].location === 'Siddarth Layout')
                        centerName = 'SiddarthLayout';
                    else if ($scope.paymenttransactionData[i].location === 'New Sheshadri Iyer Road')
                        centerName = 'NewSheshadriIyerRoad';
                    else if ($scope.paymenttransactionData[i].location === 'Other Location')
                        centerName = 'OtherLocation';
                    switch (centerName) {
                        case "rto":
                            TrintrinRegistrationData[index].rto++;
                            TrintrinRegistrationData[index].trintrintotal++;
                            break;
                        case "ksrtc":
                            TrintrinRegistrationData[index].KSRTCbusStand++;
                            TrintrinRegistrationData[index].trintrintotal++;
                            break;
                        case "mrs":
                            TrintrinRegistrationData[index].railwaystation++;
                            TrintrinRegistrationData[index].trintrintotal++;
                            break;
                        case "cbs":
                            TrintrinRegistrationData[index].CitybusStand++;
                            TrintrinRegistrationData[index].trintrintotal++;
                            break;
                        case "mp":
                            TrintrinRegistrationData[index].palace++;
                            TrintrinRegistrationData[index].trintrintotal++;
                            break;
                        case "mz":
                            TrintrinRegistrationData[index].zoo++;
                            TrintrinRegistrationData[index].trintrintotal++;
                            break;
                        case "blukregistration":
                            TrintrinRegistrationData[index].bulkregistrations++;
                            TrintrinRegistrationData[index].trintrintotal++;
                            break;
                        case "Gokulam":
                            Mysore1RegistrationData[index].Gokulam++;
                            Mysore1RegistrationData[index].mysore1total++;
                            break;
                        case "Krishnamurthypuram":
                            Mysore1RegistrationData[index].Krishnamurthypuram++;
                            Mysore1RegistrationData[index].mysore1total++;
                            break;
                        case "Nazarabad":
                            Mysore1RegistrationData[index].Nazarabad++;
                            Mysore1RegistrationData[index].mysore1total++;
                            break;
                        case "RamakrishnaNagar":
                            Mysore1RegistrationData[index].RamakrishnaNagar++;
                            Mysore1RegistrationData[index].mysore1total++;
                            break;
                        case "SiddarthLayout":
                            Mysore1RegistrationData[index].SiddarthLayout++;
                            Mysore1RegistrationData[index].mysore1total++;
                            break;
                        case "NewSheshadriIyerRoad":
                            Mysore1RegistrationData[index].NewSheshadriIyerRoad++;
                            Mysore1RegistrationData[index].mysore1total++;
                            break;
                        case "OtherLocation":
                            Mysore1RegistrationData[index].OtherLocation++;
                            Mysore1RegistrationData[index].mysore1total++;
                            break;
                    }
                }
                $scope.TrinRegistrationData = TrintrinRegistrationData;
                $scope.Mysore1RegistrationData = Mysore1RegistrationData;
                $scope.TrintrinRegistrationCentersTotal = {
                    rtocount: 0,
                    railwaystationcount: 0,
                    KSRTCbusStandcount: 0,
                    CitybusStandcount: 0,
                    palacecount: 0,
                    zoocount: 0,
                    bulkregistrationscount: 0,
                    trintrintotalcount: 0
                };
                $scope.mysore1RegistrationCentersTotal = {
                    Gokulamcount: 0,
                    Krishnamurthypuramcount: 0,
                    Nazarabadcount: 0,
                    RamakrishnaNagarcount: 0,
                    SiddarthLayoutcount: 0,
                    NewSheshadriIyerRoadcount: 0,
                    OtherLocationcount: 0,
                    mysoretotalcount: 0
                };
                for (var i = 0; i < TrintrinRegistrationData.length; i++)
                {
                    $scope.TrintrinRegistrationCentersTotal.rtocount += TrintrinRegistrationData[i].rto;
                    $scope.TrintrinRegistrationCentersTotal.KSRTCbusStandcount += TrintrinRegistrationData[i].KSRTCbusStand;
                    $scope.TrintrinRegistrationCentersTotal.railwaystationcount += TrintrinRegistrationData[i].railwaystation;
                    $scope.TrintrinRegistrationCentersTotal.CitybusStandcount += TrintrinRegistrationData[i].CitybusStand;
                    $scope.TrintrinRegistrationCentersTotal.palacecount += TrintrinRegistrationData[i].palace;
                    $scope.TrintrinRegistrationCentersTotal.zoocount += TrintrinRegistrationData[i].zoo;
                    $scope.TrintrinRegistrationCentersTotal.bulkregistrationscount += TrintrinRegistrationData[i].bulkregistrations;
                    $scope.TrintrinRegistrationCentersTotal.trintrintotalcount += TrintrinRegistrationData[i].trintrintotal;
                }
                for (var i = 0; i < Mysore1RegistrationData.length; i++)
                {
                    $scope.mysore1RegistrationCentersTotal.Gokulamcount += Mysore1RegistrationData[i].Gokulam;
                    $scope.mysore1RegistrationCentersTotal.Krishnamurthypuramcount += Mysore1RegistrationData[i].Krishnamurthypuram;
                    $scope.mysore1RegistrationCentersTotal.Nazarabadcount += Mysore1RegistrationData[i].Nazarabad;
                    $scope.mysore1RegistrationCentersTotal.RamakrishnaNagarcount += Mysore1RegistrationData[i].RamakrishnaNagar;
                    $scope.mysore1RegistrationCentersTotal.SiddarthLayoutcount += Mysore1RegistrationData[i].SiddarthLayout;
                    $scope.mysore1RegistrationCentersTotal.NewSheshadriIyerRoadcount += Mysore1RegistrationData[i].NewSheshadriIyerRoad;
                    $scope.mysore1RegistrationCentersTotal.OtherLocationcount += Mysore1RegistrationData[i].OtherLocation;
                    $scope.mysore1RegistrationCentersTotal.mysoretotalcount += Mysore1RegistrationData[i].mysore1total;
                }

            });
        });

        $http({
            method: "GET",
            url: baseURL60 + "dockstation", //station details
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response1, status) {
            $scope.dockingData = response1.data.data;
            $scope.dockingData1 = [];
            var data = {
                name: 'All'
            };
            $scope.dockingData1.push(data);
            for (var i = 0; i < $scope.dockingData.length; i++)
            {
                $scope.dockingData1.push($scope.dockingData[i]);
            }
        });
//        $http({
//                    method: "GET",
//                    url: baseURL70 + "transactions", //Open transaction
//                    data: '',
//                    headers: {
//                        "Content-Type": "application/json"
//                    }
//                }).then(function (response3, status) {
//            $scope.transactionsData = response3.data.data;
//        });
    }));
//    });

    //var refresh = setInterval(getdata, 30000);//setInterval for 30 sec
    function getdata()  //calling function for setInterval
    {
        $scope.todayDate = new Date();
        $scope.date = $scope.todayDate.toLocaleDateString();
        $scope.time = $scope.todayDate.toLocaleTimeString();
        var data = {
            fromdate: todayDate,
            todate: todayDate,
            location: '',
            transactionType: 'Security Deposit' //'Registration'
        };
        $http({
            method: "POST",
            url: baseURL60 + "paymenttransaction/daywisecollection", //Member Details
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.paymenttransactionData = response.data.data;
            membersdetails = $scope.paymenttransactionData;
            $scope.paymenttransactionDatacount = $scope.paymenttransactionData.length;
            var TrintrinRegistrationData = [];  //array for storing final trintrinregistration data
            var Mysore1RegistrationData = [];   //array for storing final mysoreregistration data
            var TrintrinRegistrationEntry = {
                date: todayDate,
                rto: 0,
                palace: 0,
                KSRTCbusStand: 0,
                CitybusStand: 0,
                railwaystation: 0,
                zoo: 0,
                bulkregistrations: 0,
                trintrintotal: 0
            };
            TrintrinRegistrationData.push(TrintrinRegistrationEntry);
            var mysore1RegistrationEntry = {
                date: todayDate,
                Gokulam: 0,
                Krishnamurthypuram: 0,
                Nazarabad: 0,
                RamakrishnaNagar: 0,
                SiddarthLayout: 0,
                NewSheshadriIyerRoad: 0,
                OtherLocation: 0,
                mysore1total: 0
            };
            Mysore1RegistrationData.push(mysore1RegistrationEntry);

//                            RegistrationData.reverse();
            for (var i = 0; i < $scope.paymenttransactionData.length; i++)
            {
                var registrationdate = $scope.paymenttransactionData[i].createdAt;
                registrationdate = new Date(registrationdate);
                registrationdate.setHours(00, 00, 00);
                var fromdate = new Date(todayDate);
                var index1 = (registrationdate - fromdate) / (1000 * 60 * 60 * 24);
                var index = ~~index1;                  //0
                var centerName;
                if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[0].location)
                    centerName = "rto";
                else if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[1].location)
                    centerName = "mrs";
                else if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[2].location)
                    centerName = "ksrtc";
                else if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[3].location)
                    centerName = "cbs";
                else if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[4].location)
                    centerName = "mp";
                else if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[5].location)
                    centerName = "mz";
                else if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[6].location)
                    centerName = "blukregistration";
                else if ($scope.paymenttransactionData[i].location === 'Gokulam')
                    centerName = "Gokulam";
                else if ($scope.paymenttransactionData[i].location === 'Krishnamurthypuram')
                    centerName = "Krishnamurthypuram";
                else if ($scope.paymenttransactionData[i].location === 'Nazarabad')
                    centerName = 'Nazarabad';
                else if ($scope.paymenttransactionData[i].location === 'Ramakrishna Nagar')
                    centerName = 'RamakrishnaNagar';
                else if ($scope.paymenttransactionData[i].location === 'Siddarth Layout')
                    centerName = 'SiddarthLayout';
                else if ($scope.paymenttransactionData[i].location === 'New Sheshadri Iyer Road')
                    centerName = 'NewSheshadriIyerRoad';
                else if ($scope.paymenttransactionData[i].location === 'Other Location')
                    centerName = 'OtherLocation';
                switch (centerName) {
                    case "rto":
                        TrintrinRegistrationData[index].rto++;
                        TrintrinRegistrationData[index].trintrintotal++;
                        break;
                    case "ksrtc":
                        TrintrinRegistrationData[index].KSRTCbusStand++;
                        TrintrinRegistrationData[index].trintrintotal++;
                        break;
                    case "mrs":
                        TrintrinRegistrationData[index].railwaystation++;
                        TrintrinRegistrationData[index].trintrintotal++;
                        break;
                    case "cbs":
                        TrintrinRegistrationData[index].CitybusStand++;
                        TrintrinRegistrationData[index].trintrintotal++;
                        break;
                    case "mp":
                        TrintrinRegistrationData[index].palace++;
                        TrintrinRegistrationData[index].trintrintotal++;
                        break;
                    case "mz":
                        TrintrinRegistrationData[index].zoo++;
                        TrintrinRegistrationData[index].trintrintotal++;
                        break;
                    case "blukregistration":
                        TrintrinRegistrationData[index].bulkregistrations++;
                        TrintrinRegistrationData[index].trintrintotal++;
                        break;
                    case "Gokulam":
                        Mysore1RegistrationData[index].Gokulam++;
                        Mysore1RegistrationData[index].mysore1total++;
                        break;
                    case "Krishnamurthypuram":
                        Mysore1RegistrationData[index].Krishnamurthypuram++;
                        Mysore1RegistrationData[index].mysore1total++;
                        break;
                    case "Nazarabad":
                        Mysore1RegistrationData[index].Nazarabad++;
                        Mysore1RegistrationData[index].mysore1total++;
                        break;
                    case "RamakrishnaNagar":
                        Mysore1RegistrationData[index].RamakrishnaNagar++;
                        Mysore1RegistrationData[index].mysore1total++;
                        break;
                    case "SiddarthLayout":
                        Mysore1RegistrationData[index].SiddarthLayout++;
                        Mysore1RegistrationData[index].mysore1total++;
                        break;
                    case "NewSheshadriIyerRoad":
                        Mysore1RegistrationData[index].NewSheshadriIyerRoad++;
                        Mysore1RegistrationData[index].mysore1total++;
                        break;
                    case "OtherLocation":
                        Mysore1RegistrationData[index].OtherLocation++;
                        Mysore1RegistrationData[index].mysore1total++;
                        break;
                }
            }
            $scope.TrinRegistrationData = TrintrinRegistrationData;
            $scope.Mysore1RegistrationData = Mysore1RegistrationData;
            $scope.TrintrinRegistrationCentersTotal = {
                rtocount: 0,
                railwaystationcount: 0,
                KSRTCbusStandcount: 0,
                CitybusStandcount: 0,
                palacecount: 0,
                zoocount: 0,
                bulkregistrationscount: 0,
                trintrintotalcount: 0
            };
            $scope.mysore1RegistrationCentersTotal = {
                Gokulamcount: 0,
                Krishnamurthypuramcount: 0,
                Nazarabadcount: 0,
                RamakrishnaNagarcount: 0,
                SiddarthLayoutcount: 0,
                NewSheshadriIyerRoadcount: 0,
                OtherLocationcount: 0,
                mysoretotalcount: 0
            };
            for (var i = 0; i < TrintrinRegistrationData.length; i++)
            {
                $scope.TrintrinRegistrationCentersTotal.rtocount += TrintrinRegistrationData[i].rto;
                $scope.TrintrinRegistrationCentersTotal.KSRTCbusStandcount += TrintrinRegistrationData[i].KSRTCbusStand;
                $scope.TrintrinRegistrationCentersTotal.railwaystationcount += TrintrinRegistrationData[i].railwaystation;
                $scope.TrintrinRegistrationCentersTotal.CitybusStandcount += TrintrinRegistrationData[i].CitybusStand;
                $scope.TrintrinRegistrationCentersTotal.palacecount += TrintrinRegistrationData[i].palace;
                $scope.TrintrinRegistrationCentersTotal.zoocount += TrintrinRegistrationData[i].zoo;
                $scope.TrintrinRegistrationCentersTotal.bulkregistrationscount += TrintrinRegistrationData[i].bulkregistrations;
                $scope.TrintrinRegistrationCentersTotal.trintrintotalcount += TrintrinRegistrationData[i].trintrintotal;
            }
            for (var i = 0; i < Mysore1RegistrationData.length; i++)
            {
                $scope.mysore1RegistrationCentersTotal.Gokulamcount += Mysore1RegistrationData[i].Gokulam;
                $scope.mysore1RegistrationCentersTotal.Krishnamurthypuramcount += Mysore1RegistrationData[i].Krishnamurthypuram;
                $scope.mysore1RegistrationCentersTotal.Nazarabadcount += Mysore1RegistrationData[i].Nazarabad;
                $scope.mysore1RegistrationCentersTotal.RamakrishnaNagarcount += Mysore1RegistrationData[i].RamakrishnaNagar;
                $scope.mysore1RegistrationCentersTotal.SiddarthLayoutcount += Mysore1RegistrationData[i].SiddarthLayout;
                $scope.mysore1RegistrationCentersTotal.NewSheshadriIyerRoadcount += Mysore1RegistrationData[i].NewSheshadriIyerRoad;
                $scope.mysore1RegistrationCentersTotal.OtherLocationcount += Mysore1RegistrationData[i].OtherLocation;
                $scope.mysore1RegistrationCentersTotal.mysoretotalcount += Mysore1RegistrationData[i].mysore1total;
            }
        });
        var checkoutdata = {
            fromdate: todayDate,
            todate: todayDate
        };
        $http({
            method: "POST",
            url: baseURL60 + "transactions/completed", //complete transaction
            data: checkoutdata,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response3, status) {
            $scope.checkouts = response3.data.data;
            var complete = $scope.checkouts;
            var unique = [], duplicatedata = [], sortcompletetransaction = [];
            sortcompletetransaction = _.sortBy(complete, 'checkOutTime');    //its sort the array based on checkOutTime
            var map = {};

            for (var i = 0; i < sortcompletetransaction.length; i++)
            {
                if (sortcompletetransaction[i].user.cardNum in map)                  //if card in map[index] push record the same index
                {
                    var transactions = map[sortcompletetransaction[i].user.cardNum];
                    transactions.push(sortcompletetransaction[i]);

                } else                                                                //otherwise create a new object
                {
                    var transactions = new Array();
                    transactions.push(sortcompletetransaction[i]);

                    map[sortcompletetransaction[i].user.cardNum] = transactions;
                }
            }
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
                var j = 0;
                unique.push(data[j]);
                while (transacionscount)
                {

                    if (transacionscount !== 1) {
                        if (data[j].checkOutTime === data[j + 1].checkOutTime)
                        {
                            duplicatedata.push(data[j + 1]);
                            transacionscount -= 2;
                            j += 1;
                        } else {
                            unique.push(data[j + 1]);
                            transacionscount--;
                            j++;
                        }
                    } else {
                        transacionscount--;
                        j++;
                    }
                }
            }
            for (var key in singletransaction)
            {
                var data = [];
                data = singletransaction[key];
                for (var j = 0; j < data.length; j++)
                {
                    unique.push(data[j]);
                }
            }
            var checkouts = [];                                       //to store the response data
            checkouts = unique;
            var StationHourlyCheckouts = [], StationHourlyCheckIns = [];
            var hourlycheckouttotal = [];
            var hourlycheckintotal = [];
            for (var j = 5; j < 22; j++)
            {
                var hoursEntry = {
                    time: j + "-" + (j + 1),
                    counts: 0

                };
                hourlycheckouttotal.push(hoursEntry);
            }

            for (var i = 0; i < dockingHubsName.length; i++)
            {
                var hourlycheckoutcounts = [];
                for (var j = 5; j < 22; j++)
                {
                    var hoursEntry = {
                        time: j + "-" + (j + 1),
                        count: 0

                    };
                    hourlycheckoutcounts.push(hoursEntry);
                }
                var checkouttotal = 0;
                //                    var len = hourlycounts.length;
                var Name = dockingHubsName[i].name;
                for (var k = 0; k < checkouts.length; k++) {
                    var checkout = checkouts[k].checkOutTime;
                    checkout = new Date(checkout);
                    var index = checkout.getHours();
                    index = index - 5;
                    if (Name === checkouts[k].fromPort.DockingStationName)
                    {
                        if ((index >= 0) && (index < 17))
                        {
//                            if ((5 <= checkouts[k].duration) && (checkouts[k].duration <= 500.0))
//                            {
                                if (checkouts[k].checkOutTime < checkouts[k].checkInTime)
                                {
                                    hourlycheckoutcounts[index].count++;
                                    hourlycheckouttotal[index].counts++;
                                    checkouttotal++;
                                }
//                            }
                        }
                    }
                }
                var stationhours = {
                    name: Name,
                    hours: hourlycheckoutcounts,
                    total: checkouttotal
                };
                StationHourlyCheckouts.push(stationhours);
            }
            $scope.hourlycheckouts = StationHourlyCheckouts;
            $scope.totalcheckoutcount = 0;
            for (var i = 0; i < StationHourlyCheckouts.length; i++)
            {
                $scope.totalcheckoutcount += StationHourlyCheckouts[i].total;
            }

            $scope.hourlyTotalscheckout = hourlycheckouttotal;
            for (var j = 5; j < 22; j++)
            {
                var hoursEntry = {
                    time: j + "-" + (j + 1),
                    counts: 0

                };
                hourlycheckintotal.push(hoursEntry);
            }

            for (var i = 0; i < dockingHubsName.length; i++)
            {
                var hourlycheckincounts = [];
                for (var j = 5; j < 22; j++)
                {
                    var hoursEntry = {
                        time: j + "-" + (j + 1),
                        count: 0

                    };
                    hourlycheckincounts.push(hoursEntry);
                }
                var checkintotal = 0;
                //                    var len = hourlycounts.length;
                var Name = dockingHubsName[i].name;
                for (var k = 0; k < checkouts.length; k++) {
                    var checkout = checkouts[k].checkInTime;
                    checkout = new Date(checkout);
                    var index = checkout.getHours();
                    index = index - 5;
                    if (Name === checkouts[k].toPort.DockingStationName)
                    {
                        if ((index >= 0) && (index < 17))
                        {
//                            if ((5 <= checkouts[k].duration) && (checkouts[k].duration <= 500.0))
//                            {
                                if (checkouts[k].checkOutTime < checkouts[k].checkInTime)
                                {
                                    hourlycheckincounts[index].count++;
                                    hourlycheckintotal[index].counts++;
                                    checkintotal++;
                                }
//                            }
                        }
                    }
                }
                var stationcheckinhours = {
                    name: Name,
                    hours: hourlycheckincounts,
                    total: checkintotal
                };
                StationHourlyCheckIns.push(stationcheckinhours);
            }
            $scope.hourlycheckins = StationHourlyCheckIns;
            $scope.totalcheckincount = 0;
            for (var i = 0; i < StationHourlyCheckIns.length; i++)
            {
                $scope.totalcheckincount += StationHourlyCheckIns[i].total;
            }
            $scope.hourlyTotalscheckin = hourlycheckintotal;
        });
    }

    $scope.hourlycheckoutcounts = function (fromdate, todate, duration)
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
                    url: baseURL60 + "transactions/completed", //complete transaction
                    data: data,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response3, status) {
            $scope.checkouts = response3.data.data;

            var complete = $scope.checkouts;
            var unique = [], duplicatedata = [], sortcompletetransaction = [];
            sortcompletetransaction = _.sortBy(complete, 'checkOutTime');    //its sort the array based on checkOutTime
            var map = {};

            for (var i = 0; i < sortcompletetransaction.length; i++)
            {
                if (sortcompletetransaction[i].user.cardNum in map)                  //if card in map[index] push record the same index
                {
                    var transactions = map[sortcompletetransaction[i].user.cardNum];
                    transactions.push(sortcompletetransaction[i]);

                } else                                                                //otherwise create a new object
                {
                    var transactions = new Array();
                    transactions.push(sortcompletetransaction[i]);

                    map[sortcompletetransaction[i].user.cardNum] = transactions;
                }
            }
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
                var j = 0;
                unique.push(data[j]);
                while (transacionscount)
                {

                    if (transacionscount !== 1) {
                        if (data[j].checkOutTime === data[j + 1].checkOutTime)
                        {
                            duplicatedata.push(data[j + 1]);
                            transacionscount -= 2;
                            j += 1;
                        } else {
                            unique.push(data[j + 1]);
                            transacionscount--;
                            j++;
                        }
                    } else {
                        transacionscount--;
                        j++;
                    }
                }
            }
            for (var key in singletransaction)
            {
                var data = [];
                data = singletransaction[key];
                for (var j = 0; j < data.length; j++)
                {
                    unique.push(data[j]);
                }
            }
            var checkouts = [];                                       //to store the response data
            checkouts = unique;
            var StationHourlyCheckouts = [];
            var hourlycheckouttotal = [];
            for (var j = 5; j < 22; j++)
            {
                var hoursEntry = {
                    time: j + "-" + (j + 1),
                    counts: 0

                };
                hourlycheckouttotal.push(hoursEntry);
            }

            var durationarray = [];
            for (var i = 0; i < checkouts.length; i++)
            {
//                if ((duration <= checkouts[i].duration) && (checkouts[i].duration < 500.0))
//                {
                    if (checkouts[i].checkOutTime < checkouts[i].checkInTime)
                    {
                        durationarray.push(checkouts[i]);
                    }
//                }
            }


            for (var i = 0; i < dockingHubsName.length; i++)
            {
                var hourlycheckoutcounts = [];
                for (var j = 5; j < 22; j++)
                {
                    var hoursEntry = {
                        time: j + "-" + (j + 1),
                        count: 0

                    };
                    hourlycheckoutcounts.push(hoursEntry);
                }
                var checkouttotal = 0;
                //                    var len = hourlycounts.length;
                var Name = dockingHubsName[i].name;
                for (var k = 0; k < durationarray.length; k++) {
                    var checkout = durationarray[k].checkOutTime;
                    checkout = new Date(checkout);
                    var index = checkout.getHours();
                    index = index - 5;
                    if (Name === durationarray[k].fromPort.DockingStationName)
                    {
                        if ((index >= 0) && (index < 17))
                        {
//                            if ((duration <= durationarray[k].duration) && (durationarray[k].duration <= 500.0))
//                            {
                                if (durationarray[k].checkOutTime < durationarray[k].checkInTime)
                                {
                            hourlycheckoutcounts[index].count++;
                            hourlycheckouttotal[index].counts++;
                            checkouttotal++;
                                }
//                            }
                        }
                    }
                }
                var stationhours = {
                    name: Name,
                    hours: hourlycheckoutcounts,
                    total: checkouttotal
                };
                StationHourlyCheckouts.push(stationhours);
            }
            $scope.hourlycheckouts = StationHourlyCheckouts;
            $scope.totalcheckoutcount = 0;
            for (var i = 0; i < StationHourlyCheckouts.length; i++)
            {
                $scope.totalcheckoutcount += StationHourlyCheckouts[i].total;
            }
            $scope.hourlyTotalscheckout = hourlycheckouttotal;
            swal.close();
        }));
    };
    $scope.hourlywisecheckincounts = function (fromdate, todate, duration)
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
                    url: baseURL60 + "transactions/completed", //complete transaction
                    data: data,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response3, status) {
            $scope.checkouts = response3.data.data;

            var complete = $scope.checkouts;
            var unique = [], duplicatedata = [], sortcompletetransaction = [];
            sortcompletetransaction = _.sortBy(complete, 'checkOutTime');    //its sort the array based on checkOutTime
            var map = {};

            for (var i = 0; i < sortcompletetransaction.length; i++)
            {
                if (sortcompletetransaction[i].user.cardNum in map)                  //if card in map[index] push record the same index
                {
                    var transactions = map[sortcompletetransaction[i].user.cardNum];
                    transactions.push(sortcompletetransaction[i]);

                } else                                                                //otherwise create a new object
                {
                    var transactions = new Array();
                    transactions.push(sortcompletetransaction[i]);

                    map[sortcompletetransaction[i].user.cardNum] = transactions;
                }
            }
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
                var j = 0;
                unique.push(data[j]);
                while (transacionscount)
                {

                    if (transacionscount !== 1) {
                        if (data[j].checkOutTime === data[j + 1].checkOutTime)
                        {
                            duplicatedata.push(data[j + 1]);
                            transacionscount -= 2;
                            j += 1;
                        } else {
                            unique.push(data[j + 1]);
                            transacionscount--;
                            j++;
                        }
                    } else {
                        transacionscount--;
                        j++;
                    }
                }
            }
            for (var key in singletransaction)
            {
                var data = [];
                data = singletransaction[key];
                for (var j = 0; j < data.length; j++)
                {
                    unique.push(data[j]);
                }
            }
            var checkouts = [];                                       //to store the response data
            checkouts = unique;
            $scope.totalcheckincount = 0;
            var StationHourlyCheckIns = [];
            var hourlycheckintotal = [];
            for (var j = 5; j < 22; j++)
            {
                var hoursEntry = {
                    time: j + "-" + (j + 1),
                    counts: 0

                };
                hourlycheckintotal.push(hoursEntry);
            }
            var durationarray = [];
            for (var i = 0; i < checkouts.length; i++)
            {
//                if ((duration <= checkouts[i].duration) && (checkouts[i].duration < 500.0))
//                {
                    if (checkouts[i].checkOutTime < checkouts[i].checkInTime)
                    {
                        durationarray.push(checkouts[i]);
                    }
//                }
            }
            var indexarr = [];
            for (var i = 0; i < dockingHubsName.length; i++)
            {
                var hourlycheckincounts = [];
                for (var j = 5; j < 22; j++)
                {
                    var hoursEntry = {
                        time: j + "-" + (j + 1),
                        count: 0

                    };
                    hourlycheckincounts.push(hoursEntry);
                }
                var checkintotal = 0;
                //                    var len = hourlycounts.length;
                var Name = dockingHubsName[i].name;
                for (var k = 0; k < durationarray.length; k++) {
                    var checkin = durationarray[k].checkInTime;
                    checkin = new Date(checkin);
                    var index = checkin.getHours();
                    index = index - 5;
                    if (Name === durationarray[k].toPort.DockingStationName)
                    {
                        if ((index >= 0) && (index < 17))
                        {
//                                if (durationarray[k].checkOutTime < durationarray[k].checkInTime)
//                                {
                            hourlycheckincounts[index].count++;
                            hourlycheckintotal[index].counts++;
                            checkintotal++;
                            $scope.totalcheckincount++;
//                                }
//                            }
                        }
                    }
                }
                var stationcheckinhours = {
                    name: Name,
                    hours: hourlycheckincounts,
                    total: checkintotal
                };
                StationHourlyCheckIns.push(stationcheckinhours);
            }
            $scope.hourlycheckins = StationHourlyCheckIns;
//            $scope.totalcheckincount = 0;
//            for (var i = 0; i < StationHourlyCheckIns.length; i++)
//            {
//                $scope.totalcheckincount += StationHourlyCheckIns[i].total;
//            }
            $scope.hourlyTotalscheckin = hourlycheckintotal;
            swal.close();
        }));
    };


    $scope.GetRegistrationData = function (fromdateinput, todate) {
        var TrintrinRegistrationData = [];  //array for storing final trintrinregistration data
        var Mysore1RegistrationData = [];   //array for storing final mysoreregistration data
        var data = {
            fromdate: $scope.fromdatereg,
            todate: $scope.todatereg,
            location: '',
            transactionType: 'Security Deposit'//Registration' 
        };
        swal({
            title: 'Loading...',
            showCancelButton: false,
            showConfirmButton: false
        }).then(
                $http({
                    method: "POST",
                    url: baseURL60 + "paymenttransaction/daywisecollection", //Member Details
                    data: data,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response, status) {
            $scope.paymenttransactionData = response.data.data;
            $scope.paymenttransactionDatacount = $scope.paymenttransactionData.length;
            var from = new Date(fromdateinput);
            var to = new Date(todate);
            var days = (to - from) / (1000 * 60 * 60 * 24);
            for (var i = 0, j = 0; i <= days; i++)
            {
                var currentdate = from.setDate(from.getDate() + j);
                var TrintrinRegistrationEntry = {
                    date: currentdate,
                    rto: 0,
                    palace: 0,
                    KSRTCbusStand: 0,
                    CitybusStand: 0,
                    railwaystation: 0,
                    zoo: 0,
                    bulkregistrations: 0,
                    trintrintotal: 0
                };
                TrintrinRegistrationData.push(TrintrinRegistrationEntry);
                var mysore1RegistrationEntry = {
                    date: currentdate,
                    Gokulam: 0,
                    Krishnamurthypuram: 0,
                    Nazarabad: 0,
                    RamakrishnaNagar: 0,
                    SiddarthLayout: 0,
                    NewSheshadriIyerRoad: 0,
                    OtherLocation: 0,
                    mysore1total: 0
                };
                Mysore1RegistrationData.push(mysore1RegistrationEntry);
                j = 1;
            }
//                            RegistrationData.reverse();
            for (var i = 0; i < $scope.paymenttransactionData.length; i++)
            {
                var registrationdate = $scope.paymenttransactionData[i].createdAt;
                registrationdate = new Date(registrationdate);
                registrationdate.setHours(00, 00, 00);
                var fromdate = new Date(fromdateinput);
                var index1 = (registrationdate - fromdate) / (1000 * 60 * 60 * 24);
                var index = ~~index1;                  //0
                var centerName;
                if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[0].location)
                    centerName = "rto";
                else if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[1].location)
                    centerName = "mrs";
                else if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[2].location)
                    centerName = "ksrtc";
                else if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[3].location)
                    centerName = "cbs";
                else if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[4].location)
                    centerName = "mp";
                else if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[5].location)
                    centerName = "mz";
                else if ($scope.paymenttransactionData[i].location === $scope.registrationcentersname[6].location)
                    centerName = "blukregistration";
                else if ($scope.paymenttransactionData[i].location === 'Gokulam')
                    centerName = "Gokulam";
                else if ($scope.paymenttransactionData[i].location === 'Krishnamurthypuram')
                    centerName = "Krishnamurthypuram";
                else if ($scope.paymenttransactionData[i].location === 'Nazarabad')
                    centerName = 'Nazarabad';
                else if ($scope.paymenttransactionData[i].location === 'Ramakrishna Nagar')
                    centerName = 'RamakrishnaNagar';
                else if ($scope.paymenttransactionData[i].location === 'Siddarth Layout')
                    centerName = 'SiddarthLayout';
                else if ($scope.paymenttransactionData[i].location === 'New Sheshadri Iyer Road')
                    centerName = 'NewSheshadriIyerRoad';
                else if ($scope.paymenttransactionData[i].location === 'Other Location')
                    centerName = 'OtherLocation';
                switch (centerName) {
                    case "rto":
                        TrintrinRegistrationData[index].rto++;
                        TrintrinRegistrationData[index].trintrintotal++;
                        break;
                    case "ksrtc":
                        TrintrinRegistrationData[index].KSRTCbusStand++;
                        TrintrinRegistrationData[index].trintrintotal++;
                        break;
                    case "mrs":
                        TrintrinRegistrationData[index].railwaystation++;
                        TrintrinRegistrationData[index].trintrintotal++;
                        break;
                    case "cbs":
                        TrintrinRegistrationData[index].CitybusStand++;
                        TrintrinRegistrationData[index].trintrintotal++;
                        break;
                    case "mp":
                        TrintrinRegistrationData[index].palace++;
                        TrintrinRegistrationData[index].trintrintotal++;
                        break;
                    case "mz":
                        TrintrinRegistrationData[index].zoo++;
                        TrintrinRegistrationData[index].trintrintotal++;
                        break;
                    case "blukregistration":
                        TrintrinRegistrationData[index].bulkregistrations++;
                        TrintrinRegistrationData[index].trintrintotal++;
                        break;
                    case "Gokulam":
                        Mysore1RegistrationData[index].Gokulam++;
                        Mysore1RegistrationData[index].mysore1total++;
                        break;
                    case "Krishnamurthypuram":
                        Mysore1RegistrationData[index].Krishnamurthypuram++;
                        Mysore1RegistrationData[index].mysore1total++;
                        break;
                    case "Nazarabad":
                        Mysore1RegistrationData[index].Nazarabad++;
                        Mysore1RegistrationData[index].mysore1total++;
                        break;
                    case "RamakrishnaNagar":
                        Mysore1RegistrationData[index].RamakrishnaNagar++;
                        Mysore1RegistrationData[index].mysore1total++;
                        break;
                    case "SiddarthLayout":
                        Mysore1RegistrationData[index].SiddarthLayout++;
                        Mysore1RegistrationData[index].mysore1total++;
                        break;
                    case "NewSheshadriIyerRoad":
                        Mysore1RegistrationData[index].NewSheshadriIyerRoad++;
                        Mysore1RegistrationData[index].mysore1total++;
                        break;
                    case "OtherLocation":
                        Mysore1RegistrationData[index].OtherLocation++;
                        Mysore1RegistrationData[index].mysore1total++;
                        break;
//                    default : alert("index not found");
                }
            }
            $scope.TrinRegistrationData = TrintrinRegistrationData;
            $scope.Mysore1RegistrationData = Mysore1RegistrationData;
            $scope.TrintrinRegistrationCentersTotal = {
                rtocount: 0,
                railwaystationcount: 0,
                KSRTCbusStandcount: 0,
                CitybusStandcount: 0,
                palacecount: 0,
                zoocount: 0,
                bulkregistrationscount: 0,
                trintrintotalcount: 0
            };
            $scope.mysore1RegistrationCentersTotal = {
                Gokulamcount: 0,
                Krishnamurthypuramcount: 0,
                Nazarabadcount: 0,
                RamakrishnaNagarcount: 0,
                SiddarthLayoutcount: 0,
                NewSheshadriIyerRoadcount: 0,
                OtherLocationcount: 0,
                mysoretotalcount: 0
            };
            for (var i = 0; i < TrintrinRegistrationData.length; i++)
            {
                $scope.TrintrinRegistrationCentersTotal.rtocount += TrintrinRegistrationData[i].rto;
                $scope.TrintrinRegistrationCentersTotal.KSRTCbusStandcount += TrintrinRegistrationData[i].KSRTCbusStand;
                $scope.TrintrinRegistrationCentersTotal.railwaystationcount += TrintrinRegistrationData[i].railwaystation;
                $scope.TrintrinRegistrationCentersTotal.CitybusStandcount += TrintrinRegistrationData[i].CitybusStand;
                $scope.TrintrinRegistrationCentersTotal.palacecount += TrintrinRegistrationData[i].palace;
                $scope.TrintrinRegistrationCentersTotal.zoocount += TrintrinRegistrationData[i].zoo;
                $scope.TrintrinRegistrationCentersTotal.bulkregistrationscount += TrintrinRegistrationData[i].bulkregistrations;
                $scope.TrintrinRegistrationCentersTotal.trintrintotalcount += TrintrinRegistrationData[i].trintrintotal;
            }
            for (var i = 0; i < Mysore1RegistrationData.length; i++)
            {
                $scope.mysore1RegistrationCentersTotal.Gokulamcount += Mysore1RegistrationData[i].Gokulam;
                $scope.mysore1RegistrationCentersTotal.Krishnamurthypuramcount += Mysore1RegistrationData[i].Krishnamurthypuram;
                $scope.mysore1RegistrationCentersTotal.Nazarabadcount += Mysore1RegistrationData[i].Nazarabad;
                $scope.mysore1RegistrationCentersTotal.RamakrishnaNagarcount += Mysore1RegistrationData[i].RamakrishnaNagar;
                $scope.mysore1RegistrationCentersTotal.SiddarthLayoutcount += Mysore1RegistrationData[i].SiddarthLayout;
                $scope.mysore1RegistrationCentersTotal.NewSheshadriIyerRoadcount += Mysore1RegistrationData[i].NewSheshadriIyerRoad;
                $scope.mysore1RegistrationCentersTotal.OtherLocationcount += Mysore1RegistrationData[i].OtherLocation;
                $scope.mysore1RegistrationCentersTotal.mysoretotalcount += Mysore1RegistrationData[i].mysore1total;
            }
            swal.close();
        }));
    };
    $scope.GetMembers = function (from, to) {
//        alert("Hai");
        var membercount = {
            fromdate: from,
            todate: to
        };
        $http({
            method: "POST",
            url: baseURL60 + "users/count/detail/bydate", //member counts //ipURL60
            data: membercount,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.memberData = response.data.data;
            $scope.membercount = $scope.memberData.Female + $scope.memberData.Male;
            $scope.agecount = $scope.memberData.greaterthan50 + $scope.memberData.gte40lt50 + $scope.memberData.gte30lt40 + $scope.memberData.gte20lt30 + $scope.memberData.lessthan20;

            $scope.Female = ($scope.memberData.Female / $scope.membercount) * 100;
            $scope.Male = ($scope.memberData.Male / $scope.membercount) * 100;
            $scope.greaterthan50 = ($scope.memberData.greaterthan50 / $scope.agecount) * 100;
            $scope.gte40lt50 = ($scope.memberData.gte40lt50 / $scope.agecount) * 100;
            $scope.gte30lt40 = ($scope.memberData.gte30lt40 / $scope.agecount) * 100;
            $scope.gte20lt30 = ($scope.memberData.gte20lt30 / $scope.agecount) * 100;
            $scope.lessthan20 = ($scope.memberData.lessthan20 / $scope.agecount) * 100;
        });
    };
    $scope.selecteddockingstation = function (data) {                   //Docking Station  names and Ip address
        StationName = data.name;
//         alert(StationName);
    };
    $scope.stationwisetransactions = function (fromdate, todate,duration) {
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
                    url: baseURL60 + "transactions/completed", //Compete transactions //baseURL70 + "transactions", //Open transaction
                    data: data,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response3, status) {
            $scope.stationtransactionData = response3.data.data;
            $scope.transactionsData = [];
            $scope.peekours = 0;
//            for(var i=0;i<$scope.stationtransactionData.length;i++)
//            {
//                    var checkouttime = $scope.stationtransactionData[i].checkOutTime;
//                    checkouttime = new Date(checkouttime);
//                    var checkitime = $scope.stationtransactionData[i].checkInTime;
//                    checkitime = new Date(checkitime);
//                    var fromtime = checkouttime.getHours();
//                    var totime = checkitime.getHours();
//                    if(((8 <= fromtime) && (11 >= totime))||((16 <= fromtime) && (19 >= totime))){
//                         $scope.peekours++; 
//                    }
//            }
//            $scope.completetotal = $scope.stationtransactionData.length;
//            $scope.offpeek = $scope.completetotal - $scope.peekours;
            if ((StationName === 'All') || (StationName === 'undefined') || (StationName === '')) {
                for (var i = 0; i < $scope.stationtransactionData.length; i++) {
                    if ((duration <= $scope.stationtransactionData[i].duration) && ($scope.stationtransactionData[i].duration < 500.0))
                    {
                            $scope.transactionsData.push($scope.stationtransactionData[i]);
                            $scope.stationname = 'All Docking Hubs';
                    }
                }

            } else {
                if ($scope.transaction === 'checkin')
                {
                    for (var i = 0; i < $scope.stationtransactionData.length; i++)
                    {
                        if (StationName === $scope.stationtransactionData[i].toPort.DockingStationName)
                        {

                            if ((duration <= $scope.stationtransactionData[i].duration) && ($scope.stationtransactionData[i].duration < 500.0))
                            {
                                if ($scope.stationtransactionData[i].checkOutTime < $scope.stationtransactionData[i].checkInTime)
                                {
                                    $scope.transactionsData.push($scope.stationtransactionData[i]);
                                    $scope.stationname = StationName;
                                }
                            }

                        }
                    }
                } else
                {
                    for (var i = 0; i < $scope.stationtransactionData.length; i++)
                    {
                        if (StationName === $scope.stationtransactionData[i].fromPort.DockingStationName)
                        {

                            if ((duration <= $scope.stationtransactionData[i].duration) && ($scope.stationtransactionData[i].duration < 500.0))
                            {
                                if ($scope.stationtransactionData[i].checkOutTime < $scope.stationtransactionData[i].checkInTime)
                                {
                                    $scope.transactionsData.push($scope.stationtransactionData[i]);
                                    $scope.stationname = StationName;
                                }
                            }
//                    }

                        }
                    }
                }
            }
            $scope.transactioncount = $scope.transactionsData.length;
//            $scope.stationname = StationName;
            swal.close();
        }));
    };
    $scope.checkoutDistribution = function (from,to) {
         var checkoutdata = {
                    fromdate: from,
                    todate: to
                };
               
           $http({
                    method: "POST",
                    url: ipURL80 + "transactions/all/checkout/bydate", //complete transaction
                    data: checkoutdata,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response3, status) {
                    $scope.checkoutsData = response3.data.data;
                    var map = {};
                    var unique = [], duplicatedata = [], sortcompletetransaction = [];
                var sortcompletetransaction = $scope.checkoutsData ;
            for (var i = 0; i < sortcompletetransaction.length; i++)
            {
                if (sortcompletetransaction[i].user in map)                  //if card in map[index] push record the same index
                {
                    var transactions = map[sortcompletetransaction[i].user];
                    transactions.push(sortcompletetransaction[i]);

                } else                                                                //otherwise create a new object
                {
                    var transactions = new Array();
                    transactions.push(sortcompletetransaction[i]);

                    map[sortcompletetransaction[i].user] = transactions;
                }
            }
             var multipletransaction = {}, singletransaction = {};
            for (var i = 0; i < sortcompletetransaction.length; i++)
            {
                for (var j = 0; j < map[sortcompletetransaction[i].user].length; j++)
                {
                    if (map[sortcompletetransaction[i].user].length > 1)
                        multipletransaction[sortcompletetransaction[i].user] = map[sortcompletetransaction[i].user];
                    else
                        singletransaction[sortcompletetransaction[i].user] = map[sortcompletetransaction[i].user];
                }
            }

            for (var key in multipletransaction)
            {
                var data = [];
                data = multipletransaction[key];
                var transacionscount = data.length;
                var j = 0;
                unique.push(data[j]);
                while (transacionscount)
                {

                    if (transacionscount !== 1) {
                        if (data[j].checkouttime === data[j + 1].checkouttime)
                        {
                            duplicatedata.push(data[j + 1]);
                            transacionscount -= 2;
                            j += 1;
                        } else {
                            unique.push(data[j + 1]);
                            transacionscount--;
                            j++;
                        }
                    } else {
                        transacionscount--;
                        j++;
                    }
                }
            }
            for (var key in singletransaction)
            {
                var data = [];
                data = singletransaction[key];
                for (var j = 0; j < data.length; j++)
                {
                    unique.push(data[j]);
                }
            }
            var checkouts = [];                                       //to store the response data
            checkouts = unique;       
                    
//                    var checkouts = []; //to store the response data
//                    checkouts = $scope.checkoutsData;
                    $scope.bridgemembercount = 0, $scope.bridgeemployeecount = 0;
                    $scope.techsupportmembercount = 0, $scope.techsupportemployeecount = 0;
                    for (var i = 0; i < checkouts.length; i++) {
                        if (checkouts[i].origin === "bridge")
                        {
                            for (var n = 0; n < userdetails.length; n++) {
                                if (checkouts[i].user === userdetails[n].UserID)
                                {
                                    if (userdetails[n]._type === 'member')
                                    {
                                        $scope.bridgemembercount++;
                                    } else {
                                        $scope.bridgeemployeecount++;
                                    }
                                }
                            }
                        } else if (checkouts[i].origin === "techSupport")
                        {
                            $scope.techsupportmembercount++;
                        } else if (checkouts[i].origin === "techSupportEmp") {
                            $scope.techsupportemployeecount++;
                        }
                    }
                    $scope.membertotalcheckouts = $scope.bridgemembercount + $scope.techsupportmembercount;
                    $scope.memberbridgepercentage = ($scope.bridgemembercount / $scope.membertotalcheckouts) * 100;
                    $scope.membertechsupportpercentage = ($scope.techsupportmembercount / $scope.membertotalcheckouts) * 100;
                    $scope.employeetotalcheckouts = $scope.bridgeemployeecount + $scope.techsupportemployeecount;
                    $scope.employeebridgepercentage = ($scope.bridgeemployeecount / $scope.employeetotalcheckouts) * 100;
                    $scope.employeetechsupportpercentage = ($scope.techsupportemployeecount / $scope.employeetotalcheckouts) * 100;
            });
        };
});
