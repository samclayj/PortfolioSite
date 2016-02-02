'use strict';

//Need to redraw all charts on carousel move, but don't reload data.

angular.module('noSassApp')
  .controller('ExpCtrl', function ($scope, $http) {

            $http.get('/api/things').success(function(awesomeThings) {
              $scope.awesomeThings = awesomeThings;
            });

            $scope.addThing = function() {
              if($scope.newThing === '') {
                return;
              }
              $http.post('/api/things', { name: $scope.newThing });
              $scope.newThing = '';
            };

            $scope.deleteThing = function(thing) {
              $http.delete('/api/things/' + thing._id);
            };

            $scope.init = function () {
                console.log("Experience Init");
            };
  });
