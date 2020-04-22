var pagoInteresUrl = global_settings.urlCORS + 'api/apiPagoInteres/';
appModule.factory('pagoFactory', function($http) {
    return {
        getLote: function(estatusCID, pro_idtipoproceso) {
            return $http({
                url: pagoInteresUrl + 'Lote/',
                method: "GET",
                params: { estatusCID: estatusCID, idtipoproceso: pro_idtipoproceso },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getLoteDetail: function(loteID) {
            return $http({
                url: pagoInteresUrl + 'LoteDetail/',
                method: "GET",
                params: { loteID: loteID },
                headers: { 'Content-Type': 'application/json' }
            });
        }

    };

});