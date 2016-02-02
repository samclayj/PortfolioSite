'use strict';

angular.module('noSassApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('projects', {
         url: '/Projects',
         templateUrl: 'app/projects/projects.html',
         controller: 'ProjectsCtrl'
       });
  });
