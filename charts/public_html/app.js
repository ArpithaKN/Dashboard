var app = angular.module('myApp', []);
var baseURL60 = "https://www.mytrintrin.com:13060/api/";
var ipURL80 = "http://43.251.80.79:13080/api/";
var ipURL90 = "http://43.251.80.79:13090/api/";
var ipURL60 = "http://43.251.80.79:13060/api/";
app.controller('customersCtrl', function ($scope, $http) {
  
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
        $scope.Female = ($scope.memberData.Female / $scope.membercount) * 100;
        $scope.Male = ($scope.memberData.Male / $scope.membercount) * 100;
        $scope.agecount = $scope.memberData.greaterthan50 + $scope.memberData.gte40lt50 + $scope.memberData.gte30lt40 + $scope.memberData.gte20lt30 + $scope.memberData.lessthan20;
        $scope.greaterthan50 = ($scope.memberData.greaterthan50 / $scope.agecount) * 100;
        $scope.gte40lt50 = ($scope.memberData.gte40lt50 / $scope.agecount) * 100;
        $scope.gte30lt40 = ($scope.memberData.gte30lt40 / $scope.agecount) * 100;
        $scope.gte20lt30 = ($scope.memberData.gte20lt30 / $scope.agecount) * 100;
        $scope.lessthan20 = ($scope.memberData.lessthan20 / $scope.agecount) * 100;
          $(document).ready(function () {
		
            // prepare chart data
            var  gender = [
                    { Gender:'Male', Male:($scope.Male).toFixed(2)+'%'},
                    { Gender:'Female', Female:($scope.Female).toFixed(2)+'%'}
                ];
                	
            // prepare jqxChart settings
            var settings = {
                title: "Male and Female",
                description: "PBS members",
                padding: { left: 5, top: 5, right: 5, bottom: 5 },
                titlePadding: { left: 90, top: 0, right: 0, bottom: 10 },
                source: gender,
                categoryAxis:
                    {
                        dataField: 'Gender',
                        showGridLines: false
                    },
//                colorScheme: 'scheme01',
                seriesGroups:
                    [
                        {
                            type: 'column',
                            columnsGapPercent: 80,
                            seriesGapPercent: 0,
                            valueAxis:
                            {
                                minValue: 0,
                                maxValue: 100,
                                unitInterval: 10,
                                description: 'Percentage'
                            },
                            series: [
                                    { dataField: 'Male', displayText: 'Male'},
                                    { dataField: 'Female', displayText: 'Female'}
                                ]
                        }
                    ]
            };
            
            // select the chartContainer DIV element and render the chart.
            $('#chartContainer').jqxChart(settings);
             });
            
     
        $(document).ready(function () {
            // prepare chart data as an array
            var Age = [
                    { Age: '>50', Members: ($scope.greaterthan50).toFixed(2)+'%' },
                    { Age: '>40,<50', Members: ($scope.gte40lt50).toFixed(2)+'%' },
                    { Age: '>30,<40', Members:  ($scope.gte30lt40).toFixed(2)+'%' },
                    { Age: '>20,<30', Members: ($scope.gte20lt30).toFixed(2)+'%' },
                    { Age: '<20', Members:($scope.lessthan20).toFixed(2)+'%' }
                ];
            // prepare jqxChart settings
            var settings = {
                title: "Agewise Percentage",
                description: "Agewise PBS Members",
                enableAnimations: true,
                showLegend: true,
                padding: { left: 10, top: 10, right: 15, bottom: 10 },
                titlePadding: { left: 90, top: 0, right: 0, bottom: 10 },
                source: Age,
                colorScheme: 'scheme05',
                xAxis: {
                    dataField: 'Age',
                    unitInterval: 1,
                    tickMarks: { visible: true, interval: 1 },
                    gridLinesInterval: { visible: true, interval: 1 },
                    valuesOnTicks: false,
                    padding: { bottom: 10 }
                },
                valueAxis: {
                    unitInterval: 10,
                    minValue: 0,
                    maxValue: 50,
                    title: { text: 'Percentage' },
                    labels: { horizontalAlignment: 'right' }
                },
                seriesGroups:
                    [
                        {
                            type: 'line',
                            series:
                            [
                                {
                                    dataField: 'Members',
                                    symbolType: 'square',
                                    labels:
                                    {
                                        visible: true,
                                        backgroundColor: '#FEFEFE',
                                        backgroundOpacity: 0.2,
                                        borderColor: '#7FC4EF',
                                        borderOpacity: 0.7,
                                        padding: { left: 5, right: 5, top: 0, bottom: 0 }
                                    }
                                }
                            ]
                        }
                    ]
            };
            // setup the chart
            $('#chartContainer1').jqxChart(settings);
        });
   $(document).ready(function ()
        {
            $('#barGauge').jqxBarGauge({
                colorScheme: "scheme02", width: 300, height: 600,
                values: [$scope.greaterthan50, $scope.gte40lt50, $scope.gte30lt40, $scope.gte20lt30,$scope.lessthan20],
//                data:['>50','>40 and <50','>30 and <40','>20 and <30','<20'],
                max: 50, tooltip: {
                    visible: true, formatFunction: function (value)
                    {
                        var realVal = parseInt(value);
                        return ('Age:' + realVal+'%');
                    }
                }
            });
        });
            });
                    });