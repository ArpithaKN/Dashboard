var app = angular.module('myApp', ['angularMoment']);
var baseURL60 = "https://www.mytrintrin.com:13060/api/";           //to get dockingstation,member,completeTransactions and vehicle
var imgsrc = "https://www.mytrintrin.com/mytrintrin/Member/";    //to get a profilePic
var ipURL80 = "http://43.251.80.79:13080/api/";              //to unlock and create a checkouts record,transactions
var ipURL60 = "http://43.251.80.79:13060/api/";
var todayDate = new Date(); //current date
var idlist = [];
app.controller('customersCtrl', function ($scope, $http,moment) {
    
    $scope.get = function () {
        var details = {
        fromdate:$scope.fromdate
    };
    $http({
        method: "POST",
        url: baseURL60 + "transactions/checkout/bydate", //complete transaction
        data: details,
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (response3, status) {
        $scope.kpidata = response3.data.data;
    });
};
    $scope.updateKPIrecord = function (data) {
        var updatedata = {
            duration : data.duration
        };
        $http({
            method: 'PUT',
            url: baseURL60 + "transactions/checkout/" + data._id, //In Local
            data: updatedata,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response, status) {
            $scope.kpidata = response.data.message;
            sweetAlert($scope.kpidata);
        });




















//        if (((starttimegethour >= 8) && (endgethour < 11)) || ((starttimegethour >= 16) && (endgethour < 19)))
//        {
//            peek = duration;
//        }
//       else if(((starttimegethour < 8) && (endgethour < 8)) || ((starttimegethour >= 11) && (endgethour < 16)) ||((starttimegethour >= 19) && (endgethour < 19)))
//        {
//            offpeek = duration;
//        }
//        else if(((starttimegethour < 8) && (endgethour >= 8)) || ((starttimegethour < 16) && (endgethour >= 16)))
//        {
//            var peekhours8 = new_time;
//                peekhours8.setHours(8);
//            var peekhours16= new_time;
//                peekhours16.setHours(16);
//                if(endgethour >= 8)
//                {
//                peek = (new_time.getTime() - peekhours8.getTime())/60000;
//                offpeek = (peekhours8.getTime() - starttime.getTime())/60000;
//            }
//            else if(endgethour >= 16)
//                {
//                peek = (new_time.getTime() - peekhours16.getTime())/60000;
//                offpeek = (peekhours16.getTime() - starttime.getTime())/60000;
//            }
//        }
//        else if(((starttimegethour < 11) && (endgethour >= 11)) || ((starttimegethour < 19) && (endgethour >= 19)))
//        {
//             var peekhours8 = new_time;
//                peekhours8.setHours(8);
//            var peekhours16= new_time;
//                peekhours16.setHours(16);
//            var offpeekhours11 = new_time;
//                peekhours11.setHours(11);
//            var offpeekhours19= new_time;
//                peekhours16.setHours(19);
//                if(endgethour >= 8)
//                {
//                peek = (new_time.getTime() - peekhours8.getTime())/60000;
//                offpeek = (peekhours8.getTime() - starttime.getTime())/60000;
//            }
//            else if(endgethour >= 16)
//                {
//                peek = (new_time.getTime() - peekhours16.getTime())/60000;
//                offpeek = (peekhours16.getTime() - starttime.getTime())/60000;
//            }
//        }

//        else if(((starttimegethour < 8) && (endgethour >= 8)) ||((starttimegethour < 16) && (endgethour >= 16)))
//        {
//            var boundry1 = etime;
//                    boundry1.setHours(8);;
//            var boundry2 = etime;
//                   boundry2.setHours(16);
//            if(starttimegethour < 8)
//            {
//            peek = (endtime.getTime() - boundry1.getTime())/60000;
//            offpeek = (boundry1.getTime()-starttime.getTime() )/60000;
//        }
//           if(starttimegethour < 16){
//               peek = (endtime.getTime() - boundry2.getTime())/60000;
//            offpeek = (boundry2.getTime()-starttime.getTime() )/60000;
//           }
//        }
//         else if(((starttimegethour < 11) && (endgethour >= 11)) ||((starttimegethour < 19) && (endgethour >= 19)))
//        {
//             var boundry1 = etime;
//                    boundry1.setHours(11);;
//            var boundry2 = etime;
//                   boundry2.setHours(19);
//             if(starttimegethour < 11)
//            {
//            peek = (boundry1.getTime()-starttime.getTime())/60000;
//            offpeek = (endtime.getTime() - boundry1.getTime())/60000;
//        }
//           if(starttimegethour < 19){
//               peek = (boundry2.getTime()-starttime.getTime())/60000;
//            offpeek = (endtime.getTime() - boundry2.getTime())/60000;
//           }
//        }
//        alert("time duration="+duration+"\npeek="+peek+'\noffpeak'+offpeek);

    };
});