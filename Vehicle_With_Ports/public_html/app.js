var app = angular.module('myApp', []);
var baseURL60 = "https://www.mytrintrin.com:13060/api/";
var ipURL80 = "http://43.251.80.79:13080/api/";
var ipURL90 = "http://43.251.80.79:13090/api/";
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
var dockingHubsVehicle = [];//to find the vehicles in ports
var idlist = [];
var swal, statuses, valdity;
var todayDate = new Date();
todayDate = new Date(todayDate);
app.controller('customersCtrl', function ($scope, $http) {
    $http({
            method: "GET",
            url: baseURL60 + "transactions", //Open CheckOuts
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.checkoutData = response.data.data;
            var checkoutDetails = [];
            for (i = 0; i < $scope.checkoutData.length; i++)
            {
                var checkoutEntry = {
                    name: $scope.checkoutData[i].user.Name,
                    card: $scope.checkoutData[i].user.cardNum,
                    checkout: $scope.checkoutData[i].checkOutTime,
                    form: $scope.checkoutData[i].fromPort.Name,
                    vehicle: $scope.checkoutData[i].vehicle.vehicleNumber,
                    id: $scope.checkoutData[i]._id
                };
                checkoutDetails.push(checkoutEntry);
            }
            var sortcheckoutDetails = _.sortBy(checkoutDetails, 'vehicle');
//            $scope.ckeckout = sortcheckoutDetails;
//            $scope.checkoutcount = sortcheckoutDetails.length;
            $http({
                method: "GET",
                url: baseURL60 + "dockstation", //dockstation to find the cyclecount in every station
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response, status) {
                $scope.dockingHub = response.data.data;
                dockingHubsVehicle = $scope.dockingHub;
                var portName = [];
                var vehicle = [];
                 for (i = 0; i < sortcheckoutDetails.length; i++)
                {
                    vehicle.push(sortcheckoutDetails[i].vehicle);
                }
                var unique = [];
                 for (i = 0; i < vehicle.length; i++)
                {
                    if(vehicle[i]!==vehicle[i+1])
                        unique.push(vehicle[i]);
                }
                for (i = 0; i < unique.length; i++)
                {
                    for (j = 0; j < dockingHubsVehicle.length; j++)
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
                                        vehicle: ports[k].dockingPortId.vehicleId[0].vehicleid.vehicleNumber
                                    };
                                    portName.push(portEntry);
                                }
                            }
                        }
                    }
                }
                $scope.ports = portName;
                $scope.vehiclecount = portName.length;
                var checkinerror = [],opencheck= [];
                for (i = 0; i < portName.length; i++)
                {
                     for (j = 0; j < sortcheckoutDetails.length; j++)
                     {
                         if(portName[i].vehicle===sortcheckoutDetails[j].vehicle)
                         {
                             checkinerror.push(sortcheckoutDetails[j]);
                         }
                         else{
                             opencheck.push(sortcheckoutDetails[j]);
                         }
                     }
                }
                $scope.ckeckout = checkinerror;
            $scope.checkoutcount = checkinerror.length;
//             swal.close();
            });
        });
   var refresh = setInterval(gettransaction, 30000);//setInterval for 30 sec
    function gettransaction()
    {
        $http({
            method: "GET",
            url: baseURL60 + "transactions", //Open CheckOuts
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.checkoutData = response.data.data;
            var checkoutDetails = [];
            for (i = 0; i < $scope.checkoutData.length; i++)
            {
                var checkoutEntry = {
                    name: $scope.checkoutData[i].user.Name,
                    card: $scope.checkoutData[i].user.cardNum,
                    checkout: $scope.checkoutData[i].checkOutTime,
                    form: $scope.checkoutData[i].fromPort.Name,
                    vehicle: $scope.checkoutData[i].vehicle.vehicleNumber,
                    id: $scope.checkoutData[i]._id
                };
                checkoutDetails.push(checkoutEntry);
            }
            var sortcheckoutDetails = _.sortBy(checkoutDetails, 'vehicle');
//            $scope.ckeckout = sortcheckoutDetails;
//            $scope.checkoutcount = sortcheckoutDetails.length;
            $http({
                method: "GET",
                url: baseURL60 + "dockstation", //dockstation to find the cyclecount in every station
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response, status) {
                $scope.dockingHub = response.data.data;
                dockingHubsVehicle = $scope.dockingHub;
                var portName = [];
                var vehicle = [];
                 for (i = 0; i < sortcheckoutDetails.length; i++)
                {
                    vehicle.push(sortcheckoutDetails[i].vehicle);
                }
                var unique = [];
                 for (i = 0; i < vehicle.length; i++)
                {
                    if(vehicle[i]!==vehicle[i+1])
                        unique.push(vehicle[i]);
                }
                for (i = 0; i < unique.length; i++)
                {
                    for (j = 0; j < dockingHubsVehicle.length; j++)
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
                                        vehicle: ports[k].dockingPortId.vehicleId[0].vehicleid.vehicleNumber
                                    };
                                    portName.push(portEntry);
                                }
                            }
                        }
                    }
                }
                $scope.ports = portName;
                $scope.vehiclecount = portName.length;
                var checkinerror = [],opencheck= [];
                for (i = 0; i < portName.length; i++)
                {
                     for (j = 0; j < sortcheckoutDetails.length; j++)
                     {
                         if(portName[i].vehicle===sortcheckoutDetails[j].vehicle)
                         {
                             checkinerror.push(sortcheckoutDetails[j]);
                         }
                         else{
                             opencheck.push(sortcheckoutDetails[j]);
                         }
                     }
                }
                $scope.ckeckout = checkinerror;
            $scope.checkoutcount = checkinerror.length;
            });
        });
    }
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
    $scope.deleteopencheckouts = function () {                                          //delete the opentransaction in sdc
        var idlists = idlist;
        idlist = [];
//        var count = 0;
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
//                count++;
//                if (count === idlists.length)
//                    recall();
            });
        }
    };
    $scope.popup = function (cardnumber) {                //Display information opentransaction cardNum click 
        var popdata = {
            name: cardnumber
        };
        $http({
            method: "POST",
            url: baseURL60 + "users/search", //Take a particular member details
            data: popdata,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.popData = response2.data.data;
            var memberdetails = [];
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
                $scope.popname = memberdetails[i].Name + '  ' + memberdetails[i].lastName;            //member Name
                $scope.popbal = memberdetails[i].creditBalance;                                 //member balance
                $scope.popphone = memberdetails[i].phoneNumber;                                 //member phonenumber
                $scope.popcard = memberdetails[i].cardNum;
                $scope.popstatuscolour = memberdetails[i].status;
                $scope.popmemberprofilePic = imgsrc + memberdetails[i].UserID + '/' + memberdetails[i].profilePic + '.png';   //member profilepic 
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
                $scope.popstatus = " Expired ";
                $scope.popstatuscolor = -3;
            }
            swal({
                title: '<h3><b>' + $scope.popcard + '</b></h3>' + '<h3  align="left">' + "\n<b>Name:</b>" + $scope.popname + "\n<b>Phone:</b>" + ($scope.popphone).substring(3) + "\n<b>Status:</b>" + $scope.popstatus + "\n<b>Balance:</b>" + $scope.popbal + "\n<b>Valid:</b>" + $scope.popvalid + '</h3>',
                imageUrl: $scope.popmemberprofilePic
            });
        });
    };
});


