var pagoInteresPath = 'angular/directives/pagoInteres/';

appModule.directive('pagoInteresAplicado', function() {
    return {
        restrict: 'E',
        templateUrl: pagoInteresPath + 'pagoInteresAplicado.html'
    };
}).directive('pagoInteresContentHeader', function() {
    return {
        restrict: 'E',
        templateUrl: pagoInteresPath + 'pagoInteresContentHeader.html'
    };
}).directive('pagoInteresDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: pagoInteresPath + 'pagoInteresDetalle.html'
    };
}).directive('pagoInteresPendiente', function() {
    return {
        restrict: 'E',
        templateUrl: pagoInteresPath + 'pagoInteresPendiente.html'
    };
});