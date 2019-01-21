(function() {
    'use strict';

    angular.module('postfirerecovery')
    .config(function ($locationProvider, $stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home');

        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'static/app/templates/home.html'
        });

        $stateProvider.state('map', {
            url: '/map',
            templateUrl: 'static/app/templates/map.html',
            controller: 'mapController'
        });

        $stateProvider.state('analysis', {
            url: '/analysis',
            templateUrl: 'static/app/templates/analysis.html',
            controller: 'analysisController'
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

        $stateProvider.state('contact_us', {
            url: '/contact_us',
            templateUrl: 'static/app/templates/contact-us.html',
            controller: 'authController'
        });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    });

})();
