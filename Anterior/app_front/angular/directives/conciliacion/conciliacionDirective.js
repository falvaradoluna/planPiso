var conciliacionPath = 'angular/directives/conciliacion/';

appModule.directive('conciliacionDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: conciliacionPath + 'conciliacionDetalle.html'
    };
}).directive('conciliacionUploader', function() {
    return {
        restrict: 'E',
        templateUrl: conciliacionPath + 'conciliacionUploader.html'
    };
}).directive('conciliacionDocumentos', function() {
    return {
        restrict: 'E',
        templateUrl: conciliacionPath + 'conciliacionDocumentos.html'
    };
}).directive('conciliacionDocumentosDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: conciliacionPath + 'conciliacionDocumentosDetalle.html'
    };
});