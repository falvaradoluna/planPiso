var autorizaPath = 'angular/directives/poliza/';

appModule.directive('polizaUploader', function() {
    return {
        restrict: 'E',
        templateUrl: autorizaPath + 'polizaUploader.html'
    };
});