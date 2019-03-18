(function() {

    'use strict';

    angular.module('postfirerecovery')
    .service('AuthService', function ($http, $localStorage) {

        var service = this;

        service.setAuthToken = function (data) {
            $localStorage.authToken = {};
            var authToken = {
                username: data.username,
                token: data.token
            };
            $localStorage.authToken = authToken;
        };

        service.getCurrentUser = function () {
            if ($localStorage.authToken) {
                if ($localStorage.authToken.username && $localStorage.authToken.token) {
                    return $localStorage.authToken.username;
                }
            }
            return null;
        };

        service.getToken = function () {
            if ($localStorage.authToken) {
                if ($localStorage.authToken.username && $localStorage.authToken.token) {
                    return $localStorage.authToken.token;
                }
            }
            return null;
        };

        service.userLogin = function (user) {
            var req = {
                method: 'POST',
                url: '/api/v1/user/login/',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    username: user.username,
                    password: user.password
                }
            };

            var promise = $http(req)
                .then(function (response) {
                    service.setAuthToken(response.data);
                    return true;
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;
        };

        service.userRegister = function (user) {
            var req = {
                method: 'POST',
                url: '/api/v1/user/register/',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    username  : user.userName,
                    password  : user.password,
                    first_name: user.firstName,
                    last_name : user.lastName,
                    email     : user.email
                }
            };

            var promise = $http(req)
            .then(function (response) {
                service.setAuthToken(response.data);
                return true;
            })
            .catch(function (e) {
                console.log('Error: ', e);
                throw e;
            });
            return promise;
        };

        service.userLogout = function () {
            $localStorage.$reset();
            return true;
        };

        service.getUserProfile = function (token) {
            var req = {
                method: 'GET',
                url: '/api/v1/user/profile/',
                headers: {
                    'Authorization': 'Token ' + token,
                }
            };

            var promise = $http(req)
            .then(function (response) {
                return response.data;
            })
            .catch(function (e) {
                console.log('Error: ', e);
                throw e;
            });
            return promise;
        };

        service.updateUserProfile = function (user, token) {
            var req = {
                method: 'PUT',
                url: '/api/v1/user/profile/',
                headers: {
                    'Authorization': 'Token ' + token,
                    'Content-Type': 'application/json'
                },
                data: {
                    username    : user.username,
                    //password  : user.password,
                    first_name  : user.firstName,
                    last_name   : user.lastName,
                    email       : user.email,
                    organization: user.organization
                }
            };

            var promise = $http(req)
            .then(function (response) {
                service.setAuthToken(response.data);
                return true;
            })
            .catch(function (e) {
                console.log('Error: ', e);
                throw e;
            });
            return promise;
        };

        service.changePassword = function (user, token) {
            var req = {
                method: 'PUT',
                url: '/api/v1/user/change_password/',
                headers: {
                    'Authorization': 'Token ' + token,
                    'Content-Type': 'application/json'
                },
                data: {
                    old_password  : user.oldPassword,
                    new_password  : user.newPassword
                }
            };
            console.log(req);
            var promise = $http(req)
            .then(function (response) {
                service.setAuthToken(response.data);
                return true;
            })
            .catch(function (e) {
                console.log('Error: ', e);
                throw e;
            });
            return promise;
        };

        service.userContactUs = function (data) {
            var req = {
                method: 'POST',
                url: '/api/v1/contact-us/',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    name  : data.name,
                    body  : data.message,
                    email : data.email
                }
            };
            var promise = $http(req)
            .then(function (response) {
                return true;
            })
            .catch(function (e) {
                console.log('Error: ', e);
                throw e;
            });
            return promise;
        };

    });

})();
