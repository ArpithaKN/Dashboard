var app = angular.module('myApp', []);
var baseURL = "https://www.mytrintrin.com:13060/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
var ipURL = "http://43.251.80.79:13080/api/";              //to unlock and create a checkouts record,transactions
var tempURL = "http://43.251.80.79:13090/api/";
var todayDates = new Date(); //current date
var todayDate = new Date(todayDates);
var todaydate = todayDate.getDate();
var todaymonth = todayDate.getMonth();
var todayyear = todayDate.getFullYear();
var percentage = [],swal,dockingstation = [];
app.controller('customersCtrl', function ($scope, $http) {
    
     $http({
        method: "GET",
        url: baseURL + "dockstation", //dockstation to find the cyclecount in every station
        data: '',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response, status) {
        $scope.myData = response.data.data;
        var docking1 = [];
        dockingstation = $scope.myData;
        for (var i = 0; i < dockingstation.length; i++)
            docking1.push(dockingstation[i].name);
        docking1.sort();
        $scope.dockingname = docking1;
    });
     $scope.portsEntry = {
        FPGA31: "",
        FPGA32:"",
        FPGA33: "",
        FPGA34: "",
        FPGA41: "",
        FPGA42:"",
        FPGA43: "",
         FPGA44:"",
        FPGA51:"",
        FPGA52: "",
        FPGA53: "",
        FPGA54:"",
        FPGA61:"",
        FPGA62:"",
        FPGA63: "",
        FPGA64:""
    };
         setInterval(checkoutcounts, 30000);//setInterval for 30 sec
    function checkoutcounts()  //calling function for setInterval
    {
        $http({
            method: "GET",
            url: baseURL + "dockstation", //dockstation to find the cyclecount in every station
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.myData = response.data.data;
            dockingstation = $scope.myData;
        });
    }
     var portids = [],len;
     $scope.load = function (id)
    {
        var ports = [];
        var Name;
        for (i = 0; i < dockingstation.length; i++)
            if (id.StationID === dockingstation[i].StationID)
            {
                ports=dockingstation[i].portIds;
                Name = dockingstation[i].name;
                break;
            }
           portids = [];
           $scope.stationname = Name;
        $scope.port = ports.length;
        if($scope.port===16)
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
                        $scope.port31 = '';
                    else
                        $scope.port31 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                }
                else if (ports[i].dockingPortId.ePortNumber === 2)
                {
                     portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.port32 = '';
                    else
                        $scope.port32 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                }
                else if (ports[i].dockingPortId.ePortNumber === 3)
                {
                     portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.port33 = '';
                    else
                        $scope.port33 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                }
                else if (ports[i].dockingPortId.ePortNumber === 4)
                {
                      portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.port34 = '';
                    else
                        $scope.port34 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                }
            }
            else if (ports[i].dockingPortId.FPGA === 4) 
            {
                if (ports[i].dockingPortId.ePortNumber === 1)
                {
                    portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.port41 = '';
                    else
                        $scope.port41 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                }
                else if (ports[i].dockingPortId.ePortNumber === 2)
                {
                    portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.port42 = '';
                    else
                        $scope.port42 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                }
                else if (ports[i].dockingPortId.ePortNumber === 3)
                {
                    portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.port43 = '';
                    else
                        $scope.port43 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                }
                else if (ports[i].dockingPortId.ePortNumber === 4)
                {
                     portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.port44 = '';
                    else
                        $scope.port44 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                }
            } 
            else if (ports[i].dockingPortId.FPGA === 5) 
            {
                if (ports[i].dockingPortId.ePortNumber === 1)
                {
                     portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.port51 = '';
                    else
                        $scope.port51 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                }
                else if (ports[i].dockingPortId.ePortNumber === 2)
                {
                     portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.port52 = '';
                    else
                        $scope.port52 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                }
                else if (ports[i].dockingPortId.ePortNumber === 3)
                {
                     portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.port53 = '';
                    else
                        $scope.port53 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                }
                else if (ports[i].dockingPortId.ePortNumber === 4)
                {
                     portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.port54 = '';
                    else
                        $scope.port54 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                }
            } 
            else if (ports[i].dockingPortId.FPGA === 6) 
            {
                if (ports[i].dockingPortId.ePortNumber === 1)
                {
                     portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.port61 = '';
                    else
                        $scope.port61 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                }
                else if (ports[i].dockingPortId.ePortNumber === 2)
                {
                     portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.port62 = '';
                    else
                        $scope.port62 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                }
                else if (ports[i].dockingPortId.ePortNumber === 3)
                {
                     portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.port63 = '';
                    else
                        $scope.port63 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                }
                else if (ports[i].dockingPortId.ePortNumber === 4)
                {
                     portids.push(ports[i].dockingPortId.PortID);
                    if (ports[i].dockingPortId.vehicleId.length === 0)
                        $scope.port64 = '';
                    else
                        $scope.port64 = (ports[i].dockingPortId.vehicleId[0].vehicleid.vehicleNumber).substring(10);
                }
            }
        }
        $scope.portsEntry.FPGA31= $scope.port31;
         $scope.portsEntry.FPGA32= $scope.port32;
         $scope.portsEntry.FPGA33= $scope.port33;
         $scope.portsEntry.FPGA34= $scope.port34;
         $scope.portsEntry.FPGA41= $scope.port41;
         $scope.portsEntry.FPGA42= $scope.port42;
         $scope.portsEntry.FPGA43= $scope.port43;
          $scope.portsEntry.FPGA44= $scope.port44;
         $scope.portsEntry.FPGA51= $scope.port51;
         $scope.portsEntry.FPGA52= $scope.port52;
         $scope.portsEntry.FPGA53= $scope.port53;
         $scope.portsEntry.FPGA54= $scope.port54;
         $scope.portsEntry.FPGA61= $scope.port61;
         $scope.portsEntry.FPGA62= $scope.port62;
         $scope.portsEntry.FPGA63= $scope.port63;
         $scope.portsEntry.FPGA64= $scope.port64;
    };
 
   
    $scope.submit = function ()
    {
        var cyclenumber = [];
        if (len === 4) {
            cyclenumber.push($scope.portsEntry.FPGA31);
            cyclenumber.push($scope.portsEntry.FPGA32);
            cyclenumber.push($scope.portsEntry.FPGA33);
            cyclenumber.push($scope.portsEntry.FPGA34);
            cyclenumber.push($scope.portsEntry.FPGA41);
            cyclenumber.push($scope.portsEntry.FPGA42);
            cyclenumber.push($scope.portsEntry.FPGA43);
            cyclenumber.push($scope.portsEntry.FPGA44);
            cyclenumber.push($scope.portsEntry.FPGA51);
            cyclenumber.push($scope.portsEntry.FPGA52);
            cyclenumber.push($scope.portsEntry.FPGA53);
            cyclenumber.push($scope.portsEntry.FPGA54);
            cyclenumber.push($scope.portsEntry.FPGA61);
            cyclenumber.push($scope.portsEntry.FPGA62);
            cyclenumber.push($scope.portsEntry.FPGA63);
//            cyclenumber.push($scope.port63);
            cyclenumber.push($scope.portsEntry.FPGA64);
        } else {
            cyclenumber.push($scope.portsEntry.FPGA31);
            cyclenumber.push($scope.portsEntry.FPGA32);
            cyclenumber.push($scope.portsEntry.FPGA33);
            cyclenumber.push($scope.portsEntry.FPGA34);
            cyclenumber.push($scope.portsEntry.FPGA41);
            cyclenumber.push($scope.portsEntry.FPGA42);
            cyclenumber.push($scope.portsEntry.FPGA43);
            cyclenumber.push($scope.portsEntry.FPGA44);
            cyclenumber.push($scope.portsEntry.FPGA51);
            cyclenumber.push($scope.portsEntry.FPGA52);
            cyclenumber.push($scope.portsEntry.FPGA53);
            cyclenumber.push($scope.portsEntry.FPGA54);;
        }
//      }
//        alert(cyclenumber + "\n" + portids);
var checkin = [];
        for (var i = 0; i < cyclenumber.length; i++)
        {
            if (cyclenumber[i] > 0)
            {
                var checkinEntry = {
                cycle : 'MYS-Fleet-' + cyclenumber[i],
                        portID:portids[i]
                    };
                    checkin.push(checkinEntry);
                }
            }
var checkinsuccess = [],checkinfailure = [];
for(var i=0;i<checkin.length;i++){
            var checkindata = {
                vehicleId: checkin[i].cycle,
                toPort: checkin[i].portID,
                checkInTime: new Date()
            };
            $http({
                method: "POST",
                url: ipURL + "transactions/checkin/app", //checkin
                data: checkindata,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response, status) {
                $scope.checkinData = response.data.data;
                if($scope.checkinData.errorStatus===1)
                    checkinfailure.push($scope.checkinData);
                else
                    checkinsuccess.push($scope.checkinData);
                if(checkinfailure.length>0)
                    sweetAlert(checkinfailure.length+"\tports\t"+checkinfailure.errorMsg);
                else
                    sweetAlert(checkinsuccess.length+"\tports\t"+response.data.message);

            });
        }
    };
});