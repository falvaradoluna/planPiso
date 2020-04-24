var provisionPath = 'angular/directives/provision/';

appModule.directive('provisionContentHeader', function() {
    return {
        restrict: 'E',
        templateUrl: provisionPath + 'provisionContentHeader.html'
    };
}).directive('provisionDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: provisionPath + 'provisionDetalle.html'
    };
}).directive('provisionPendiente', function() {
    return {
        restrict: 'E',
        templateUrl: provisionPath + 'provisionPendiente.html'
    };
});