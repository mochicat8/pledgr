angular.module('pledgr', [
  'pledgr.charities',
  'pledgr.factories',
  'pledgr.home',
  'pledgr.signup',
  'pledgr.signin',
  'ui.router'
])
.config(function($stateProvider, $urlRouterProvider, $window) {
//.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/home/home.html',
      controller: 'HomeController'
    })
    .state('signin', {
      url: '/signin',
      templateUrl: 'app/signin/signin.html',
      controller: 'SignInController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/signup/signup.html',
      controller: 'SignupController'
    })
    .state('charities', {
       url: '/charities/{c1:[0-9]+}/{c2:[0-9]+}/{c3:[0-9]+}',
       templateUrl: 'app/charities/charities.html',
       controller: 'CharitiesController'
    });

    // sets your application publishable key
    $window.Stripe.setPublishableKey('pk_test_3Fzz9YSECJXQuhTlWhLzcj6P');

    // $httpProvider.interceptors.push('AttachTokens');
});
