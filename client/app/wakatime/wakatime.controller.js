'use strict';

//Need to redraw all charts on carousel move, but don't reload data.

angular.module('noSassApp')
  .controller('WakatimeCtrl', function ($scope, $http) {
            $scope.totalTimesData = [];
            $scope.languageNamesData = [];
            $scope.allDateLabels = [];
            $scope.allLanguageSeries = [];

            $scope.awesomeThings = [];

            $http.get('/api/wakatime').success(function(response_data) {
                var labels = [];
                var totalTimes = [];

                var dateLabels = [];
                var languageSeries = [];

                for(var i = 0; i < response_data.length; i++) {
                    //console.log(response_data[i].language_name);
                    labels.push(response_data[i].language_name);
                    var timeCount = 0;
                    for(var j = 0; j < response_data[i].dateTimes.length; j++) {
                        timeCount += response_data[i].dateTimes[j].time;


                        var tempDate = new Date(response_data[i].dateTimes[j].date);
                        tempDate.setHours(0,0,0,0);

                        dateLabels.push(tempDate);
                    }
                    totalTimes.push(timeCount);
                }

                $scope.totalTimesData = totalTimes;
                $scope.languageNamesData = labels;

                //sort the dates
                dateLabels = dateLabels.sort(function(a,b){
                  // Turn your strings into dates, and then subtract them
                  // to get a value that is either negative, positive, or zero.
                  return a - b;
                });

                //Remove Duplicate dates
                var dateLabels = dateLabels.filter(function(elem, pos) {
                    var isUnique = true;
                    for(var i = 0; i < dateLabels.length && isUnique; i++) {
                        if(elem.getMonth() == dateLabels[i].getMonth() && elem.getDate() == dateLabels[i].getDate() && pos != i) {
                            isUnique = false;
                        }
                    }
                    return isUnique;
                });

                for(var i = 0; i < response_data.length; i++) {
                    var tempSeries = [];

                    for(var j = 0; j < dateLabels.length; j++) {
                        //Go through each date, now for each language, see if it has a date matching the current index.
                        //If it doesn't, push 0.

                        var found = false;
                        for(var k = 0; k <  response_data[i].dateTimes.length && !found; k++) {
                                var tempDate = new Date(response_data[i].dateTimes[k].date);
                                tempDate.setHours(0,0,0,0);

                                if(tempDate.getMonth() == dateLabels[j].getMonth() && tempDate.getDate() == dateLabels[j].getDate()) {
                                    found = true;
                                    //Convert to hours
                                    tempSeries.push(response_data[i].dateTimes[k].time/3600);
                                }
                        }//end date loop
                        if(!found) {
                           tempSeries.push(0);
                        }
                    }//end date label loop
                    languageSeries.push(tempSeries);
                }//end response data loop

                $scope.allDateLabels = dateLabels;
                $scope.allLanguageSeries = languageSeries;

                init();
            });


            var init = function () {
                initLanguageLineChart();
                initPieChart();
                initLanguageBarChart();
            };

            var initLanguageLineChart = function() {
                var justDateLabels = [];

                for(var i = 0; i < $scope.allDateLabels.length; i++) {
                    justDateLabels.push($scope.allDateLabels[i].toJSON().slice(0,10));
                }

                var chart = new Chartist.Line('#languages-line-chart', {
                  labels: justDateLabels,
                  series: $scope.allLanguageSeries
                }, {
                  low: 0,
                  showArea: true,
                  showPoint: true,
                  fullWidth: true,
                  height: 500,
                  plugins: [
                  ]
                });

                // console.log(chart.ct-series-colors);

                chart.on('draw', function(data) {
                  if(data.type === 'line' || data.type === 'area') {
                    data.element.animate({
                      d: {
                        begin: 2000 * data.index,
                        dur: 2000,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.Svg.Easing.easeOutQuint
                      }
                    });
                  }
                });
            };

            var initPieChart = function() {
                var data = {
                  labels: $scope.languageNamesData,
                  series: $scope.totalTimesData
                };

                console.log(data);

                var options = {
                  labelInterpolationFnc: function(value) {
                    return value[0]
                    },
                    width: 500,
                    height: 500,
                    plugins: [
                    ]
                };

                var responsiveOptions = [
                  ['screen and (min-width: 640px)', {
                    chartPadding: 30,
                    labelOffset: 120,
                    labelDirection: 'explode',
                    labelInterpolationFnc: function(value) {
                      return value;
                    }
                  }],
                  ['screen and (min-width: 1024px)', {
                    labelOffset: 120,
                    chartPadding: 20
                  }]
                ];

                new Chartist.Pie('#languages-pie-chart', data, options, responsiveOptions);
            };

            var initLanguageBarChart = function() {
                var totalTimesHours = [];

                for(var i = 0; i < $scope.totalTimesData.length; i++) {
                    console.log(Math.ceil($scope.totalTimesData[i]/3600));
                    totalTimesHours.push(Math.ceil($scope.totalTimesData[i]/3600));
                }

                var data = {
                  labels: $scope.languageNamesData,
                  series: totalTimesHours
                };

                var options = {
                    height: 500,
                    width: 1000,
                    fullWidth: true,
                    distributeSeries: true
                };

                new Chartist.Bar('#languages-bar-chart', data, options);
            };

            var testAPI = function() {
                //Simple POST example:
                var data_post = {
                    language_name: 'Python',
                    hidden: false,
                    dateTimes : [{
                      date : new Date(),
                      time : 7000
                  }]
                };

                $http({
                    method: 'POST',
                    url: '/api/wakatime',
                    data:  JSON.stringify((data_post)),
                    headers: {'Content-Type': 'application/json'}
                }).then(function successCallback(response) {
                    console.log(response);
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });

                // Simple GET request example:
                $http({
                    method: 'GET',
                    url: '/api/wakatime'
                    }).then(function successCallback(response) {
                        console.log(response);
                    }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            };



            //
            // $http.get('/api/things').success(function(awesomeThings) {
            //   $scope.awesomeThings = awesomeThings;
            // });
            //
            // $scope.addThing = function() {
            //   if($scope.newThing === '') {
            //     return;
            //   }
            //   $http.post('/api/things', { name: $scope.newThing });
            //   $scope.newThing = '';
            // };
            //
            // $scope.deleteThing = function(thing) {
            //   $http.delete('/api/things/' + thing._id);
            // };
  });
