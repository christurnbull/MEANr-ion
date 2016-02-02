'use strict';
angular.module('main')
.constant('Config', {

  // gulp environment: injects environment vars
  ENV: {
    /*inject-env*/
    'appCfg': {
      'appName': 'MEANr',
      'host': {
        'name': 'http://0.0.0.0:3000',
        'path': ''
      }
    }
    /*endinject*/
  },

  // gulp build-vars: injects build vars
  BUILD: {
    /*inject-build*/
    /*endinject*/
  }

});
