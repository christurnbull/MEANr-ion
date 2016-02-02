'use strict';

/**
 * @ngdoc service
 * @name ionApp.api
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description Service to interact with API server using ngResource
 */
angular.module('main')
  .factory('c_api', function($resource, Config, $timeout) {

    /*
    // SECURITY WARNING cache is in plain text in the browser, be careful with confidential data
    var cacheDefaults = {
      maxAge: 15 * 60 * 1000, // Items added to this cache expire after 15 minutes
      //cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every hour
      //deleteOnExpire: 'aggressive', // Items will be deleted from this cache when they expire
      storageMode: 'localStorage'
    };
    */

    var host = Config.ENV.appCfg.host.name + Config.ENV.appCfg.host.path;

    var api = {

      auth: $resource(host + '/auth', {}, {
        signin: {
          method: 'POST',
          isArray: true
        },
        refresh: {
          method: 'POST',
          isArray: true,
          url: host + '/auth/refresh'
        },
        confirm: {
          method: 'POST',
          isArray: true,
          url: host + '/auth/confirm'
        },
        resetReq: {
          method: 'POST',
          isArray: true,
          url: host + '/auth/reset'
        },
        reset: {
          method: 'PUT',
          isArray: true,
          url: host + '/auth/reset'
        },
        revoke: {
          method: 'POST',
          isArray: true,
          url: host + '/auth/revoke/:userId/:tid'
        },
        provider: {
          method: 'POST',
          isArray: true,
          url: host + '/auth/provider/login'
        },
        signup: {
          method: 'POST',
          isArray: true,
          url: host + '/auth/signup'
        },
        resend: {
          method: 'GET',
          isArray: true,
          url: host + '/auth/resend/:userId'
        },
      }),
      user: $resource(host + '/user/:userId', {}, {
        get: {
          method: 'GET',
          isArray: true,
          cache: false /*CacheFactory('cacheUser', cacheDefaults)*/
        },
        update: {
          method: 'PUT',
          isArray: true
        },
        capabilities: {
          method: 'GET',
          isArray: true,
          url: host + '/user/capabilities/:userId'
        },
      }),
      admin: $resource(host + '/admin/users', {}, {
        get: {
          method: 'GET',
          isArray: true,
          cache: false /*CacheFactory('cacheUser', cacheDefaults)*/
        },
        ban: {
          method: 'POST',
          isArray: true,
          url: host + '/admin/ban/:userId'
        },
        password: {
          method: 'POST',
          isArray: true,
          url: host + '/admin/password/:userId'
        },
        audit: {
          method: 'POST',
          isArray: true,
          url: host + '/audit'
        },
        typeahead: {
          method: 'POST',
          isArray: true,
          url: host + '/audit/typeahead'
        },
        routes: {
          method: 'GET',
          isArray: true,
          url: host + '/admin/routes'
        },
        banned: {
          method: 'GET',
          isArray: true,
          url: host + '/admin/banned'
        },
        unban: {
          method: 'POST',
          isArray: true,
          url: host + '/admin/banned'
        },
        minigun: {
          method: 'POST',
          isArray: true,
          url: host + '/admin/minigun'
        },
      }),
      stripe: $resource(host + '/stripe', {}, {
        donate: {
          method: 'POST',
          isArray: true,
          url: host + '/stripe/donate'
        },
      }),
      message: {
        data: {},
        show: false,
        set: function(d) {
          var m = (d.config && d.data && d.status) ? d.data : d;
          try {
            this.data.msg = m[0].msg;
            this.data.desc = m[0].desc;
            this.data.type = d.status >= 400 ? 'bar-assertive' : d.type || 'bar-balanced';
            this.data.timeout = d.type === 'bar-assertive' ? '5000' : '3000';
            this.data.class = d.type === 'bar-assertive' ? 'apiMessageAttn' : 'apiMessage';
          } catch (e) {
            this.data.msg = 'Error';
            this.data.desc = '';
            this.data.type = 'bar-assertive';
            this.data.timeout = '5000';
            this.data.class = 'apiMessageAttn';
          }
          this.show = true;
          $timeout(function() {
            api.message.show = false;
          }, this.data.timeout);
        }
      }
    };

    return api;
  });
