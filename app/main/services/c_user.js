'use strict';

/**
 * @ngdoc service
 * @name ionApp.User
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description Service to hold user data
 */
angular.module('main')
  .service('c_user', function User($injector, $window, $rootScope, $localStorage, Config) {

    /**
     * Init
     */
    var host = Config.ENV.appCfg.host.name + Config.ENV.appCfg.host.path;
    $rootScope.$storage = $localStorage;


    /**
     * Private
     */
    function decodeToken(token) {
      if (!token) {
        return null;
      }
      var tokendata = token.split('.')[1];
      var utoken = JSON.parse(url_base64_decode(tokendata));
      return utoken;
    }

    function url_base64_decode(str) {
      var output = str.replace('-', '+').replace('_', '/');
      switch (output.length % 4) {
        case 0:
          break;
        case 2:
          output += '==';
          break;
        case 3:
          output += '=';
          break;
        default:
          throw 'Illegal base64url string!';
      }
      return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
    }


    /**
     * Public
     */
    var data = {
      userId: null,
      utoken: null,
      signin: function(token) {
        $rootScope.$storage.token = token;
        data.getCapabilities();
      },
      getCapabilities: function() {
        data.utoken = decodeToken($rootScope.$storage.token);
        if (data.utoken) {
          data.userId = data.utoken.sub.userId;
        }
        var userId = data.userId || '';
        $injector.invoke(['$http', function($http) {
          $http.get(host + '/user/capabilities/' + userId).then(function(response) {
            $rootScope.$storage.userCapabilities = response.data[0];
          });
        }]);
      },
      signout: function() {
        // post signout so server can revoke token
        $injector.invoke(['$http', function($http) {
          $http.get(host + '/auth/logout', {
            headers: {
              Authorization: 'Bearer ' + $rootScope.$storage.token
            }
          });
        }]);

        delete $rootScope.$storage.token;
        delete $rootScope.$storage.userCapabilities;
        data.userId = null;
        data.utoken = null;
        data.getCapabilities();
        // erase history and change view state
        $injector.get('$ionicHistory').nextViewOptions({
          historyRoot: true
        });
        $injector.get('$state').go('main.signin');
      },
    };

    return data;

  });
