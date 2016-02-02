'use strict';

/**
 * @ngdoc service
 * @name ionApp.authInterceptor
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description Add bearer token to every request and refresh expired tokens
 */
angular.module('main')
  .factory('c_authInterceptor', function($rootScope, $q, $window, $injector, $localStorage, c_user, Config) {

    var user = c_user;
    var host = Config.ENV.appCfg.host.name + Config.ENV.appCfg.host.path;

    return {
      request: function(config) {
        var token = $rootScope.$storage.token;
        if (token) {
          config.headers.authorization = 'Bearer ' + token;
        }
        return config;
      },
      response: function(res) {
        return res;
      },
      responseError: function(rejection) {
        //console.log('Intercepter Error');
        if (rejection.status === 401) {
          if (rejection.data[0].msg === 'Expired token') {
            // Try to refresh the token once
            var defer = $q.defer(rejection);
            $injector.invoke(['$http', function($http) {
              $http.post(host + '/auth/refresh').then(function(res) {
                $rootScope.$storage.token = res.data[0].token;
                // re-submit original request
                $http(rejection.config).then(function(res) {
                  defer.resolve(res);
                }, function(res) {
                  defer.reject(res);
                });
              }, function(res) {
                defer.reject(res);
              });
            }]);

            return defer.promise;

          } else {
            // 401 not caused by expired token
            if (rejection.config.url.indexOf('/auth/refresh') >= 0 || rejection.config.url.indexOf('/auth') === -1) {
              // signout user unless 401 is from signin/signout/refresh routes (stops never ending loop)
              setTimeout(function() {
                user.signout();
              }, 3000);
            }
            return $q.reject(rejection);
          }
        } else {
          return $q.reject(rejection);
        }
      }
    };
  });

angular.module('ionApp')
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('c_authInterceptor');
  });
