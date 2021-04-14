var pagoInteresUrl = global_settings.urlCORS + 'api/apiPagoInteres/';
appModule.factory('pagoInteresFactory', function($http) {
    return {
        getreadFile: function() {
            return $http({
                url: pagoInteresUrl + 'readFile/',
                method: "GET",
                params: {},
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getDocumentosPagos: function(idEmpresa) {
            return $http({
                url: pagoInteresUrl + 'documentosPagos/',
                method: "GET",
                params: { idEmpresa: idEmpresa },
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };

});