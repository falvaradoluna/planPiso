var proveedorPath = 'angular/directives/proveedor/';

appModule.directive('proveedorContentHeader', function() {
    return {
        restrict: 'E',
        templateUrl: proveedorPath + 'proveedorContentHeader.html'
    };
}).directive('proveedorDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: proveedorPath + 'proveedorDetalle.html'
    };
}).directive('proveedorPendiente', function() {
    return {
        restrict: 'E',
        templateUrl: proveedorPath + 'proveedorPendiente.html'
    };
});