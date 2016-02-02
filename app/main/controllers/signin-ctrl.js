'use strict';
angular.module('main')
  .controller('SigninCtrl', function($scope, $log, $cordovaDevice, $state, c_api, c_user, $ionicHistory) {

    var api = c_api;
    $scope.api = api;
    var user = c_user;
    $scope.user = user;

    $scope.signinData = {
      persist: true
    };
    //$scope.signinData = {      email: 'admin@meanr.io',      password: '123',      persist: true    };

    $scope.signin = function(form) {

      // handle validation errors
      if (form.$invalid) {
        var err = form.$error[Object.keys(form.$error)[0]][0]; // get 'first' error
        // set focus using cordova?
        if (err.$name === 'email') {
          form[err.$name].tooltip = 'Enter an Email Address';
        }
        if (err.$name === 'password') {
          form[err.$name].tooltip = 'Enter a Password';
        }
        return;
      }

      // submit
      return api.auth.signin($scope.signinData, function(res) {
        user.signin(res[0].token);
        $scope.signinData = {
          persist: true
        };
        form.email.tooltip = '';
        form.password.tooltip = '';
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $state.go('main.profile');
      }, function(res) {
        if (res.data[0].msg === 'Not a registered email') {
          form.email.tooltip = res.data[0].msg;
          form.email.$valid = false; // set as not valid to trigger popover
        } else if (res.data[0].msg === 'Incorrect password') {
          form.password.tooltip = res.data[0].msg;
          form.password.$valid = false; // set as not valid to trigger popover
        } else {
          api.message.set(res);
        }
      });

    };

  });
