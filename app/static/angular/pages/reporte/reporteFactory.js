var reporteUrl = global_settings.urlCORS + 'api/apireporte/';
appModule.factory('reporteFactory', function($http) {
    return {
        getReporteEmpresa: function(idEmpresa) {
            return $http({
                url: reporteUrl + 'reporteEmpresa/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa
                },
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };

});