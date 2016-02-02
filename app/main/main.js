'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'ngResource',
  'ngStorage',
  'ngResponseButton',
  'ngUaIcons',
  'validation.match'
  // TODO: load other modules selected during generation
])
  .config(function($stateProvider, $urlRouterProvider) {

    // ROUTING with ui.router
    $urlRouterProvider.otherwise('/main/home');
    $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
      .state('main', {
        url: '/main',
        abstract: true,
        templateUrl: 'main/templates/menu.html',
        controller: 'MenuCtrl as menu'
      })
      .state('main.home', {
        url: '/home',
        views: {
          'pageContent': {
            templateUrl: 'main/templates/home.html',
            //controller: 'SigninCtrl as ctrl'
          }
        }
      })
      .state('main.signin', {
        url: '/signin',
        views: {
          'pageContent': {
            templateUrl: 'main/templates/signin.html',
            controller: 'SigninCtrl as ctrl'
          }
        }
      })
      .state('main.signup', {
        url: '/signup',
        views: {
          'pageContent': {
            templateUrl: 'main/templates/signup.html',
            controller: 'SignupCtrl as ctrl'
          }
        }
      })
      .state('main.profile', {
        url: '/profile',
        views: {
          'pageContent': {
            templateUrl: 'main/templates/profile.html',
            controller: 'ProfileCtrl as ctrl'
          }
        }
      });
  });
