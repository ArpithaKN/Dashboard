var app = angular.module('myApp', []);
var completetransaction = [], opentransaction = [], memberDetails = [], dockingStationInformation = [], ports = [], vehicle1 = [], transationarray = [];
var ip, portsid, card1, phone1, userId, vehicleuid, stationname;
var baseURL60 = "https://www.mytrintrin.com:13060/api/";
var ipURL80 = "http://43.251.80.79:13080/api/"; //ports checkin, UMclear,bridge clear
var baseURL70 = "https://www.mytrintrin.com:13070/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
var tempURL80 = "http://43.251.80.79:14090/api/";              //to unlock and create a checkouts record,transactions
var ipURL90 = "http://43.251.80.79:13090/api/";      //unlock,create a checkout and opentransaction and delete opentransaction      
var todayDate = new Date(); //current date

//angular.module('myApp', [
//  'btford.socket-io'
//]).
//factory('socket', function (socketFactory) {
//  return socketFactory({
//    prefix: 'foo~',
//    ioSocket: io.connect('43.251.80.79:5959/techsup')
//  });
//}).
//controller('MyCtrl', function (socket) {
//  socket.on('foo~bar', function () {
//    $scope.bar = true;
//  });
//});


var oldcycles = [];
var valdity, statuses, swal, origin;
var dockingStatus, memberStatus, vehicleStatus;          //to set a flag(if its true it allows to unlock and checkout create)
var ipstatus, unitstatus, portstatus, vehiclestatus, userstatus; //to set a flag(if its true it allows to unlock and checkout create)
app.controller('customersCtrl', function ($scope, $http) {
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
    swal({
        title: 'Loading...',
        // text: 'Still API Calling .',
        showCancelButton: false,
        showConfirmButton: false
    }).then(
//            $http({
//                method: "GET",
//                url: baseURL70 + "member/qweuird78fj3498asdjkfhahsysd98y4rsdjhf", //members details
//                data: '',
//                headers: {
//                    "Content-Type": "application/json"
//                }
//            }).then(function (response, status) {
//        $scope.memberData = response.data.data;
//        memberDetails = $scope.memberData;
//        memberStatus = 1;
            $http({
                method: "GET",
                url: baseURL70 + "dockstation", //station details
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response1, status) {
        $scope.dockingstationData = response1.data.data;
        dockingStationInformation = $scope.dockingstationData;
        dockingStatus = 1;
        $http({
            method: "GET",
            url: baseURL70 + "vehicle", //vehicle details
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.vehicleData = response2.data.data;
            vehicle1 = $scope.vehicleData;
            vehicleStatus = 1;
            swal.close();
            swal("Its ready to Use");
        });
//         });
    }),
            );
    
    //Refresh docking station 
    var refresh = setInterval(gettransaction, 30000); //setInterval for 30 sec
    function gettransaction()
    {
        $http({
                method: "GET",
                url: baseURL70 + "dockstation", //station details
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response1, status) {
//        $scope.dockingstationData = response1.data.data;
        dockingStationInformation = response1.data.data;
    });
    }
            
            

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
                    sweetAlert("MemberShip" + " " + $scope.status);
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
                var url = "transactions/open/" + userId;
                $http({
                    method: "GET",
                    url: ipURL90 + url, //Open CheckOuts   in local
                    data: '',
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response4, status) {
                    $scope.transactionsData = response4.data.data;
                    opentransaction = $scope.transactionsData;
                    transationarray = [];
//                if($scope.transactionsData.length > 0)
//                {
                    for (var i = 0; i < $scope.transactionsData.length; i++)
                    {
                        for (var j = 0; j < memberDetails.length; j++)
                        {
                            if (memberDetails[j].UserID === opentransaction[i].user)
                            {
                                $scope.tname = memberDetails[j].Name + '  ' + memberDetails[j].lastName;
                                $scope.tbal = memberDetails[j].creditBalance;                                 //member balance
                                $scope.tphone = memberDetails[j].phoneNumber;                                 //member phonenumber
                                $scope.tcard = memberDetails[j].cardNum;
                            }
                        }
                        for (var j = 0; j < vehicle1.length; j++)
                        {
                            if (vehicle1[j].vehicleUid === opentransaction[i].vehicleId)
                                $scope.cno = vehicle1[j].vehicleNumber;
                        }
                        for (var j = 0; j < dockingStationInformation.length; j++)
                        {
                            var portsids = dockingStationInformation[j].portIds;                            //ports
                            for (var k = 0; k < portsids.length; k++)
                            {
                                if (opentransaction[i].fromPort === portsids[k].dockingPortId.PortID)
                                    $scope.from = portsids[k].dockingPortId.Name;                             //ipaddress of particular station
                                // break;
                            }
                        }
                        var datatransaction = {
                            name: $scope.name1,
                            card: $scope.card,
                            phone: $scope.phone,
                            cycle: $scope.cno,
                            from: $scope.from,
                            checkout: $scope.transactionsData[i].checkOutTime,
                            _id: $scope.transactionsData[i]._id
                        };
                        transationarray.push(datatransaction);
                        $scope.trans = transationarray;
                        $scope.opencheckoutcount = $scope.trans.length;
                    }
//            }
                    transactionStatus = 1;
                });
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
                    var completetransactionData = [];
                    completeStatus = 1;
                    for (var i = 0; i < completetransaction.length; i++)
                    {
                        completetransactionData.push(completetransaction[i]);
                        if (i >= 9)
                            break;
                    }
                    $scope.completetransactiondata = completetransactionData;
                    $scope.count = completetransaction.length;
                });
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
                var url = "transactions/open/" + userId;
                $http({
                    method: "GET",
                    url: ipURL90 + url, //Open CheckOuts in  local
                    data: '',
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response4, status) {
                    $scope.transactionsData = response4.data.data;
                    opentransaction = $scope.transactionsData;
                    transationarray = [];
//                 if($scope.transactionsData.length > 0)
//                {
                    for (var i = 0; i < $scope.transactionsData.length; i++)
                    {
                        for (var j = 0; j < memberDetails.length; j++)
                        {
                            if (memberDetails[j].UserID === opentransaction[i].user)
                            {
                                $scope.tname = memberDetails[j].Name + '  ' + memberDetails[j].lastName;
                                $scope.tbal = memberDetails[j].creditBalance;                                 //member balance
                                $scope.tphone = memberDetails[j].phoneNumber;                                 //member phonenumber
                                $scope.tcard = memberDetails[j].cardNum;
                            }
                        }
                        for (var j = 0; j < vehicle1.length; j++)
                        {
                            if (vehicle1[j].vehicleUid === opentransaction[i].vehicleId)
                                $scope.cno = vehicle1[j].vehicleNumber;
                        }
                        for (var j = 0; j < dockingStationInformation.length; j++)
                        {
                            var portsids = dockingStationInformation[j].portIds;                            //ports
                            for (var k = 0; k < portsids.length; k++)
                            {
                                if (opentransaction[i].fromPort === portsids[k].dockingPortId.PortID)
                                    $scope.from = portsids[k].dockingPortId.Name;                             //ipaddress of particular station
                                // break;
                            }
                        }
                        var datatransaction = {
                            name: $scope.name1,
                            card: $scope.card,
                            phone: $scope.phone,
                            cycle: $scope.cno,
                            from: $scope.from,
                            checkout: $scope.transactionsData[i].checkOutTime,
                            _id: $scope.transactionsData[i]._id
                        };
                        transationarray.push(datatransaction);
                        $scope.trans = transationarray;
                        $scope.opencheckoutcount = $scope.trans.length;
                    }
//            }
                    transactionStatus = 1;
                });
                $http({
                    method: "GET",
                    url: baseURL60 + "transactions/myrides/all/" + card1, //complete transaction
                    data: '',
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response3, status) {
                    $scope.completeData = response3.data.data;
                    completetransaction = $scope.completeData;
                    var completetransactionData = [];
                    completeStatus = 1;
                    for (var i = 0; i < completetransaction.length; i++)
                    {
                        completetransactionData.push(completetransaction[i]);
                        if (i >= 9)
                            break;
                    }
                    $scope.completetransactiondata = completetransactionData;
                    $scope.count = completetransaction.length;
                });
            } else
                sweetAlert("Invalid Phone Number");
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
            }
        }
        document.getElementById('demo1').style.display = "block";
    };
    var portids = [], len;
    $scope.selecteddockingstation = function (data) {                   //Docking Station  names and Ip address
//        stationname = data;
        portids = [];var oldcyclenumber = [];
        for (var i = 0; i < dockingStationInformation.length; i++)
            if (data.StationID === dockingStationInformation[i].StationID)
            {
                ports = dockingStationInformation[i].portIds;                            //ports
                ip = dockingStationInformation[i].ipAddress;                             //ipaddress of particular station
                stationname = dockingStationInformation[i].name;
                break;
            }
        if (ip)
            ipstatus = 1;
        else
            ipstatus = 0;
        $scope.ports = ports;
        
        //to show a Bicycle Number
        $scope.portHide = ports.length;
        if ($scope.portHide === 16)
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
    };
    $scope.usersync = function ()                           //Sync the members to station
    {
        var sync = {
            stationName: stationname
        };
        $http({
            method: "PUT",
            url: ipURL90 + "users/sync/" + card1,
            data: sync,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.usersyncData = response2.data.message;
            sweetAlert($scope.usersyncData);
        });
    };

    $scope.unlock = function () {                                       //Unlock the ports and create the checkouts records 
        if ($scope.unit)
            unitstatus = 1;
        else
            unitstatus = 0;
        if ($scope.port)
            portstatus = 1;
        else
            portstatus = 0;

        if (userId)
        {
            userstatus = 1;
        } else
            userstatus = 0;
        var vehicleno = "MYS-Fleet-" + $scope.cyclenumber;
        for (var i = 0; i < vehicle1.length; i++)                     //To get vehicleUid
        {
            if (vehicle1[i].vehicleNumber === vehicleno)
            {
                vehicleuid = vehicle1[i].vehicleUid;
                vehiclestatus = 1;
                break;
            } else
                vehiclestatus = 0;
        }
        if ((dockingStatus === 1) && (memberStatus === 1) && (vehicleStatus === 1))
        {
            if ((ipstatus === 1) && (unitstatus === 1) && (portstatus === 1))
            {
                var data = {
                    host: ip,
                    unit: $scope.unit,
                    port: $scope.port
                };
                $http({//to unlock                          
                    method: "POST",
                    url: ipURL90 + "transactions/unlock/test",
                    data: data,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response6, status) {
                    $scope.unlockData = response6.data.message;
                    for (var i = 0; i < ports.length; i++)                        //To get portsID
                    {
                        if ((ports[i].dockingPortId.FPGA === $scope.unit) && (ports[i].dockingPortId.ePortNumber === $scope.port))
                        {
                            portsid = ports[i].dockingPortId.PortID;
                            portstatus = 1;
                            break;
                        } else
                            portstatus = 0;
                    }
                    swal({
                        title: 'Are you sure?',
                        text: "You want to create a checkouts!",
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, create it!'
                    }).then(function () {
//                        var datetime = new Date();
                        var data2 = {};
                        if (origin !== 'member') {
                            data2 = {
                                cardId: userId,
                                fromPort: portsid,
                                vehicleId: vehicleuid,
                                origin: 'techSupportEmp',
                                checkOutTime: new Date(),
                                checkOutInitiatedTime: new Date(),
                                checkOutCompletionTime: new Date()
                            };
                        } else {
                            data2 = {
                                cardId: userId,
                                fromPort: portsid,
                                vehicleId: vehicleuid,
                                checkOutTime: new Date(),
                                checkOutInitiatedTime: new Date(),
                                checkOutCompletionTime: new Date()
                            };
                        }
                        $http({//to create a checkouts records
                            method: "POST",
                            url: ipURL90 + "transactions/checkout/techsup", //13090  tempURL80  ipURL90
                            data: data2,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }).then(function (response2, status) {
                            $scope.checkoutData = response2.data.data;
                            if ($scope.checkoutData.errorStatus === 1)
                                sweetAlert($scope.checkoutData.errorMsg);
                            else {
                                swal(
                                        'Created',
                                        'Your checkout is created.',
                                        'success'
                                        );
//                            transaction = $scope.checkoutData;
                                var transationarray = [];

                                for (var i = 0; i < $scope.checkoutData.length; i++)
                                {
                                    for (var j = 0; j < memberDetails.length; j++)
                                    {
                                        if (memberDetails[j].UserID === $scope.checkoutData[i].user)
                                        {
                                            $scope.tname1 = memberDetails[j].Name + '  ' + memberDetails[j].lastName;
                                            $scope.tbal = memberDetails[j].creditBalance;                                 //member balance
                                            $scope.tphone = memberDetails[j].phoneNumber;                                 //member phonenumber
                                            $scope.tcard = memberDetails[j].cardNum;
                                        }
                                    }
                                    for (var j = 0; j < vehicle1.length; j++)
                                    {
                                        if (vehicle1[j].vehicleUid === $scope.checkoutData[i].vehicleId)
                                            $scope.tcno = vehicle1[j].vehicleNumber;
                                    }
                                    for (var j = 0; j < dockingStationInformation.length; j++)
                                    {
                                        var portsids = dockingStationInformation[j].portIds;                            //ports
                                        for (var k = 0; k < portsids.length; k++)
                                        {
                                            if ($scope.checkoutData[i].fromPort === portsids[k].dockingPortId.PortID)
                                                $scope.from = portsids[k].dockingPortId.Name;                             //ipaddress of particular station
                                            // break;
                                        }
                                    }
                                    var datatransaction = {
                                        name: $scope.tname1,
                                        card: $scope.tcard,
                                        phone: $scope.tphone,
                                        cycle: $scope.tcno,
                                        from: $scope.from,
                                        checkout: $scope.transactionsData[i].checkOutTime,
                                        _id: $scope.transactionsData[i]._id
                                    };
                                    transationarray.push(datatransaction);
                                    $scope.trans = transationarray;
                                    $scope.opencheckoutcount = $scope.trans.length;
                                }

                                transactionStatus = 1;
                                // var set = setTimeout(clearall, 3000);
                                var url = "transactions/open/" + userId;       //open transaction in local
                                $http({
                                    method: "GET",
                                    url: ipURL90 + url, //Open CheckOuts
                                    data: '',
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                }).then(function (response4, status) {
                                    $scope.transactionsData = response4.data.data;
                                    transaction = $scope.transactionsData;
                                    transationarray = [];
                                    for (var i = 0; i < $scope.transactionsData.length; i++)
                                    {
                                        for (var j = 0; j < memberDetails.length; j++)
                                        {
                                            if (memberDetails[j].UserID === transaction[i].user)
                                            {
                                                $scope.tname1 = memberDetails[j].Name + '  ' + memberDetails[j].lastName;
                                                $scope.tbal = memberDetails[j].creditBalance;                                 //member balance
                                                $scope.tphone = memberDetails[j].phoneNumber;                                 //member phonenumber
                                                $scope.tcard = memberDetails[j].cardNum;
                                            }
                                        }
                                        for (var j = 0; j < vehicle1.length; j++)
                                        {
                                            if (vehicle1[j].vehicleUid === transaction[i].vehicleId)
                                                $scope.cno = vehicle1[j].vehicleNumber;
                                        }
                                        for (var j = 0; j < dockingStationInformation.length; j++)
                                        {
                                            var portsids = dockingStationInformation[j].portIds;                            //ports
                                            for (var k = 0; k < portsids.length; k++)
                                            {
                                                if (transaction[i].fromPort === portsids[k].dockingPortId.PortID)
                                                    $scope.from = portsids[k].dockingPortId.Name;                             //ipaddress of particular station
                                                // break;
                                            }
                                        }
                                        var datatransaction = {
                                            name: $scope.tname1,
                                            card: $scope.tcard,
                                            phone: $scope.tphone,
                                            cycle: $scope.cno,
                                            from: $scope.from,
                                            checkout: $scope.transactionsData[i].checkOutTime,
                                            _id: $scope.transactionsData[i]._id
                                        };
                                        transationarray.push(datatransaction);
                                        $scope.trans = transationarray;
                                        $scope.opencheckoutcount = $scope.trans.length;
                                    }
                                    transactionStatus = 1;
                                    //setTimeout(clearall, 3000);
                                    //To clear all data in UI
                                });
                                unitstatus = 0;
                                portstatus = 0;
                                vehiclestatus = 0;
                                userstatus = 0;
                                document.getElementById('onfocus1').focus();
                            }
                        });
                    });
                }, function errorCallback(response) {
                    sweetAlert(response.data.description);
                });
            } else {
                sweetAlert("Missing a data....");
            }
        } else
            sweetAlert("Still Loading....");
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
    
    $scope.newUnlock = function () {                                       //Unlock the ports and create the checkouts records 
        if ($scope.unit)
            unitstatus = 1;
        else
            unitstatus = 0;
        if ($scope.port)
            portstatus = 1;
        else
            portstatus = 0;

        if (userId)
        {
            userstatus = 1;
        } else
            userstatus = 0;
        var vehicleno = "MYS-Fleet-" + $scope.cyclenumber;
        for (var i = 0; i < vehicle1.length; i++)                     //To get vehicleUid
        {
            if (vehicle1[i].vehicleNumber === vehicleno)
            {
                vehicleuid = vehicle1[i].vehicleUid;
                vehiclestatus = 1;
                break;
            } else
                vehiclestatus = 0;
        }
        if ((dockingStatus === 1) && (memberStatus === 1) && (vehicleStatus === 1))
        {
            if ((ipstatus === 1) && (unitstatus === 1) && (portstatus === 1))
            {
                 if (origin !== 'member') {
                            data2 = {
                                cardId: userId,
                                fromPort: portsid,
                                vehicleId: vehicleuid,
                                origin: 'techSupportEmp',
                                checkOutTime: new Date(),
                                checkOutInitiatedTime: new Date(),
                                checkOutCompletionTime: new Date()
                            };
                        } else {
                            data2 = {
                                cardId: userId,
                                fromPort: portsid,
                                vehicleId: vehicleuid,
                                checkOutTime: new Date(),
                                checkOutInitiatedTime: new Date(),
                                checkOutCompletionTime: new Date()
                            };
                        }
                var data = {
                    host: ip,
                    unit: $scope.unit,
                    port: $scope.port
                };
                $http({//to unlock                          
                    method: "POST",
                    url: ipURL90 + "transactions/unlock/uart",
                    data: data,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(function (response6, status) {
                    $scope.unlockData = response6.data.message;
                    for (var i = 0; i < ports.length; i++)                        //To get portsID
                    {
                        if ((ports[i].dockingPortId.FPGA === $scope.unit) && (ports[i].dockingPortId.ePortNumber === $scope.port))
                        {
                            portsid = ports[i].dockingPortId.PortID;
                            portstatus = 1;
                            break;
                        } else
                            portstatus = 0;
                    }
                    swal({
                        title: 'Are you sure?',
                        text: "You want to create a checkouts!",
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, create it!'
                    }).then(function () {
//                        var datetime = new Date();
                        var data2 = {};
                       
                        $http({//to create a checkouts records
                            method: "POST",
                            url: ipURL90 + "transactions/checkout/techsup", //13090
                            data: data2,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }).then(function (response2, status) {
                            $scope.checkoutData = response2.data.data;
                            if ($scope.checkoutData.errorStatus === 1)
                                sweetAlert($scope.checkoutData.errorMsg);
                            else {
                                swal(
                                        'Created',
                                        'Your checkout is created.',
                                        'success'
                                        );
//                            transaction = $scope.checkoutData;
                                var transationarray = [];

                                for (var i = 0; i < $scope.checkoutData.length; i++)
                                {
                                    for (var j = 0; j < memberDetails.length; j++)
                                    {
                                        if (memberDetails[j].UserID === $scope.checkoutData[i].user)
                                        {
                                            $scope.tname1 = memberDetails[j].Name + '  ' + memberDetails[j].lastName;
                                            $scope.tbal = memberDetails[j].creditBalance;                                 //member balance
                                            $scope.tphone = memberDetails[j].phoneNumber;                                 //member phonenumber
                                            $scope.tcard = memberDetails[j].cardNum;
                                        }
                                    }
                                    for (var j = 0; j < vehicle1.length; j++)
                                    {
                                        if (vehicle1[j].vehicleUid === $scope.checkoutData[i].vehicleId)
                                            $scope.tcno = vehicle1[j].vehicleNumber;
                                    }
                                    for (var j = 0; j < dockingStationInformation.length; j++)
                                    {
                                        var portsids = dockingStationInformation[j].portIds;                            //ports
                                        for (var k = 0; k < portsids.length; k++)
                                        {
                                            if ($scope.checkoutData[i].fromPort === portsids[k].dockingPortId.PortID)
                                                $scope.from = portsids[k].dockingPortId.Name;                             //ipaddress of particular station
                                            // break;
                                        }
                                    }
                                    var datatransaction = {
                                        name: $scope.tname1,
                                        card: $scope.tcard,
                                        phone: $scope.tphone,
                                        cycle: $scope.tcno,
                                        from: $scope.from,
                                        checkout: $scope.transactionsData[i].checkOutTime,
                                        _id: $scope.transactionsData[i]._id
                                    };
                                    transationarray.push(datatransaction);
                                    $scope.trans = transationarray;
                                    $scope.opencheckoutcount = $scope.trans.length;
                                }

                                transactionStatus = 1;
                                // var set = setTimeout(clearall, 3000);
                                var url = "transactions/open/" + userId;       //open transaction in local
                                $http({
                                    method: "GET",
                                    url: ipURL90 + url, //Open CheckOuts
                                    data: '',
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                }).then(function (response4, status) {
                                    $scope.transactionsData = response4.data.data;
                                    transaction = $scope.transactionsData;
                                    transationarray = [];
                                    for (var i = 0; i < $scope.transactionsData.length; i++)
                                    {
                                        for (var j = 0; j < memberDetails.length; j++)
                                        {
                                            if (memberDetails[j].UserID === transaction[i].user)
                                            {
                                                $scope.tname1 = memberDetails[j].Name + '  ' + memberDetails[j].lastName;
                                                $scope.tbal = memberDetails[j].creditBalance;                                 //member balance
                                                $scope.tphone = memberDetails[j].phoneNumber;                                 //member phonenumber
                                                $scope.tcard = memberDetails[j].cardNum;
                                            }
                                        }
                                        for (var j = 0; j < vehicle1.length; j++)
                                        {
                                            if (vehicle1[j].vehicleUid === transaction[i].vehicleId)
                                                $scope.cno = vehicle1[j].vehicleNumber;
                                        }
                                        for (var j = 0; j < dockingStationInformation.length; j++)
                                        {
                                            var portsids = dockingStationInformation[j].portIds;                            //ports
                                            for (var k = 0; k < portsids.length; k++)
                                            {
                                                if (transaction[i].fromPort === portsids[k].dockingPortId.PortID)
                                                    $scope.from = portsids[k].dockingPortId.Name;                             //ipaddress of particular station
                                                // break;
                                            }
                                        }
                                        var datatransaction = {
                                            name: $scope.tname1,
                                            card: $scope.tcard,
                                            phone: $scope.tphone,
                                            cycle: $scope.cno,
                                            from: $scope.from,
                                            checkout: $scope.transactionsData[i].checkOutTime,
                                            _id: $scope.transactionsData[i]._id
                                        };
                                        transationarray.push(datatransaction);
                                        $scope.trans = transationarray;
                                        $scope.opencheckoutcount = $scope.trans.length;
                                    }
                                    transactionStatus = 1;
                                    //setTimeout(clearall, 3000);
                                    //To clear all data in UI
                                });
                                unitstatus = 0;
                                portstatus = 0;
                                vehiclestatus = 0;
                                userstatus = 0;
                                document.getElementById('onfocus1').focus();
                            }
                        });
                    });
                }, function errorCallback(response) {
                    sweetAlert(response.data.description);
                });
            } else {
                sweetAlert("Missing a data....");
            }
        } else
            sweetAlert("Still Loading....");
    };
    
//$scope.findcycle = function (cycle) {
//        var cyclenumber = 'MYS-Fleet-' + cycle;
//        $scope.cycleport = '';
////        for (var j = 0; j < dockingStationInformation.length; j++)
////        {
////            var ports = dockingStationInformation[j].portIds;
//            for (var k = 0; k < ports.length; k++)
//            {
//                if (ports[k].dockingPortId.vehicleId.length !== 0)
//                {
//                    if (cyclenumber === ports[k].dockingPortId.vehicleId[0].vehicleid.vehicleNumber)
//                    {
//                            $scope.unit = ports[k].dockingPortId.FPGA;
//                            $scope.port = ports[k].dockingPortId.ePortNumber;
//                    }
//                }
//            }
////        }
//    };
    $scope.delete = function (id) {                                   //opentransaction delete
        id1 = 'transactions/clear/checkout/' + id;
        // sweetAlert(id1);
        $http({
            method: 'DELETE',
            url: ipURL90 + id1, //In Local
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response5, status) {
            $scope.deleteData = response5.data.message;
            sweetAlert($scope.deleteData);
            var index;
            for (var i = 0; i < transationarray.length; i++)
                if (id === transationarray[i]._id)
                    index = i;
            transationarray.splice(index, 1);
            $scope.trans = transationarray;
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
});



