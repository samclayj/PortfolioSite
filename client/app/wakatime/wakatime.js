'use strict';

angular.module('noSassApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('wakatime', {
        url: '/Wakatime',
        templateUrl: 'app/wakatime/wakatime.html',
        controller: 'WakatimeCtrl',
      })
  });
