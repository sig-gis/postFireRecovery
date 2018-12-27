(function() {

    'use strict';

    angular.module('postfirerecovery')
    .directive('equal', [
        // modified from https://bit.ly/2Lo9Skm
        function () {
        
            var link = function($scope, $element, $attrs, ctrl) {
            
                var validate = function(viewValue) {
                    var comparisonModel = $attrs.equal;

                    if (!viewValue && !comparisonModel) {
                        ctrl.$setValidity('equal', true);
                    } else {
                        ctrl.$setValidity('equal', viewValue === comparisonModel );
                    }
                    return viewValue;
                };
                
                ctrl.$parsers.unshift(validate);
                ctrl.$formatters.push(validate);
                
                $attrs.$observe('equal', function(comparisonModel){
                    return validate(ctrl.$viewValue);
                });
            
            };
        
            return {
                require: 'ngModel',
                link: link
            };
        }
    ]);
})();