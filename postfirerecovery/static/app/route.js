(function() {
    'use strict';

    angular.module('postfirerecovery')
    .config(function ($locationProvider, $stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/map');
    
        $stateProvider.state('map', {
            url: '/map',
            templateUrl: 'static/app/templates/map.html',
            controller: 'mapController'
        });
    
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'static/app/templates/login.html',
            controller: 'authController'
        });
    
        $stateProvider.state('profile', {
            url: '/profile',
            templateUrl: 'static/app/templates/profile.html',
            controller: 'authController'
        });

        $stateProvider.state('change_password', {
            url: '/change_password',
            templateUrl: 'static/app/templates/change-password.html',
            controller: 'authController'
        });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    });

})();
