'use strict';
angular.module('main')
  .controller('ProfileCtrl', function($scope, $log, $cordovaDevice, $localStorage, c_api, c_user) {

    /**
     * Init
     */
    var api = c_api;
    $scope.api = api;
    var user = c_user;
    $scope.user = user;
    $scope.$storage = $localStorage;


    /**
     * Private
     */
    function getUser() {
      $scope.formData = {};
      api.user.get({
        userId: user.userId
      }, function(res) {
        $scope.formData = res[0];
        $scope.persistTokens = res[0].persistTokens;
        $scope.formData.name = $scope.$storage.userCapabilities.passport.displayName || res[0].name;
      }, function(res) {
        api.message.set(res);
      });
    }

    getUser();


    /**
     * Public
     */
    $scope.reset = function() {
      return api.auth.resetReq({
        email: $scope.formData.email
      }, function(res) {
        api.message.set(res);
      }, function(res) {
        api.message.set(res);
      });
    };


    $scope.save = function() {
      var data = {};
      if ($scope.$storage.userCapabilities.provider) {
        data.email = $scope.formData.email;
      } else {
        data.name = $scope.formData.name;
      }

      return api.user.update({
        userId: user.userId
      }, data, function() {
        user.getCapabilities();
      }, function(res) {
        api.message.set(res);
      });
    };


    $scope.revoke = function(tid, token) {
      api.auth.revoke({
        userId: user.userId,
        tid: tid
      }, {
        token: token
      }, function(res) {
        api.message.set(res);
        getUser();
      }, function(res) {
        api.message.set(res);
      });
    };


    $scope.resend = function() {
      api.auth.resend({
        userId: user.userId
      }, function(res) {
        api.message.set(res);
      }, function(res) {
        api.message.set(res);
      });
    };


    /*
      // bind data from services
      this.someData = Main.someData;
      this.ENV = Config.ENV;
      this.BUILD = Config.BUILD;
      // get device info
      ionic.Platform.ready(function () {
        if (ionic.Platform.isWebView()) {
          this.device = $cordovaDevice.getDevice();
        }
      }.bind(this));

      // PASSWORD EXAMPLE
      this.password = {
        input: '', // by user
        strength: ''
      };
      this.grade = function () {
        var size = this.password.input.length;
        if (size > 8) {
          this.password.strength = 'strong';
        } else if (size > 3) {
          this.password.strength = 'medium';
        } else {
          this.password.strength = 'weak';
        }
      };
      this.grade();
      */

  });
