var app = angular.module('myApp', []);
var baseURL70 = "https://www.mytrintrin.com:13070/api/";
var baseURL60 = "https://www.mytrintrin.com:13060/api/";
var ipURL60 = "http://43.251.80.79:13060/api/";      //unlock,create a checkout and opentransaction and delete opentransaction      
var dockingStationInformation = [],report = [];
var  ports,ip,stationname;
app.controller('customersCtrl', function ($scope, $http) {
    swal({
        title: 'Loading...',
        showCancelButton: false,
        showConfirmButton: false 
    }).then( $http({
                method: "GET",
                url: baseURL70 + "dockstation", //station details
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response1, status) {
        $scope.dockingstationData = response1.data.data;
        dockingStationInformation = $scope.dockingstationData;
             
                 swal.close();
            swal("Its ready to Use");
        })
        );
    
        $scope.selecteddockingstation = function (data) {                   //Docking Station  names and Ip address
                ports = data.portIds;                            //ports
                ip = data.ipAddress;                             //ipaddress of particular station
                stationname = data.name;
    };
    
    
    
    
     $scope.submit = function (from,to){
         var data  = {
             fromdate:from,
             todate:to,
             portIds:ports,
             name:stationname
         };
//         alert(JSON.stringify(data));
     $http({
            method: "POST",
            url: baseURL70 + "transactions/stationwisereport", //vehicle details
            data: data,
            //           timeout: 150000,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response2, status) {
            $scope.AllStationCheckOut = response2.data.data;
            $scope.records = [];
           
            for(var i=0;i<$scope.AllStationCheckOut.length;i++){
                var array = [];
                array = $scope.AllStationCheckOut[i].otherStationsInfo;
                for(var j=0;j<array.length;j++){
                    var details = {
                        FromStation:$scope.AllStationCheckOut[i].statName,
                        ToStation:array[j].statName,
                        count:array[j].count
                    };
                    report.push(details);
                    
                }
            }
            $scope.records = report;
        });
        };
});



