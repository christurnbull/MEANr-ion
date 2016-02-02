'use strict';
angular.module('main')
  .controller('MenuCtrl', function($log, $scope, c_user) {

    var user = c_user;
    $scope.user = user;

    user.getCapabilities();

  });
