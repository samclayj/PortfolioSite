'use strict';

angular.module('noSassApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('exp', {
        url: '/Exp',
        templateUrl: 'app/experience/experience.html',
        controller: 'ExpCtrl',
      })
  });
