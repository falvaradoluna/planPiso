var autorizaPathPoliza = 'angular/directives/poliza/';

appModule.directive('polizaUploader', function() {
    return {
        restrict: 'E',
        templateUrl: autorizaPathPoliza + 'polizaUploader.html'
    };
});