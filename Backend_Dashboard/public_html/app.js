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
var idlist = [];                 //to store the _id to delete the opencheckouts
var transaction = [];            //its store the member open checkout
var checkOutData = [], vehicleData = [];
app.controller('customersCtrl', function ($scope, $http) {

    $scope.show_me = true;
    swal({
        title: 'Loading...',
        showCancelButton: false,
        showConfirmButton: false
    }).then(
            $http({
                method: "GET",
                url: baseURL70 + "vehicle", //To find the vehicle Current place
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response, status) {
        $scope.vehicle = response.data.data;

        $scope.memberscount = 0;
        $scope.fleetcount = 0;
        $scope.Dockingportcount = 0;
        $scope.Redistributioncount = 0;
        $scope.Maintenanceareacount = 0;
        $scope.Holdingareacount = 0;
        $scope.Employeescount = 0;
        for (var i = 0; i < $scope.vehicle.length; i++)
        {
            if ($scope.vehicle[i].currentAssociationType === 'member')
                $scope.memberscount++;
            else if ($scope.vehicle[i].currentAssociationType === 'Fleet')
                $scope.fleetcount++;
            else if ($scope.vehicle[i].currentAssociationType === 'Docking-port')
                $scope.Dockingportcount++;
            else if ($scope.vehicle[i].currentAssociationType === 'Redistribution-vehicle')
                $scope.Redistributioncount++;
            else if ($scope.vehicle[i].currentAssociationType === 'Maintenance-area')
                $scope.Maintenanceareacount++;
            else if ($scope.vehicle[i].currentAssociationType === 'Holding-area')
                $scope.Holdingareacount++;
            else if (($scope.vehicle[i].currentAssociationType === 'Operator') || ($scope.vehicle[i].currentAssociationType === 'Holdingarea-employee') || ($scope.vehicle[i].currentAssociationType === 'maintenancecentre-employee') || ($scope.vehicle[i].currentAssociationType === 'registration-employee') || ($scope.vehicle[i].currentAssociationType === 'redistribution-employee'))
                $scope.Employeescount++;
        }
        $http({
            method: "GET",
            url: baseURL70 + "member/negative/balance",
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.memberData = response.data.data;
            var card = [];
            for (var i = 0; i < $scope.memberData.length; i++)
                card.push($scope.memberData[i].cardNum);
            $scope.nege = card;
            $http({
                method: "GET",
                async: true,
                url: ipURL80 + "transactions/open",
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response, status) {
                $scope.employeeData = response.data.data;
                var employees = [];
                $scope.employee = [];
                for (var i = 0; i < $scope.employeeData.length; i++) //Employee CheckOuts
                {
                    if ($scope.employeeData[i]._type !== "member")
                        employees.push($scope.employeeData[i]);
                }
                $scope.employee = employees;
                $scope.employeecount = $scope.employee.length;
            });

            $http({
                method: "GET",
                url: baseURL70 + "dockstation", //station details
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response1, status) {
                $scope.dockingData = response1.data.data;
                dockingstation = $scope.dockingData;
                dockingStatus = 1;
                var cyclecounts = 0;
//            var stationcycles = [];
                for (var j = 0; j < dockingstation.length; j++)                       //To Count Total Bicycle in DockingHub
                {
                    cyclecounts += dockingstation[j].bicycleCount;
//                var stationcyclescount = 0;
//                var portsids = dockingstation[j].portIds;                            //ports
//                for (var k = 0; k < portsids.length; k++)
//                {
//                    if (portsids[k].dockingPortId.vehicleId.length !== 0)
//                        cyclecounts++;
//                    // break;
//                }
//                for (var k = 0; k < portsids.length; k++)
//                {
//                    if (portsids[k].dockingPortId.vehicleId.length !== 0)
//                        stationcyclescount++;
//                    // break;
//                }
//                var stations = {
//                    name: dockingstation[j].name,
//                    count: stationcyclescount
//                };
//                stationcycles.push(stations);
                }
//            $scope.bicyclecount = 0;
//            for (var j = 0; j < stationcycles.length; j++)                       //To Count Total Bicycle in DockingHub
//            {
//                $scope.bicyclecount += stationcycles[j].count;
//            }
                $scope.totalcycle = cyclecounts;
//            $scope.stationscounts = stationcycles;
                $http({
                    method: "GET",
                    url: baseURL70 + "transactions", //Open CheckOuts
                    data: '',
                    headers: {
                        "Content-Type": "application/json"
                    }

                }).then(function (response, status) {
                    $scope.TransactionData = response.data.data;
                    $scope.Opentotalcount = $scope.TransactionData.length;
                    transaction = $scope.TransactionData;
//                swal.close();
//                swal("Its ready to Use");
                    $scope.Transaction = [];
                    $scope.TransactionData = [];
                    $scope.TransactionData1 = [];
                    $scope.TransactionData2 = [];
                    $scope.TransactionData3 = [];
                    $scope.TransactionData4 = [];
                    $scope.TransactionData5 = [];
                    for (var j = 0; j < transaction.length; j++)
                    {
                        var checkouttime = transaction[j].checkOutTime;
                        var today = new Date();
                        var check = new Date(checkouttime);
                        var to = new Date(today);
                        var duration = to.getTime() - check.getTime();
                        var hours = (duration / 3600000); //converting a seconds to Hours
                        if (1.0 > hours) // compare duration lessthan 1 hours
                        {
                            var opencheckoutEntry = {
                                cardNum: transaction[j].user.cardNum,
                                Name: transaction[j].user.Name,
                                vehicleId: transaction[j].vehicle.vehicleNumber,
                                checkoutTime: transaction[j].checkOutTime,
                                port: transaction[j].fromPort.Name,
                                _id: transaction[j]._id,
                                hour: hours
                            };
                            $scope.Transaction.push(opencheckoutEntry);
                            $scope.TransactionData.push(opencheckoutEntry); //push data to new array, the member who are checkout lessthan 1 hours

                        } else if ((1.0 < hours) && (hours < 2.0)) // compare duration more than 1 hours
                        {
                            var opencheckoutEntry = {
                                cardNum: transaction[j].user.cardNum,
                                Name: transaction[j].user.Name,
                                vehicleId: transaction[j].vehicle.vehicleNumber,
                                checkoutTime: transaction[j].checkOutTime,
                                port: transaction[j].fromPort.Name,
                                _id: transaction[j]._id,
                                hour: hours
                            };
                            $scope.Transaction.push(opencheckoutEntry);
                            $scope.TransactionData1.push(opencheckoutEntry); //push data to new array, the member who are checkout morethan 1 hours
                        } else if ((2.0 < hours) && (hours < 3.0)) // compare duration more than 2 hours
                        {
                            var opencheckoutEntry = {
                                cardNum: transaction[j].user.cardNum,
                                Name: transaction[j].user.Name,
                                vehicleId: transaction[j].vehicle.vehicleNumber,
                                checkoutTime: transaction[j].checkOutTime,
                                port: transaction[j].fromPort.Name,
                                _id: transaction[j]._id,
                                hour: hours
                            };
                            $scope.Transaction.push(opencheckoutEntry);
                            $scope.TransactionData2.push(opencheckoutEntry); //push data to new array, the member who are checkout morethan 2 hours
                        } else if ((3.0 < hours) && (hours < 4.0)) // compare duration more than 3 hours
                        {
                            var opencheckoutEntry = {
                                cardNum: transaction[j].user.cardNum,
                                Name: transaction[j].user.Name,
                                vehicleId: transaction[j].vehicle.vehicleNumber,
                                checkoutTime: transaction[j].checkOutTime,
                                port: transaction[j].fromPort.Name,
                                _id: transaction[j]._id,
                                hour: hours
                            };
                            $scope.Transaction.push(opencheckoutEntry);
                            $scope.TransactionData3.push(opencheckoutEntry); //push data to new array, the member who are checkout morethan 3 hours
                        } else if ((4.0 < hours)) // compare duration more than 4 hours
                        {
                            var opencheckoutEntry = {
                                cardNum: transaction[j].user.cardNum,
                                Name: transaction[j].user.Name,
                                vehicleId: transaction[j].vehicle.vehicleNumber,
                                checkoutTime: transaction[j].checkOutTime,
                                port: transaction[j].fromPort.Name,
                                _id: transaction[j]._id,
                                hour: hours
                            };
                            $scope.Transaction.push(opencheckoutEntry);
                            $scope.TransactionData4.push(opencheckoutEntry); //push data to new array, the member who are checkout morethan 4 hours
                        }
//                    if ((5.0 < hours) && (hours < 6.0)) // compare duration more than 5 hours
//                    {
//                    var opencheckoutEntry = {
//                                cardNum:transaction[j].user.cardNum,
//                                Name:transaction[j].user.name,
//                                vehicleId:transaction[j].vehicle.vehicleNumber,
//                                checkoutTime:transaction[j].checkOutTime,
//                                port:transaction[j].fromPort.Name,
//                                _id:transaction[j]._id
//                            };
//                        $scope.TransactionData5.push(opencheckoutEntry); //push data to new array, the member who are checkout morethan 5 hours
//                    }
                    }
                    $scope.count = $scope.TransactionData.length;
                    $scope.count1 = $scope.TransactionData1.length;
                    $scope.count2 = $scope.TransactionData2.length;
                    $scope.count3 = $scope.TransactionData3.length;
                    $scope.count4 = $scope.TransactionData4.length;
                    $scope.total = $scope.Transaction.length;
                    //  $scope.count5 = $scope.TransactionData5.length;
                    var checkoutDetails = [];
                    for (var i = 0; i < transaction.length; i++)
                    {
                        var checkoutEntry = {
                            name: transaction[i].user.Name,
                            card: transaction[i].user.cardNum,
                            checkout: transaction[i].checkOutTime,
                            form: transaction[i].fromPort.Name,
                            vehicle: transaction[i].vehicle.vehicleNumber,
                            VID: transaction[i].vehicle.vehicleUid,
                            id: transaction[i]._id
                        };
                        checkoutDetails.push(checkoutEntry);
                    }
                    var sortcheckoutDetails = _.sortBy(checkoutDetails, 'vehicle');
                    dockingHubsVehicle = dockingstation;
                    var portName = [];
                    var vehicle = [];
                    for (var i = 0; i < sortcheckoutDetails.length; i++)
                    {
                        vehicle.push(sortcheckoutDetails[i].vehicle);
                    }
                    var unique = [];
                    for (var i = 0; i < vehicle.length; i++)
                    {
                        if (vehicle[i] !== vehicle[i + 1])
                            unique.push(vehicle[i]);
                    }
                    for (var i = 0; i < unique.length; i++)
                    {
                        for (var j = 0; j < dockingHubsVehicle.length; j++)
                        {
                            var ports = dockingHubsVehicle[j].portIds;
                            for (var k = 0; k < ports.length; k++)
                            {
                                if (ports[k].dockingPortId.vehicleId.length !== 0)
                                {
                                    if (unique[i] === ports[k].dockingPortId.vehicleId[0].vehicleid.vehicleNumber)
                                    {
                                        var portEntry = {
                                            port: ports[k].dockingPortId.Name,
                                            PortID: ports[k].dockingPortId.PortID,
                                            vehicle: ports[k].dockingPortId.vehicleId[0].vehicleid.vehicleNumber
                                        };
                                        portName.push(portEntry);
                                    }
                                }
                            }
                        }
                    }
                    $scope.ports = portName;
                    vehicleData = portName;
                    $scope.vehiclecount = portName.length;
                    var checkinerror = [], opencheck = [];

                    for (var i = 0; i < portName.length; i++)
                    {
                        for (var j = 0; j < sortcheckoutDetails.length; j++)
                        {
                            if (portName[i].vehicle === sortcheckoutDetails[j].vehicle)
                            {
                                var d1 = sortcheckoutDetails[j].checkout,
                                        d2 = new Date(d1),
                                        minutes = Math.floor((Math.random() * 15) + 12),
                                        checkInTime = new Date(d2.setMinutes(d2.getMinutes() + minutes));
                                sortcheckoutDetails[j].toPort = portName[i].PortID;
                                sortcheckoutDetails[j].checkInTime = checkInTime;

                                checkinerror.push(sortcheckoutDetails[j]);

                                //alert(JSON.stringify(checkindata));
                                //$scope.checkInDataArray.push(checkindata);

                                var checkindata = {
                                    vehicleId: portName[i].vehicle,
                                    toPort: portName[i].PortID,
                                    checkInTime: checkInTime,
                                    forceCheckIn: true
                                };
//            $http({
//                method: "POST",
//                url: ipURL80 + "transactions/checkin/techsup", //checkin
//                data: checkindata,
//                headers: {
//                    "Content-Type": "application/json"
//                }
//            }).then(function (response, status) {
//                $scope.checkinData = response.data.data;
//                sweetAlert("CheckIn Complete");
//            });


                            } else {
                                opencheck.push(sortcheckoutDetails[j]);
                            }
                        }
                    }
                    $scope.checkoutvehicles = [];
                    $scope.checkoutvehicles = checkinerror;
                    checkOutData = checkinerror;
                    $scope.checkoutcount = checkinerror.length;
                });
                from = ["Holding-area", "Maintenance-area", "Redistribution-vehicle", "Fleet"];
//from = ["Maintenance-area"];
                $scope.fromports = from;
                $http({//Holding Area
                    method: "GET",
                    url: baseURL70 + "holdingport",
                    data: '',
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response2, status) {
                    $scope.holdingData = response2.data.data;
                    holding = $scope.holdingData;
                });
                $http({//Fleet
                    method: "GET",
                    url: baseURL70 + "fleet",
                    data: '',
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response2, status) {
                    $scope.fleetData = response2.data.data;
                    fleet = $scope.fleetData;
                });
                $http({//Re-distribution
                    method: "GET",
                    url: baseURL70 + "redistributionport",
                    data: '',
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response2, status) {
                    $scope.redistributionData = response2.data.data;
                    redistribution = $scope.redistributionData;
                });
                $http({//Maintenance Center
                    method: "GET",
                    url: baseURL70 + "maintenanceport",
                    data: '',
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response2, status) {
                    $scope.maintenanceportData = response2.data.data;
                    maintenance = $scope.maintenanceportData;
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
                    $scope.checkoutsData = response3.data.data;
                    var checkouts = []; //to store the response data
                    checkouts = $scope.checkoutsData;
                    $scope.bridgemembercount = 0, $scope.bridgeemployeecount = 0, $scope.Cloudmembercount = 0;
                    $scope.techsupportmembercount = 0, $scope.techsupportemployeecount = 0, $scope.Cloudemployeecount = 0;
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
                        } else if (checkouts[i].origin === "Cloud")
                        {
                            for (var n = 0; n < userdetails.length; n++) {
                                if (checkouts[i].user === userdetails[n].UserID)
                                {
                                    if (userdetails[n]._type === 'member')
                                    {
                                        $scope.Cloudmembercount++;
                                    } else {
                                        $scope.Cloudemployeecount++;
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
                    $scope.membertotalcheckouts = $scope.bridgemembercount + $scope.techsupportmembercount + $scope.Cloudmembercount;
                    $scope.memberbridgepercentage = ($scope.bridgemembercount / $scope.membertotalcheckouts) * 100;
                    $scope.membercloudpercentage = ($scope.Cloudmembercount / $scope.membertotalcheckouts) * 100;
                    $scope.membertechsupportpercentage = ($scope.techsupportmembercount / $scope.membertotalcheckouts) * 100;
                    $scope.employeetotalcheckouts = $scope.bridgeemployeecount + $scope.techsupportemployeecount + $scope.Cloudemployeecount;
                    $scope.employeebridgepercentage = ($scope.bridgeemployeecount / $scope.employeetotalcheckouts) * 100;
                    $scope.employeecloudpercentage = ($scope.Cloudemployeecount / $scope.employeetotalcheckouts) * 100;
                    $scope.employeetechsupportpercentage = ($scope.techsupportemployeecount / $scope.employeetotalcheckouts) * 100;
                    var hourlytotal = []; //Store all the hours total count
                    var nonOperationalhourscheckoutemployee = []; // to store the non operational hours data
                    var nonOperationalhourscheckoutMember = [];
                    for (var j = 6; j < 20; j++)
                    {
                        var hoursEntry = {//to count hourly       
                            time: j + "-" + (j + 1),
                            counts: 0

                        };
                        hourlytotal.push(hoursEntry);
                    }
                    var StationHourlyCheckouts = []; //Store all the stations hourly counts

                    for (var i = 0; i < dockingstation.length; i++)
                    {
                        var hourlycounts = []; //hourly checkout counts
                        for (var j = 6; j < 20; j++)
                        {
                            var hoursEntry = {//to count hourly  in stationwise    
                                time: j + "-" + (j + 1),
                                count: 0

                            };
                            hourlycounts.push(hoursEntry);
                        }
                        var total = 0;
                        var Name = dockingstation[i].name;
                        for (var k = 0; k < checkouts.length; k++) {
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
                                        for (var n = 0; n < userdetails.length; n++) {
                                            if (checkouts[k].user === userdetails[n].UserID)
                                            {
                                                if (userdetails[n]._type === 'member')
                                                {
                                                    hourlycounts[index].count++;
                                                    hourlytotal[index].counts++;
                                                    total++;
                                                }
                                            }
                                        }
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
                        $scope.totalcount += StationHourlyCheckouts[i].total; //to find overall checkouts
                    }
                    $scope.nonoperationalhoursEmployee = nonOperationalhourscheckoutemployee;
                    $scope.nonoperationalhoursEmpcount = nonOperationalhourscheckoutemployee.length;
                    $scope.nonoperationalhoursMebers = nonOperationalhourscheckoutMember;
                    $scope.nonoperationalhoursMeberscount = nonOperationalhourscheckoutMember.length;
//                    var limithours = [];
//                    for (var i = 0; i < hourlytotal.length; i++)
//                    {
//                        if((i>0)&&(i<17))
//                        limithours.push(hourlytotal[i]);
//                    }
                    $scope.hourlyTotals = hourlytotal;

                    $http({
                        method: "GET",
                        url: baseURL60 + "member/validity/before/expiry", //complete transaction
                        data: '',
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(function (response3, status) {
                        $scope.memberdata = response3.data.data;
                        var today = new Date();
                        $scope.tddaydate = today;
                        var month = today.getMonth();
                        var date = today.getDate();
                        $scope.validityexpiretoday = [];
                        $scope.validityexpiredinoneday = [];
                        $scope.validityexpiredintwodays = [];
                        for (var i = 0; i < $scope.memberdata.length; i++)
                        {
                            var validity = $scope.memberdata[i].validity;
                            validity = new Date(validity);
                            var validmonth = validity.getMonth();
                            var validdate = validity.getDate();
                            if (month === validmonth)
                            {
                                if ((date === validdate) || (date === validdate - 1) || (date === validdate - 2))
                                {
                                    var valid = '';
                                    var val = validdate - date;
                                    if (val === 0) {
                                        var data = {
                                            Name: $scope.memberdata[i].Name,
                                            cardNum: $scope.memberdata[i].cardNum,
                                            phoneNumber: $scope.memberdata[i].phoneNumber,
                                            validity: 'Today'
                                        };
                                        $scope.validityexpiretoday.push(data);
                                    } else if (val === 1) {
                                        var data = {
                                            Name: $scope.memberdata[i].Name,
                                            cardNum: $scope.memberdata[i].cardNum,
                                            phoneNumber: $scope.memberdata[i].phoneNumber,
                                            validity: '1 day'
                                        };
                                        $scope.validityexpiredinoneday.push(data);
                                    } else if (val === 2) {
                                        var data = {
                                            Name: $scope.memberdata[i].Name,
                                            cardNum: $scope.memberdata[i].cardNum,
                                            phoneNumber: $scope.memberdata[i].phoneNumber,
                                            validity: '2 days'
                                        };
                                        $scope.validityexpiredintwodays.push(data);
                                    }
                                }
                            }
                        }
                        $scope.validityexpiredtoday = $scope.validityexpiretoday.length;
                        $scope.validityexpiredin1 = $scope.validityexpiredinoneday.length;
                        $scope.validityexpiredin2 = $scope.validityexpiredintwodays.length;
                        swal.close();
                        swal("Its ready to Use");
                    });

                });

            });
        });

    }));
    //var refresh = setInterval(gettransaction, 30000); //setInterval for 30 sec
    function gettransaction()
    {
        idlist = [];
        $http({
            method: "GET",
            url: baseURL70 + "vehicle",
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.vehicle = response.data.data;
            $scope.memberscount = 0;
            $scope.fleetcount = 0;
            $scope.Dockingportcount = 0;
            $scope.Redistributioncount = 0;
            $scope.Maintenanceareacount = 0;
            $scope.Holdingareacount = 0;
            $scope.Employeescount = 0;
            for (var i = 0; i < $scope.vehicle.length; i++)
            {
                if ($scope.vehicle[i].currentAssociationType === 'member')
                    $scope.memberscount++;
                else if ($scope.vehicle[i].currentAssociationType === 'Fleet')
                    $scope.fleetcount++;
                else if ($scope.vehicle[i].currentAssociationType === 'Docking-port')
                    $scope.Dockingportcount++;
                else if ($scope.vehicle[i].currentAssociationType === 'Redistribution-vehicle')
                    $scope.Redistributioncount++;
                else if ($scope.vehicle[i].currentAssociationType === 'Maintenance-area')
                    $scope.Maintenanceareacount++;
                else if ($scope.vehicle[i].currentAssociationType === 'Holding-area')
                    $scope.Holdingareacount++;
                else if (($scope.vehicle[i].currentAssociationType === 'Operator') || ($scope.vehicle[i].currentAssociationType === 'Holdingarea-employee') || ($scope.vehicle[i].currentAssociationType === 'maintenancecentre-employee') || ($scope.vehicle[i].currentAssociationType === 'registration-employee') || ($scope.vehicle[i].currentAssociationType === 'redistribution-employee'))
                    $scope.Employeescount++;
            }
        });
        $http({
            method: "GET",
            url: baseURL70 + "member/negative/balance",
            data: '',
            headers: {
                "Content-Type": "application/json"
            }

        }).then(function (response, status) {
            $scope.memberData = response.data.data;
            var card = [];
            for (var i = 0; i < $scope.memberData.length; i++)
                card.push($scope.memberData[i].cardNum);
            $scope.nege = card;
        });
        $http({
            method: "GET",
            url: baseURL70 + "dockstation", //station details
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response1, status) {
            $scope.dockingData = response1.data.data;
            dockingstation = $scope.dockingData;
            var cyclecounts = 0;
//            var stationcycles = [];
            for (var j = 0; j < dockingstation.length; j++)                       //To Count Total Bicycle in DockingHub
            {
                cyclecounts += dockingstation[j].bicycleCount;
//                var stationcyclescount = 0;
//                var portsids = dockingstation[j].portIds;                            //ports
//                for (var k = 0; k < portsids.length; k++)
//                {
//                    if (portsids[k].dockingPortId.vehicleId.length !== 0)
//                        cyclecounts++;
//                    // break;
//                }
//                for (var k = 0; k < portsids.length; k++)
//                {
//                    if (portsids[k].dockingPortId.vehicleId.length !== 0)
//                        stationcyclescount++;
//                    // break;
//                }
//                var stations = {
//                    name: dockingstation[j].name,
//                    count: stationcyclescount
//                };
//                stationcycles.push(stations);
            }
            $scope.bicyclecount = 0;
//            for (var j = 0; j < stationcycles.length; j++)                       //To Count Total Bicycle in DockingHub
//            {
//                $scope.bicyclecount += stationcycles[j].count;
//            }
            $scope.totalcycle = cyclecounts;
//            $scope.stationscounts = stationcycles;
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
                    $scope.checkoutsData = response3.data.data;
                    var checkouts = []; //to store the response data
                    checkouts = $scope.checkoutsData;
                    $scope.bridgemembercount = 0, $scope.bridgeemployeecount = 0, $scope.Cloudmembercount = 0;
                    $scope.techsupportmembercount = 0, $scope.techsupportemployeecount = 0, $scope.Cloudemployeecount = 0;
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
                        } else if (checkouts[i].origin === "Cloud")
                        {
                            for (var n = 0; n < userdetails.length; n++) {
                                if (checkouts[i].user === userdetails[n].UserID)
                                {
                                    if (userdetails[n]._type === 'member')
                                    {
                                        $scope.Cloudmembercount++;
                                    } else {
                                        $scope.Cloudemployeecount++;
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
                    $scope.membertotalcheckouts = $scope.bridgemembercount + $scope.techsupportmembercount + $scope.Cloudmembercount;
                    $scope.memberbridgepercentage = ($scope.bridgemembercount / $scope.membertotalcheckouts) * 100;
                    $scope.membercloudpercentage = ($scope.Cloudmembercount / $scope.membertotalcheckouts) * 100;
                    $scope.membertechsupportpercentage = ($scope.techsupportmembercount / $scope.membertotalcheckouts) * 100;
                    $scope.employeetotalcheckouts = $scope.bridgeemployeecount + $scope.techsupportemployeecount + $scope.Cloudemployeecount;
                    $scope.employeebridgepercentage = ($scope.bridgeemployeecount / $scope.employeetotalcheckouts) * 100;
                    $scope.employeecloudpercentage = ($scope.Cloudemployeecount / $scope.employeetotalcheckouts) * 100;
                    $scope.employeetechsupportpercentage = ($scope.techsupportemployeecount / $scope.employeetotalcheckouts) * 100;
                    var hourlytotal = []; //Store all the hours total count
                    var nonOperationalhourscheckoutemployee = []; // to store the non operational hours data
                    var nonOperationalhourscheckoutMember = [];
                    for (var j = 6; j < 20; j++)
                    {
                        var hoursEntry = {//to count hourly       
                            time: j + "-" + (j + 1),
                            counts: 0

                        };
                        hourlytotal.push(hoursEntry);
                    }
                    var StationHourlyCheckouts = []; //Store all the stations hourly counts

                    for (var i = 0; i < dockingstation.length; i++)
                    {
                        var hourlycounts = []; //hourly checkout counts
                        for (var j = 6; j < 20; j++)
                        {
                            var hoursEntry = {//to count hourly  in stationwise    
                                time: j + "-" + (j + 1),
                                count: 0

                            };
                            hourlycounts.push(hoursEntry);
                        }
                        var total = 0;
                        var Name = dockingstation[i].name;
                        for (var k = 0; k < checkouts.length; k++) {
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
                                        for (var n = 0; n < userdetails.length; n++) {
                                            if (checkouts[k].user === userdetails[n].UserID)
                                            {
                                                if (userdetails[n]._type === 'member')
                                                {
                                                    hourlycounts[index].count++;
                                                    hourlytotal[index].counts++;
                                                    total++;
                                                }
                                            }
                                        }
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
                        $scope.totalcount += StationHourlyCheckouts[i].total; //to find overall checkouts
                    }
                    $scope.nonoperationalhoursEmployee = nonOperationalhourscheckoutemployee;
                    $scope.nonoperationalhoursEmpcount = nonOperationalhourscheckoutemployee.length;
                    $scope.nonoperationalhoursMebers = nonOperationalhourscheckoutMember;
                    $scope.nonoperationalhoursMeberscount = nonOperationalhourscheckoutMember.length;
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
        $http({
            method: "GET",
            async: true,
            url: ipURL80 + "transactions/open", //Employee opencheckouts in local
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.employeeData = response.data.data;
            var employees = [];
            $scope.employee = [];
            for (var i = 0; i < $scope.employeeData.length; i++)                   //Employee CheckOuts
            {
                if ($scope.employeeData[i]._type !== "member")
                    employees.push($scope.employeeData[i]);
            }
            $scope.employee = employees;
            $scope.employeecount = $scope.employee.length;
        });
        $http({
            method: "GET",
            url: baseURL70 + "transactions", //Open CheckOuts
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.TransactionData = response.data.data;
            $scope.Opentotalcount = $scope.TransactionData.length;
            transaction = $scope.TransactionData;
            $scope.TransactionData = [];
            $scope.Transaction = [];
            $scope.TransactionData1 = [];
            $scope.TransactionData2 = [];
            $scope.TransactionData3 = [];
            $scope.TransactionData4 = [];
            $scope.TransactionData5 = [];
            for (var j = 0; j < transaction.length; j++)
            {
                var checkouttime = transaction[j].checkOutTime;
                var today = new Date();
                var check = new Date(checkouttime);
                var to = new Date(today);
                var duration = to.getTime() - check.getTime();
                var hours = (duration / 3600000); //converting a seconds to Hours
                if (1.0 > hours) // compare duration lessthan 1 hours
                {
                    var opencheckoutEntry = {
                        cardNum: transaction[j].user.cardNum,
                        Name: transaction[j].user.Name,
                        vehicleId: transaction[j].vehicle.vehicleNumber,
                        checkoutTime: transaction[j].checkOutTime,
                        port: transaction[j].fromPort.Name,
                        _id: transaction[j]._id,
                        hour: hours
                    };
                    $scope.Transaction.push(opencheckoutEntry);
                    $scope.TransactionData.push(opencheckoutEntry); //push data to new array, the member who are checkout lessthan 1 hours
                } else if ((1.0 < hours) && (hours < 2.0)) // compare duration more than 1 hours
                {
                    var opencheckoutEntry = {
                        cardNum: transaction[j].user.cardNum,
                        Name: transaction[j].user.Name,
                        vehicleId: transaction[j].vehicle.vehicleNumber,
                        checkoutTime: transaction[j].checkOutTime,
                        port: transaction[j].fromPort.Name,
                        _id: transaction[j]._id,
                        hour: hours
                    };
                    $scope.Transaction.push(opencheckoutEntry);
                    $scope.TransactionData1.push(opencheckoutEntry); //push data to new array, the member who are checkout morethan 1 hours
                } else if ((2.0 < hours) && (hours < 3.0)) // compare duration more than 2 hours
                {
                    var opencheckoutEntry = {
                        cardNum: transaction[j].user.cardNum,
                        Name: transaction[j].user.Name,
                        vehicleId: transaction[j].vehicle.vehicleNumber,
                        checkoutTime: transaction[j].checkOutTime,
                        port: transaction[j].fromPort.Name,
                        _id: transaction[j]._id,
                        hour: hours
                    };
                    $scope.Transaction.push(opencheckoutEntry);
                    $scope.TransactionData2.push(opencheckoutEntry); //push data to new array, the member who are checkout morethan 2 hours
                } else if ((3.0 < hours) && (hours < 4.0)) // compare duration more than 3 hours
                {
                    var opencheckoutEntry = {
                        cardNum: transaction[j].user.cardNum,
                        Name: transaction[j].user.Name,
                        vehicleId: transaction[j].vehicle.vehicleNumber,
                        checkoutTime: transaction[j].checkOutTime,
                        port: transaction[j].fromPort.Name,
                        _id: transaction[j]._id,
                        hour: hours
                    };
                    $scope.Transaction.push(opencheckoutEntry);
                    $scope.TransactionData3.push(opencheckoutEntry); //push data to new array, the member who are checkout morethan 3 hours
                } else if ((4.0 < hours)) // compare duration more than 4 hours
                {
                    var opencheckoutEntry = {
                        cardNum: transaction[j].user.cardNum,
                        Name: transaction[j].user.Name,
                        vehicleId: transaction[j].vehicle.vehicleNumber,
                        checkoutTime: transaction[j].checkOutTime,
                        port: transaction[j].fromPort.Name,
                        _id: transaction[j]._id,
                        hour: hours
                    };
                    $scope.Transaction.push(opencheckoutEntry);
                    $scope.TransactionData4.push(opencheckoutEntry); //push data to new array, the member who are checkout morethan 4 hours
                }
//                    if ((5.0 < hours) && (hours < 6.0)) // compare duration more than 5 hours
//                    {
//                    var opencheckoutEntry = {
//                                cardNum:transaction[j].user.cardNum,
//                                Name:transaction[j].user.name,
//                                vehicleId:transaction[j].vehicle.vehicleNumber,
//                                checkoutTime:transaction[j].checkOutTime,
//                                port:transaction[j].fromPort.Name,
//                                _id:transaction[j]._id
//                            };
//                        $scope.TransactionData5.push(opencheckoutEntry); //push data to new array, the member who are checkout morethan 5 hours
//                    }
            }
            $scope.count = $scope.TransactionData.length;
            $scope.count1 = $scope.TransactionData1.length;
            $scope.count2 = $scope.TransactionData2.length;
            $scope.count3 = $scope.TransactionData3.length;
            $scope.count4 = $scope.TransactionData4.length;
            $scope.total = $scope.Transaction.length;
            //  $scope.count5 = $scope.TransactionData5.length;
            var checkoutDetails = [];
            for (i = 0; i < transaction.length; i++)
            {
                var checkoutEntry = {
                    name: transaction[i].user.Name,
                    card: transaction[i].user.cardNum,
                    checkout: transaction[i].checkOutTime,
                    form: transaction[i].fromPort.Name,
                    vehicle: transaction[i].vehicle.vehicleNumber,
                    id: transaction[i]._id
                };
                checkoutDetails.push(checkoutEntry);
            }
            var sortcheckoutDetails = _.sortBy(checkoutDetails, 'vehicle');
            dockingHubsVehicle = dockingstation;
            var portName = [];
            var vehicle = [];
            for (var i = 0; i < sortcheckoutDetails.length; i++)
            {
                vehicle.push(sortcheckoutDetails[i].vehicle);
            }
            var unique = [];
            for (var i = 0; i < vehicle.length; i++)
            {
                if (vehicle[i] !== vehicle[i + 1])
                    unique.push(vehicle[i]);
            }
            for (var i = 0; i < unique.length; i++)
            {
                for (var j = 0; j < dockingHubsVehicle.length; j++)
                {
                    var ports = dockingHubsVehicle[j].portIds;
                    for (var k = 0; k < ports.length; k++)
                    {
                        if (ports[k].dockingPortId.vehicleId.length !== 0)
                        {
                            if (unique[i] === ports[k].dockingPortId.vehicleId[0].vehicleid.vehicleNumber)
                            {
                                var portEntry = {
                                    port: ports[k].dockingPortId.Name,
                                    vehicle: ports[k].dockingPortId.vehicleId[0].vehicleid.vehicleNumber,
                                    portID: ports[k].PortID
                                };
                                portName.push(portEntry);
                            }
                        }
                    }
                }
            }
            $scope.ports = portName;
            vehicleData = portName;
            $scope.vehiclecount = portName.length;
            var checkinerror = [], opencheck = [];

            for (var i = 0; i < portName.length; i++)
            {
                for (var j = 0; j < sortcheckoutDetails.length; j++)
                {
                    if (portName[i].vehicle === sortcheckoutDetails[j].vehicle)
                    {
                        var d1 = sortcheckoutDetails[j].checkout,
                                d2 = new Date(d1),
                                minutes = Math.floor((Math.random() * 15) + 12),
                                checkInTime = new Date(d2.setMinutes(d2.getMinutes() + minutes));
                        sortcheckoutDetails[j].toPort = portName[i].PortID;
                        sortcheckoutDetails[j].checkInTime = checkInTime;

                        checkinerror.push(sortcheckoutDetails[j]);

                        //alert(JSON.stringify(checkindata));
                        //$scope.checkInDataArray.push(checkindata);

                    } else {
                        opencheck.push(sortcheckoutDetails[j]);
                    }
                }
            }
//                    $scope.checkoutvehicle = checkinerror;
            checkOutData = checkinerror;
            $scope.checkoutcount = checkinerror.length;

        });
    }

    $scope.selecteddockingstation = function (data) {                   //Docking Station  names and Ip address
//        stationname = data;
        stationid = data.StationID;
        // alert(stationid);
    };
    $scope.clearUndermaintaince = function () {                                  //to clear the Undermaintaince

        $http({
            method: 'DELETE',
            url: ipURL80 + 'transactions/clear/all/ports/' + stationid,
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.bridgeData = response2.data;
            sweetAlert($scope.bridgeData.message);
        });
    };
    $scope.selectedList = function (selected, id) {
        //idlist = [];
//        var idx = idlist.indexOf(id);
//        if (selected) {
//
//            idlist.push(id);
//        } else
//        {
//            idlist.splice(idx, 1);
//        }
    };
    $scope.checkInCreate = function (data) {
        var checkindata = {
            vehicleId: data.vehicle,
            toPort: data.toPort,
            checkInTime: data.checkInTime,
            forceCheckIn: true
        };
        $http({
            method: "POST",
            url: ipURL80 + "transactions/checkin/techsup", //checkin
            data: checkindata,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.checkinData = response.data.data;
            sweetAlert("CheckIn Complete");
        });
    };
    $scope.deleteopencheckouts = function () {                                          //delete the opentransaction in sdc
        var idlists = idlist;
        idlist = [];
        for (var i = 0; i < idlists.length; i++)
        {
            $http({
                method: 'DELETE',
                url: baseURL60 + 'transactions/' + idlists[i],
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
    $scope.deleteEmployeeopencheckouts = function () {                                          //delete the Employee opentransaction in local
        var idlists = idlist;
        idlist = [];
        for (var i = 0; i < idlists.length; i++)
        {
            $http({
                method: 'DELETE',
                url: ipURL90 + 'transactions/clear/checkout/' + idlists[i], //in local
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
    $scope.getmemberinformations = function (cards)                                              //get member details in negative balance
    {
        var card1 = parseInt(cards, 10);
//        var data = {
//            name: card1
//        };
        $http({
            method: "GET",
            url: baseURL70 + "users/search/" + card1, //Take a particular member details
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.memberData = response2.data.data;
            memberdetails = $scope.memberData;
            for (var i = 0; i < memberdetails.length; i++)
            {
                statuses = memberdetails[i].status;
                valdity = memberdetails[i].validity;
                $scope.name1 = memberdetails[i].Name + '  ' + memberdetails[i].lastName; //member Name
                $scope.bal = memberdetails[i].creditBalance; //member balance
                $scope.phone = memberdetails[i].phoneNumber; //member phonenumber
                $scope.card = memberdetails[i].cardNum;
                $scope.statuscolour = memberdetails[i].status;
                $scope.memberprofilePic = imgsrc + memberdetails[i].UserID + '/' + memberdetails[i].profilePic + '.png'; //member profilepic 
                //$scope.statuscolor = status;
                break;
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
        });
        //var negativebal = [];
        $http({
            method: "GET",
            url: baseURL70 + "transactions/myrides/all/" + card1, //complete transaction
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response3, status) {
            $scope.completeCardData = response3.data.data;
//            $scope.negativeBalance = $scope.completeCardData;
            negativeBal = $scope.completeCardData;
            $scope.name = negativeBal[0].user.Name;
            $scope.card1 = negativeBal[0].user.cardNum;
            $scope.negativeBalance = negativeBal;
            card = $scope.card1;
        });
        $scope.show_me = false;
    };
    $scope.popup = function (cardnumber) {                //Display information opentransaction cardNum click 
//        var popdata = {
//            name: cardnumber
//        };
        var card1 = parseInt(cardnumber, 10);
        $http({
            method: "GET",
            url: baseURL70 + "users/search/" + card1, //Take a particular member details
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.popData = response2.data.data;
            $scope.popmemberprofilePic = "images.png";
            $scope.popcard = ' ';
            $scope.popname = ' ';
            $scope.popphone = ' ';
            $scope.popstatus = '';
            $scope.popbal = '';
            $scope.popvalid = '';
            memberdetails = $scope.popData;
            for (var i = 0; i < memberdetails.length; i++)
            {
                statuses = memberdetails[i].status;
                valdity = memberdetails[i].validity;
                $scope.popname = memberdetails[i].Name + '  ' + memberdetails[i].lastName; //member Name
                $scope.popbal = memberdetails[i].creditBalance; //member balance
                $scope.popphone = memberdetails[i].phoneNumber; //member phonenumber
                $scope.popcard = memberdetails[i].cardNum;
                $scope.popstatuscolour = memberdetails[i].status;
                $scope.popmemberprofilePic = imgsrc + memberdetails[i].UserID + '/' + memberdetails[i].profilePic + '.png'; //member profilepic 
                //$scope.statuscolor = status;
                break;
            }
            if ($scope.popbal < 0)
                swal("Negative Balance\n" + $scope.popbal);
            else if ($scope.popbal === 0)
                swal("Zero Balance\n" + $scope.popbal);
            var valdate = new Date(valdity);
            var vdate = valdate.getDate();
            var vmonth = valdate.getMonth() + 1;
            var vyear = valdate.getFullYear();
            $scope.popvalid = vdate + "-" + vmonth + "-" + vyear;
            if (statuses === 1)
            {
                $scope.popstatus = " Registered ";
                $scope.popstatuscolor = 1;
            } else if (statuses === 0)
            {
                $scope.popstatus = "Prospective";
                $scope.popstatuscolor = 0;
            } else if (statuses === -1)
            {
                $scope.popstatus = "Cancelled";
                $scope.popstatuscolor = -1;
            } else if (statuses === -2)
            {
                $scope.popstatus = "Suspended";
                $scope.popstatuscolor = -2;
            }
            if ((statuses === -3) || (valdate < todayDate))
            {
                $scope.popstatus = "Valdity Expired ";
                $scope.popstatuscolor = -3;
            }
            swal({
                title: '<h3><b>' + $scope.popcard + '</b></h3>' + '<h3  align="left">' + "\n<b>Name:</b>" + $scope.popname + "\n<b>Phone:</b>" + ($scope.popphone).substring(3) + "\n<b>Status:</b>" + $scope.popstatus + "\n<b>Balance:</b>" + $scope.popbal + "\n<b>Valid:</b>" + $scope.popvalid + '</h3>',
                imageUrl: $scope.popmemberprofilePic
            });
        });
    };
    $scope.transactiondelete = function (id) {                                  //delete a complete transaction in negative blance
        removeid = id;
        id1 = 'transactions/correction/' + id;
        $http({
            method: 'DELETE',
            url: baseURL60 + id1,
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.deleteData = response2.data;
            sweetAlert($scope.deleteData.message);
            $scope.negativeBalance = negativeBal;
            var index;
            for (var i = 0; i < negativeBal.length; i++)
                if (id === negativeBal[i]._id)
                    index = i;
            $scope.negativeBalance.splice(index, 1);
            $scope.amount = $scope.negativeBalance[0].creditBalance;
            if ($scope.negativeBalance.length === 0)
                $scope.amount = 50;
            balance = $scope.amount;
        });
    };
//     $scope.CreditData = function (card, balance) {                        //To add a balance in mangage Balance
//        var data = {
//            credit: balance
//        };
//        $http({
//            method: "PUT",
//            url: baseURL60 + 'member/' + card + '/credit/correction',
//            data: data,
//            headers: {
//                "Content-Type": "application/json"
//            }
//        }).then(function (response2, status) {
//            $scope.creditData = response2.data.message;
//            sweetAlert($scope.creditData);
//            $scope.card = '';
//            $scope.balance = '';
//        });
//    };

    $scope.BalanceUpdate = function (card, balance1) {
        var data = {
            credit: balance1
        };
        $http({
            method: "PUT",
            url: baseURL60 + 'member/' + card + '/credit/correction',
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.creditData = response2.data.message;
            alert($scope.creditData);
            var index;
            for (var i = 0; i < $scope.nege.length; i++)
                if (card === $scope.nege[i])
                    index = i;
            $scope.nege.splice(index, 1);
            $scope.bal = balance1;
//            if(swal($scope.creditData))
//            {
            $scope.show_me = true;
            //   }
        });
    };
    $scope.BackList = function () {
        $scope.name = '';
        $scope.card1 = '';
        $scope.amount = '';
        $scope.memberprofilePic = "images.png";
        $scope.negativeBalance = [];
        $scope.show_me = true;
    };
    var portids = [], len;
    $scope.loadports = function (id)
    {
        $scope.portsEntry = {
            FPGA31: "",
            FPGA32: "",
            FPGA33: "",
            FPGA34: "",
            FPGA41: "",
            FPGA42: "",
            FPGA43: "",
            FPGA44: "",
            FPGA51: "",
            FPGA52: "",
            FPGA53: "",
            FPGA54: "",
            FPGA61: "",
            FPGA62: "",
            FPGA63: "",
            FPGA64: ""
        };
        $scope.socket = {
            FPGA31: "",
            FPGA32: "",
            FPGA33: "",
            FPGA34: "",
            FPGA41: "",
            FPGA42: "",
            FPGA43: "",
            FPGA44: "",
            FPGA51: "",
            FPGA52: "",
            FPGA53: "",
            FPGA54: "",
            FPGA61: "",
            FPGA62: "",
            FPGA63: "",
            FPGA64: ""
        };
        var ports = [];
        var Name;
        var oldcyclenumber = [];
        for (var i = 0; i < dockingstation.length; i++)
            if (id.StationID === dockingstation[i].StationID)
            {
                ports = dockingstation[i].portIds;
                Name = dockingstation[i].name;
                break;
            }
        portids = [];
        $scope.stationname = Name;
        $scope.port = ports.length;
        if ($scope.port === 16)
            len = 4;
        else
            len = 3;
        for (var i = 0; i < ports.length; i++) {
            if (ports[i].dockingPortId.FPGA === 3)
            {
                if (ports[i].dockingPortId.ePortNumber === 1)
                {
                    portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.portsEntry.FPGA31 = '';
                    else
                        $scope.portsEntry.FPGA31 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                } else if (ports[i].dockingPortId.ePortNumber === 2)
                {
                    portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.portsEntry.FPGA32 = '';
                    else
                        $scope.portsEntry.FPGA32 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                } else if (ports[i].dockingPortId.ePortNumber === 3)
                {
                    portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.portsEntry.FPGA33 = '';
                    else
                        $scope.portsEntry.FPGA33 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                } else if (ports[i].dockingPortId.ePortNumber === 4)
                {
                    portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.portsEntry.FPGA34 = '';
                    else
                        $scope.portsEntry.FPGA34 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                }
            } else if (ports[i].dockingPortId.FPGA === 4)
            {
                if (ports[i].dockingPortId.ePortNumber === 1)
                {
                    portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.portsEntry.FPGA41 = '';
                    else
                        $scope.portsEntry.FPGA41 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                } else if (ports[i].dockingPortId.ePortNumber === 2)
                {
                    portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.portsEntry.FPGA42 = '';
                    else
                        $scope.portsEntry.FPGA42 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                } else if (ports[i].dockingPortId.ePortNumber === 3)
                {
                    portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.portsEntry.FPGA43 = '';
                    else
                        $scope.portsEntry.FPGA43 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                } else if (ports[i].dockingPortId.ePortNumber === 4)
                {
                    portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.portsEntry.FPGA44 = '';
                    else
                        $scope.portsEntry.FPGA44 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                }
            } else if (ports[i].dockingPortId.FPGA === 5)
            {
                if (ports[i].dockingPortId.ePortNumber === 1)
                {
                    portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.portsEntry.FPGA51 = '';
                    else
                        $scope.portsEntry.FPGA51 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                } else if (ports[i].dockingPortId.ePortNumber === 2)
                {
                    portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.portsEntry.FPGA52 = '';
                    else
                        $scope.portsEntry.FPGA52 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                } else if (ports[i].dockingPortId.ePortNumber === 3)
                {
                    portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.portsEntry.FPGA53 = '';
                    else
                        $scope.portsEntry.FPGA53 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                } else if (ports[i].dockingPortId.ePortNumber === 4)
                {
                    portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.portsEntry.FPGA54 = '';
                    else
                        $scope.portsEntry.FPGA54 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                }
            } else if (ports[i].dockingPortId.FPGA === 6)
            {
                if (ports[i].dockingPortId.ePortNumber === 1)
                {
                    portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.portsEntry.FPGA61 = '';
                    else
                        $scope.portsEntry.FPGA61 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                } else if (ports[i].dockingPortId.ePortNumber === 2)
                {
                    portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.portsEntry.FPGA62 = '';
                    else
                        $scope.portsEntry.FPGA62 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                } else if (ports[i].dockingPortId.ePortNumber === 3)
                {
                    portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.portsEntry.FPGA63 = '';
                    else
                        $scope.portsEntry.FPGA63 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                } else if (ports[i].dockingPortId.ePortNumber === 4)
                {
                    portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.portsEntry.FPGA64 = '';
                    else
                        $scope.portsEntry.FPGA64 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                }
            }
        }
        var x = 0;
        for (var key in $scope.portsEntry)
        {
            oldcyclenumber.push($scope.portsEntry[key]);
            x++;
            if (x === len * 4)
                break;
        }
        oldcycles = oldcyclenumber;

        var data = {
            stationname: id.name
        };
        $scope.SocketstationName = data.stationname;
        $http({
            method: "POST",
            url: ipURL80 + "socketport", //complete transaction
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response3, status) {
            $scope.socketdata = response3.data.data;
            var socketPorts = $scope.socketdata;

            for (var i = 0; i < socketPorts.length; i++) {
                if (socketPorts[i].FPGA === 3)
                {
                    if (socketPorts[i].ePortNumber === 1)
                    {
                        if (socketPorts[i].vehicleId.length === 0)
                            $scope.socket.FPGA31 = '';
                        else
                            $scope.socket.FPGA31 = (socketPorts[i].vehicleId[0].vehicleNumber).substring(10);
                    } else if (socketPorts[i].ePortNumber === 2) {
                        if (socketPorts[i].vehicleId.length === 0)
                            $scope.socket.FPGA32 = '';
                        else
                            $scope.socket.FPGA32 = (socketPorts[i].vehicleId[0].vehicleNumber).substring(10);
                    } else if (socketPorts[i].ePortNumber === 3) {
                        if (socketPorts[i].vehicleId.length === 0)
                            $scope.socket.FPGA33 = '';
                        else
                            $scope.socket.FPGA33 = (socketPorts[i].vehicleId[0].vehicleNumber).substring(10);
                    } else if (socketPorts[i].ePortNumber === 4) {
                        if (socketPorts[i].vehicleId.length === 0)
                            $scope.socket.FPGA34 = '';
                        else
                            $scope.socket.FPGA34 = (socketPorts[i].vehicleId[0].vehicleNumber).substring(10);
                    }
                } else if (socketPorts[i].FPGA === 4) {
                    if (socketPorts[i].ePortNumber === 1)
                    {
                        if (socketPorts[i].vehicleId.length === 0)
                            $scope.socket.FPGA41 = '';
                        else
                            $scope.socket.FPGA41 = (socketPorts[i].vehicleId[0].vehicleNumber).substring(10);
                    } else if (socketPorts[i].ePortNumber === 2) {
                        if (socketPorts[i].vehicleId.length === 0)
                            $scope.socket.FPGA42 = '';
                        else
                            $scope.socket.FPGA42 = (socketPorts[i].vehicleId[0].vehicleNumber).substring(10);
                    } else if (socketPorts[i].ePortNumber === 3) {
                        if (socketPorts[i].vehicleId.length === 0)
                            $scope.socket.FPGA43 = '';
                        else
                            $scope.socket.FPGA43 = (socketPorts[i].vehicleId[0].vehicleNumber).substring(10);
                    } else if (socketPorts[i].ePortNumber === 4) {
                        if (socketPorts[i].vehicleId.length === 0)
                            $scope.socket.FPGA44 = '';
                        else
                            $scope.socket.FPGA44 = (socketPorts[i].vehicleId[0].vehicleNumber).substring(10);
                    }
                } else if (socketPorts[i].FPGA === 5) {
                    if (socketPorts[i].ePortNumber === 1)
                    {
                        if (socketPorts[i].vehicleId.length === 0)
                            $scope.socket.FPGA51 = '';
                        else
                            $scope.socket.FPGA51 = (socketPorts[i].vehicleId[0].vehicleNumber).substring(10);
                    } else if (socketPorts[i].ePortNumber === 2) {

                        if (socketPorts[i].vehicleId.length === 0)
                            $scope.socket.FPGA52 = '';
                        else
                            $scope.socket.FPGA52 = (socketPorts[i].vehicleId[0].vehicleNumber).substring(10);
                    } else if (socketPorts[i].ePortNumber === 3) {
                        if (socketPorts[i].vehicleId.length === 0)
                            $scope.socket.FPGA53 = '';
                        else
                            $scope.socket.FPGA53 = (socketPorts[i].vehicleId[0].vehicleNumber).substring(10);
                    } else if (socketPorts[i].ePortNumber === 4) {
                        if (socketPorts[i].vehicleId.length === 0)
                            $scope.socket.FPGA54 = '';
                        else
                            $scope.socket.FPGA54 = (socketPorts[i].vehicleId[0].vehicleNumber).substring(10);
                    }
                } else if (socketPorts[i].FPGA === 6) {
                    if (socketPorts[i].ePortNumber === 1)
                    {
                        if (socketPorts[i].vehicleId.length === 0)
                            $scope.socket.FPGA61 = '';
                        else
                            $scope.socket.FPGA61 = (socketPorts[i].vehicleId[0].vehicleNumber).substring(10);
                    } else if (socketPorts[i].ePortNumber === 2) {
                        if (socketPorts[i].vehicleId.length === 0)
                            $scope.socket.FPGA62 = '';
                        else
                            $scope.socket.FPGA62 = (socketPorts[i].vehicleId[0].vehicleNumber).substring(10);
                    } else if (socketPorts[i].ePortNumber === 3) {
                        if (socketPorts[i].vehicleId.length === 0)
                            $scope.socket.FPGA63 = '';
                        else
                            $scope.socket.FPGA63 = (socketPorts[i].vehicleId[0].vehicleNumber).substring(10);
                    } else if (socketPorts[i].ePortNumber === 4) {
                        if (socketPorts[i].vehicleId.length === 0)
                            $scope.socket.FPGA64 = '';
                        else
                            $scope.socket.FPGA64 = (socketPorts[i].vehicleId[0].vehicleNumber).substring(10);
                    }
                }
            }
        });




    };
    $scope.submitports = function ()            //to port clear and port checkin
    {
        var cyclenumber = [];
        var y = 0;
        for (var key in $scope.portsEntry)
        {
            cyclenumber.push($scope.portsEntry[key]);
            y++;
            if (y === len * 4)
                break;
        }
//        alert(cyclenumber.length);
//      }
//        alert(cyclenumber + "\n" + portids);
        var checkin = [], forceList = [];
        for (var i = 0; i < cyclenumber.length; i++)
        {
            if (cyclenumber[i] > 0)
            {
                var checkinEntry = {
                    vehicleId: 'MYS-Fleet-' + cyclenumber[i],
                    portId: portids[i]
                };
                forceList.push(checkinEntry);
            } else
            {
                var checkinEntry = {
                    vehicleId: '-',
                    portId: portids[i]
                };
                forceList.push(checkinEntry);
            }
        }
        for (var i = 0; i < cyclenumber.length; i++)
        {
            if (cyclenumber[i] !== oldcycles[i]) {
                if (cyclenumber[i] > 0)
                {
                    var checkinEntry = {
                        cycle: 'MYS-Fleet-' + cyclenumber[i],
                        portID: portids[i]
                    };
                    checkin.push(checkinEntry);
                }
            }
        }
        var portstatus = 0;
        for (var i = 0; i < forceList.length; i++) {
            var portsclear = {
                forceList: forceList
            };
            swal("Wait....");
            $http({
                method: "POST",
                url: baseURL60 + "vehicle/force", //Ports clear
                data: portsclear,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response, status) {
                $scope.checkinData = response.data.data;
                portstatus++;
                if (portstatus === forceList.length)
                    sweetAlert("Port Status Update");
            });
        }
//        var checkinsuccess = [], checkinfailure = [];
        for (var i = 0; i < checkin.length; i++) {
            var checkindata = {
                vehicleId: checkin[i].cycle,
                toPort: checkin[i].portID,
                checkInTime: new Date()
            };
            swal("Wait....");
            $http({
                method: "POST",
                url: ipURL80 + "transactions/checkin/techsup", //checkin
                data: checkindata,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response, status) {
                $scope.checkinData = response.data.data;
                sweetAlert("CheckIn Complete");
//                if ($scope.checkinData.errorStatus === 1)
//                    checkinfailure.push($scope.checkinData);
//                else
//                    checkinsuccess.push($scope.checkinData);
//                if (checkin.length === (checkinfailure.length + checkinsuccess.length))
//                {
//                    if (checkinfailure.length > 0)
//                        sweetAlert(checkinfailure.length + "\tports\t" + checkinfailure.errorMsg);
//                    else
//                        sweetAlert(checkinsuccess.length + "\tports\t" + response.data.message);
//                }
            });
        }
    };
    $scope.deleteLocal = function () {                                  //to clear the bridge   in manage Transactions
//        id1 = 'transactions/clearall/';
        swal({
            title: 'Are you sure?',
            text: "You want clear Local!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, clear it!'
        }).then(function () {
            $http({
                method: 'DELETE',
                url: ipURL80 + 'routine/local',
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response2, status) {
                $scope.localrestData = response2.data;
//            sweetAlert($scope.myData2);
                sweetAlert($scope.localrestData.message);
            });
        });
    };
    $scope.Userreset = function () {                                  //to clear the vehicle 
//        id1 = 'transactions/clearall/';
        swal({
            title: 'Are you sure?',
            text: "You want clear User!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, clear it!'
        }).then(function () {
            $http({
                method: 'PUT',
                url: baseURL60 + 'users/all/clear/vehicles',
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response2, status) {
                $scope.userrestData = response2.data;
//            sweetAlert($scope.myData2);
                sweetAlert($scope.userrestData.message);
            });
        });
    };
    $scope.deleteBridge = function () {                                  //to clear the bridge   in manage Transactions
//        id1 = 'transactions/clearall/';
        swal({
            title: 'Are you sure?',
            text: "You want clear!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, clear it!'
        }).then(function () {
            $http({
                method: 'DELETE',
                url: ipURL80 + 'transactions/clearall',
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response2, status) {
                $scope.bridgeData = response2.data;
                sweetAlert($scope.bridgeData.message);
            });
        });
    };
    $scope.distributionselecteddockingstation = function (data)                    //Docking Station  names and Ip address
    {
        if (maintenance[0]._type === data)
        {
            $scope.stationnames = maintenance;
            areas = maintenance;
            $scope.distributioncentername = "Maintenance-area";
        } else if (fleet[0]._type === data) {
            $scope.stationnames = fleet;
            areas = fleet;
            $scope.distributioncentername = "Fleet";
        } else if (redistribution[0]._type === data) {
            $scope.stationnames = redistribution;
            areas = redistribution;
            $scope.distributioncentername = "Redistribution-vehicle";
        } else if (holding[0]._type === data) {
            $scope.stationnames = holding;
            areas = holding;
            $scope.distributioncentername = "Holding-area";
        }
    };
    $scope.selecteddockingstationports = function (data)
    {
        for (var i = 0; i < areas.length; i++)
            if (areas[i].Name === data.Name)
                distributionpoertsids = areas[i]._id;
    };

    var cycles = [];
    var x = [];
    $scope.list = [];
    $scope.addcycledistribution = function ()
    {
        var distributioncyclenumber = "MYS-Fleet-" + $scope.cycleno;
        cycles.push(distributioncyclenumber);
//         x = document.getElementById("mySelect");
//        var option = document.createElement("option");
//        option.text = $scope.cycleno;
//        x.add(option, x[0]);
        $scope.cycleno = '';

        $scope.list = cycles;
    };
    $scope.lists = function (data) {
        for (var i = 0; i < cycles.length; i++)
        {
            if (data === cycles[i])
                cycles.splice(i, 1);
        }
    };
    $scope.distributioncyclecheckins = function ()                                      //CheckIn
    {
        var distributioncyclenumber = cycles;
        cycles = [];
        $scope.list = [];
//        var distributioncyclenumber = "MYS-Fleet-" + $scope.cycleno;
        var todayDate = new Date(); //current date
        for (var i = 0; i < distributioncyclenumber.length; i++)
        {
//            x.remove(x[i]);
            var datacomplete = {// get the  complete transaction
                vehicleId: distributioncyclenumber[i],
                cardId: $scope.cardNum,
                toPort: distributionpoertsids,
                checkInTime: todayDate
            };
            $http({
                method: "POST",
                url: baseURL60 + "transactions/checkin/app",
                data: datacomplete,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response3, status) {
                $scope.checkinData = response3.data;
                sweetAlert(distributioncyclenumber.length + $scope.checkinData.message);
            });
        }
    };
    $scope.distributioncyclecheckouts = function ()                                      //CheckOUts
    {
        var distributioncyclenumber = cycles;
        cycles = [];
        $scope.list = [];
//        var distributioncyclenumber = "MYS-Fleet-" + $scope.cycleno;
        var todayDate = new Date(); //current date
        for (var i = 0; i < distributioncyclenumber.length; i++)
        {
//            x.remove(x[i]);
            var datacomplete = {// get the  complete transaction
                vehicleId: distributioncyclenumber[i],
                cardId: $scope.cardNum,
                fromPort: distributionpoertsids,
                checkOutTime: todayDate
            };
            $http({
                method: "POST",
                url: baseURL60 + "transactions/checkout/app",
                data: datacomplete,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response3, status) {
                $scope.checkoutsData = response3.data;
                sweetAlert($scope.checkoutsData.message);
            });
        }
    };
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
            $scope.checkoutsData = response3.data.data;
            var StationHourlyCheckouts = [];
            var checkouts = [];
            checkouts = $scope.checkoutsData;
//            var hours = [];
//            for (var k = 0; k < checkouts.length; k++) {
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
            for (var i = 0; i < dockingstation.length; i++)
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
                var Name = dockingstation[i].name;
                for (var k = 0; k < checkouts.length; k++) {
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
                                for (var n = 0; n < userdetails.length; n++) {
                                    if (checkouts[k].user === userdetails[n].UserID)
                                    {
                                        if (userdetails[n]._type === 'member')
                                        {
                                            hourlycounts[index].count++;
                                            hourlytotal[index].counts++;
                                            total++;
                                        }
                                    }
                                }
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
//            $scope.nonoperationalhoursEmployee = nonOperationalhourscheckoutemployee;
//            $scope.nonoperationalhoursEmpcount = nonOperationalhourscheckoutemployee.length;
//            $scope.nonoperationalhoursMebers = nonOperationalhourscheckoutMember;
//            $scope.nonoperationalhoursMeberscount = nonOperationalhourscheckoutMember.length;
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
    $scope.nonperationalhourlycheckoutcounts = function (fromdate, todate)
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
            $scope.checkoutsData = response3.data.data;
            var StationHourlyCheckouts = [];
            var checkouts = [];
            checkouts = $scope.checkoutsData;
//            var hours = [];
//            for (var k = 0; k < checkouts.length; k++) {
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
            for (var i = 0; i < dockingstation.length; i++)
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
                var Name = dockingstation[i].name;
                for (var k = 0; k < checkouts.length; k++) {
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
                                for (var n = 0; n < userdetails.length; n++) {
                                    if (checkouts[k].user === userdetails[n].UserID)
                                    {
                                        if (userdetails[n]._type === 'member')
                                        {
                                            hourlycounts[index].count++;
                                            hourlytotal[index].counts++;
                                            total++;
                                        }
                                    }
                                }
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
            $scope.nonoperationalhoursEmployee = nonOperationalhourscheckoutemployee;
            $scope.nonoperationalhoursEmpcount = nonOperationalhourscheckoutemployee.length;
            $scope.nonoperationalhoursMebers = nonOperationalhourscheckoutMember;
            $scope.nonoperationalhoursMeberscount = nonOperationalhourscheckoutMember.length;
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
    $scope.findcycle = function (cycle) {
        var cyclenumber = 'MYS-Fleet-' + cycle;
        $scope.cycleport = '';
        for (var j = 0; j < dockingHubsVehicle.length; j++)
        {
            var ports = dockingHubsVehicle[j].portIds;
            for (var k = 0; k < ports.length; k++)
            {
                if (ports[k].dockingPortId.vehicleId.length !== 0)
                {
                    if (cyclenumber === ports[k].dockingPortId.vehicleId[0].vehicleid.vehicleNumber)
                    {
                        $scope.cycleport = ports[k].dockingPortId.Name;
                    }
                }
            }
        }
        if ($scope.cycleport.length === 0)
            $scope.cycleport = cycle + "\tNot Found";
    };
    $scope.selecteddockingstationbridgeclear = function (data) {                   //Docking Station  names and Ip address
//        stationname = data;
        ipAddress = data.ipAddress;
        // alert(stationid);
    };
    $scope.clearselecteddockingstationbridge = function () {                                  //to clear the bridge   in manage Transactions
//        id1 = 'transactions/clearall/';
        swal({
            title: 'Are you sure?',
            text: "You want clear!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, clear it!'
        }).then(function () {
            var data = {
                ipAddress: ipAddress
            };
            $http({
                method: 'DELETE',
                url: ipURL80 + 'transactions/clearall',
                data: data,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response2, status) {
                $scope.bridgeData = response2.data;
                sweetAlert($scope.bridgeData.message);
            });
        });
    };
    $scope.removeTagOnBackspace = function (findcyclenumber) {
        if (findcyclenumber.length <= 1) {
            $scope.cycleport = '';
        }
    };
    $scope.cycleplace = function (data) {
        sweetAlert(data.currentAssociationName + "\n" + data.currentAssociationCardNum);
    };
    $scope.checkIn = function (data) {

    };
});

