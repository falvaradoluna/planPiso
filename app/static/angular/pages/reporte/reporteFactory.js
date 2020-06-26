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
        },
        jsReporte: function(json) {
            return $http({
                url: 'http://192.168.20.89:5488/api/report',
                //  url: 'http://192.168.100.7:5488/api/report',
                // url: 'http://localhost:5488/api/report',
                method: "POST",
                data: {
                    template: { name: "reportePlanPiso" },
                    data: json
                },
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            });
        }
    };

});