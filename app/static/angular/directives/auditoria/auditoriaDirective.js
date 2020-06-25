var auditoriaPath = 'angular/directives/auditoria/';

appModule.directive('auditoriaDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: auditoriaPath + 'auditoriaDetalle.html'
    };
}).directive('auditoriaDetalleUnidades', function() {
    return {
        restrict: 'E',
        templateUrl: auditoriaPath + 'auditoriaDetalleUnidades.html'
    };
}).directive('auditoriaUploader', function() {
    return {
        restrict: 'E',
        templateUrl: auditoriaPath + 'auditoriaUploader.html'
    };
}).directive('auditoriaDocumentos', function() {
    return {
        restrict: 'E',
        templateUrl: auditoriaPath + 'auditoriaDocumentos.html'
    };
}).directive('auditoriaDocumentosDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: auditoriaPath + 'auditoriaDocumentosDetalle.html'
    };
}).directive('compraVirtualAplicar', function() {
    return {
        restrict: 'E',
        templateUrl: auditoriaPath + 'compraVirtualAplicar.html'
    };
}).directive('compraVirtualContentHeader', function() {
    return {
        restrict: 'E',
        templateUrl: auditoriaPath + 'compraVirtualContentHeader.html'
    };
}).directive('compraVirtualDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: auditoriaPath + 'compraVirtualDetalle.html'
    };
}).directive('compraVirtual', function() {
        return {
            restrict: 'E',
            templateUrl: auditoriaPath + 'compraVirtual.html'
        };
    });