var polizasPath = 'angular/directives/polizas/';

appModule.directive('polizasAplicado', function() {
    return {
        restrict: 'E',
        templateUrl: polizasPath + 'polizasAplicado.html'
    };
}).directive('polizasContentHeader', function() {
    return {
        restrict: 'E',
        templateUrl: polizasPath + 'polizasContentHeader.html'
    };
}).directive('polizasDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: polizasPath + 'polizasDetalle.html'
    };
}).directive('polizasPendiente', function() {
    return {
        restrict: 'E',
        templateUrl: polizasPath + 'polizasPendiente.html'
    };
});