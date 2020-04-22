var compensacionPath = 'angular/directives/compensacion/';

appModule.directive('compensacionContentHeader', function() {
    return {
        restrict: 'E',
        templateUrl: compensacionPath + 'compensacionContentHeader.html'
    };
}).directive('compensacionDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: compensacionPath + 'compensacionDetalle.html'
    };
}).directive('compensacionPendiente', function() {
    return {
        restrict: 'E',
        templateUrl: compensacionPath + 'compensacionPendiente.html'
    };
});