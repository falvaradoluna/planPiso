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
        },
        guardaIdIntereses: function() {
            return $http({
                url: pagoInteresUrl + 'guardaIdIntereses/',
                method: "POST",
                params: {},
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insInteres: function(data) {
            return $http({
                url: pagoInteresUrl + 'insInteres/',
                method: "POST",
                data: data,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        updInteresLote: function(idLote, idPagoInteres) {
            return $http({
                url: pagoInteresUrl + 'updInteresLote/',
                method: "POST",
                data: {
                    idLote: idLote,
                    idPagoInteres: idPagoInteres
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        polizaInteres: function(idPagoInteres, idUsuario, idProveedor) {
            return $http({
                url: pagoInteresUrl + 'polizaInteres/',
                method: "POST",
                data: {
                    idPagoInteres: idPagoInteres,
                    idUsuario: idUsuario,
                    idProveedor: idProveedor
                },
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };

});