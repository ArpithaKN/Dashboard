var app = angular.module('myApp', []);

app.controller('customersCtrl', function ($scope, $http) {
    var data = [];
    var baseURL = "https://www.mytrintrin.com:13060/api/";
    $http({
        method: "GET",
        url: baseURL + "dockstation",
        data: '',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response, status) {
        $scope.myData = response.data.data;
//        alert(JSON.stringify($scope.myData[0].gpsCoordinates.latitude));
    });
    
    
   // var myvar1 = setInterval(getdata, 15000);//setInterval for 15 sec
    function getdata()  //calling function for setInterval
    {
        var data = [];
        $http({
            method: "GET",
            url: baseURL + "dockstation",
            data: '',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.myData = response.data.data;
            data = $scope.myData;

            var zone11 = [], zone21 = [], zone31 = [], zone41 = [], zone51 = [];
            //To store the data in zonewise
            lab :for (var i = 0; i < data.length; i++)
            {
                if (data[i].zoneId === "1")
                {
                    zone11.push($scope.myData[i]);
                    continue lab;
                }
                if (data[i].zoneId === "2") {
                    zone21.push(data[i]);
                    continue lab;
                }
                if (data[i].zoneId === "3") {
                    zone31.push(data[i]);
                    continue lab;
                }
                if (data[i].zoneId === "4") {
                    zone41.push(data[i]);
                    continue lab;
                }
                if (data[i].zoneId === "5") {
                    zone51.push(data[i]);
                    continue lab;
                }
            }
            $scope.zone1Data = zone11;
            $scope.zone2Data = zone21;
            $scope.zone3Data = zone31;
            $scope.zone4Data = zone41;
            $scope.zone5Data = zone51;
            //To find the locked ports
            var errordata = [];
            for (var k = 0; k < data.length; k++)
            {
                var j = $scope.myData[k].portIds;
                for (var l = 0; l < j.length; l++)
                {
                    if (j[l].dockingPortId.portStatus === -1)
                        errordata.push($scope.myData[k]);
                }
            }
            $scope.error = errordata;
            var un = [];
            for (var i = 0; i < errordata.length; i++)
                if (errordata[i] !== errordata[i + 1])
                    un.push(errordata[i]);
            $scope.err = un;
        });
    }
});
    