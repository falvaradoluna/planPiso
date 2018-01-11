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
});