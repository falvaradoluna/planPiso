var detalleInteresPath = 'angular/directives/pagoInteres/';

appModule.directive('modalPagoInteres', function() {
    return {
        restrict: 'E',
        templateUrl: detalleInteresPath + 'modalDetalleInteres.html'
    };
});