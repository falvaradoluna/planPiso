var traspasosPath = 'angular/directives/traspasos/';

appModule.directive('traspasosDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: traspasosPath + 'traspasosDetalle.html'
    };
}).directive('traspasosHome', function() {
    return {
        restrict: 'E',
        templateUrl: traspasosPath + 'traspasosHome.html'
    };
});