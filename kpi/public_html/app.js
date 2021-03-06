var app = angular.module('myApp',['angularMoment']);
var baseURL60 = "https://www.mytrintrin.com:13060/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
var ipURL80 = "http://43.251.80.79:13080/api/";              //to unlock and create a checkouts record,transactions
var ipURL60 = "http://43.251.80.79:13060/api/";
var todayDate = new Date(); //current date
var idlist = [];
app.controller('customersCtrl', function ($scope, $http) {
    $http({
        method: "GET",
        url: baseURL60 + "kpi/dockstation/all", //complete transaction
        data: '',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response3, status) {
        $scope.kpidata = response3.data.data;
        $scope.totalrecords = $scope.kpidata.length;
        var kpiData6 = [], kpiData7 = [];
        for (var i = 0; i < $scope.kpidata.length; i++)
        {
            var statues;
            if ($scope.kpidata[i].status === 1)
                statues = 'Full';
            else
                statues = 'Empty';
            var starttime = new Date($scope.kpidata[i].starttime);
            var endtime = new Date($scope.kpidata[i].endtime);
            var month = starttime.getMonth() + 1;
            var year = starttime.getFullYear();
            if (month ===06  && year === 2018) {
//                if($scope.kpidata[i].timeduration >200){
                var kpidataEntry = {
                    _id: $scope.kpidata[i]._id,
                    stationtype: $scope.kpidata[i].stationtype,
                    name: $scope.kpidata[i].stationid.name,
                    stationid: $scope.kpidata[i].stationid._id,
                    peekduration: $scope.kpidata[i].peekduration,
                    timeduration: $scope.kpidata[i].timeduration,
                    updateStatus: $scope.kpidata[i].updateStatus,
                    endtime: endtime,
                    stime:$scope.kpidata[i].starttime,
                    etime:$scope.kpidata[i].endtime,
                    starttime: starttime,
                    status: $scope.kpidata[i].status,
                    cyclenums: $scope.kpidata[i].cyclenums,
                    RecordID: $scope.kpidata[i].RecordID,
                    updatedcyclenums: $scope.kpidata[i].updatedcyclenums,
                    status1: statues,
                    offpeekduration: $scope.kpidata[i].offpeekduration
                };
                kpiData6.push(kpidataEntry);
//            }
            }
            //if (month === 9) 
            else if (month ===05  && year === 2018) {
//                if($scope.kpidata[i].timeduration >200){
                var kpidataEntry = {
                    _id: $scope.kpidata[i]._id,
                    stationtype: $scope.kpidata[i].stationtype,
                    name: $scope.kpidata[i].stationid.name,
                    stationid: $scope.kpidata[i].stationid._id,
                    peekduration: $scope.kpidata[i].peekduration,
                    timeduration: $scope.kpidata[i].timeduration,
                    updateStatus: $scope.kpidata[i].updateStatus,
                    endtime: endtime,
                    stime:$scope.kpidata[i].starttime,
                    etime:$scope.kpidata[i].endtime,
                    starttime: starttime,
                    status: $scope.kpidata[i].status,
                    cyclenums: $scope.kpidata[i].cyclenums,
                    RecordID: $scope.kpidata[i].RecordID,
                    updatedcyclenums: $scope.kpidata[i].updatedcyclenums,
                    status1: statues,
                    offpeekduration: $scope.kpidata[i].offpeekduration
                };
                kpiData7.push(kpidataEntry);
//            }
        }
        }
        $scope.dockKPI6 = kpiData6;
        $scope.dockKPI7 = kpiData7;
        $scope.totalrecordsdockKPI6 = $scope.dockKPI6.length;
        $scope.totalrecordsdockKPI7 = $scope.dockKPI7.length;
    });
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
    $scope.deletekpirecord = function ()
    {
        var idlists = idlist;
        idlist = [];
        for (var i = 0; i < idlists.length; i++)
        {
            $http({
                method: 'DELETE',
                url: baseURL60 + "kpi/dockstation/" + idlists[i], //In Local
                data: '',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response, status) {
                $scope.kpidata = response.data.message;
                sweetAlert($scope.kpidata);
            });
        }
    };
    $scope.updateKPIrecord = function (data){
        var starttime = data.stime;
        starttime = new Date(starttime);
        

    var s =  data.stime;
    var e =  data.stime;
    var stime = moment(s).add(45,'minutes');
    var endtime = moment(e).add(120,'minutes');
    var new_time = randomTime(new Date(stime), new Date(endtime));
        
       function randomTime(start, end) {
    var diff =  end.getTime() - start.getTime();
    var new_diff = diff * Math.random();
    var date = new Date(start.getTime() + new_diff);
    return date;
} 
        new_time = new Date(new_time);
        var duration = (new_time.getTime() - starttime.getTime())/60000;
        alert(duration);
         var endgethour = new_time.getHours();
        var startgethour = starttime.getHours();
        var peek = 0;
        var offpeek = 0;
        if (((startgethour >= 8) && (endgethour < 11)) || ((startgethour >= 16) && (endgethour < 19)))
        {
            peek = duration;
        }
       else if(((startgethour < 8) && (endgethour < 8)) || ((startgethour >= 11) && (endgethour < 16)) ||((startgethour >= 19) && (endgethour < 19)))
        {
            offpeek = duration;
        }
//        else if(((startgethour < 8) && (endgethour >= 8)) || ((startgethour < 16) && (endgethour >= 16)))
//        {
//            var peekhours8 = new_time;
//                peekhours8.setHours(8);
//        }
 
//        else if(((startgethour < 8) && (endgethour >= 8)) ||((startgethour < 16) && (endgethour >= 16)))
//        {
//            var boundry1 = etime;
//                    boundry1.setHours(8);;
//            var boundry2 = etime;
//                   boundry2.setHours(16);
//            if(startgethour < 8)
//            {
//            peek = (endtime.getTime() - boundry1.getTime())/60000;
//            offpeek = (boundry1.getTime()-starttime.getTime() )/60000;
//        }
//           if(startgethour < 16){
//               peek = (endtime.getTime() - boundry2.getTime())/60000;
//            offpeek = (boundry2.getTime()-starttime.getTime() )/60000;
//           }
//        }
//         else if(((startgethour < 11) && (endgethour >= 11)) ||((startgethour < 19) && (endgethour >= 19)))
//        {
//             var boundry1 = etime;
//                    boundry1.setHours(11);;
//            var boundry2 = etime;
//                   boundry2.setHours(19);
//             if(startgethour < 11)
//            {
//            peek = (boundry1.getTime()-starttime.getTime())/60000;
//            offpeek = (endtime.getTime() - boundry1.getTime())/60000;
//        }
//           if(startgethour < 19){
//               peek = (boundry2.getTime()-starttime.getTime())/60000;
//            offpeek = (endtime.getTime() - boundry2.getTime())/60000;
//           }
//        }
//        alert("time duration="+duration+"\npeek="+peek+'\noffpeak'+offpeek);
        var kpidataEntry = {
                _id:data._id,
                stationtype: data.stationtype,
                stationid:data.stationid,
                peekduration:peek,
                timeduration: duration,
                updateStatus: data.updateStatus,
                endtime: new_time,
                starttime:data.starttime,
                status:data.status,
                cyclenums:data.cyclenums,
                RecordID:data.RecordID,
                updatedcyclenums:data.updatedcyclenums,
                offpeekduration:offpeek
            };
            $http({
            method: 'PUT',
            url: baseURL60 + "kpi/dockstation/"+data._id, //In Local
            data:kpidataEntry,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
        $scope.kpidata = response.data.message;
        sweetAlert($scope.kpidata);
    });
    };
});
