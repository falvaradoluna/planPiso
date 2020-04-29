var crealotePath = 'angular/directives/crealote/';

appModule.directive('crealoteDetalle', function() {
    return {
        restrict: 'E',
        templateUrl: crealotePath + 'crealoteDetalle.html'
    };
}).directive('crealoteHome', function() {
    return {
        restrict: 'E',
        templateUrl: crealotePath + 'crealoteHome.html'
    };
});