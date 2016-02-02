'use strict';
angular.module('main')
  .controller('SignupCtrl', function($scope, $log, $cordovaDevice, $state, c_api, c_user) {

    var api = c_api;
    $scope.api = api;
    var user = c_user;
    $scope.user = user;

    $scope.formData = {};
    $scope.passwordRegex = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,16}$';
    $scope.signedup = false;

    $scope.formData = {
      persist: true
    };

    $scope.signup = function(form) {

      // handle validation errors
      if (form.$invalid) {
        var err = form.$error[Object.keys(form.$error)[0]][0]; // get 'first' error
        if (err.$name === 'email') {
          form[err.$name].tooltip = 'Enter an Email Address';
        }
        if (err.$name === 'password') {
          form[err.$name].tooltip = 'Password must contain 1 number, uppercase and lowercase character';
        }
        if (err.$name === 'cpassword') {
          form[err.$name].tooltip = 'Confirm your Password';
        }
        return;
      }

      // submit
      var formData = {
        email: $scope.formData.email,
        password: $scope.formData.password,
        persist: $scope.formData.persist
      };
      return api.auth.signup(formData, function(res) {
        $scope.signedup = true;
        api.message.set(res);
        user.signin(res[0].token);
        $scope.formData = {
          persist: true
        };
        formData = null;
        setTimeout(function() {
          $state.go('main.profile');
        }, 2000);
      }, function(res) {
        api.message.set(res);
      });

    };
  });
