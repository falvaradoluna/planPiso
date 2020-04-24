var apiCompensacionUrl = global_settings.urlCORS + 'api/apiCompensacion/';
appModule.factory('compensacionFactory', function($http) {
    return {
        getLote: function(estatusCID, pro_idtipoproceso) {
            return $http({
                url: apiCompensacionUrl + 'Lote/',
                method: "GET",
                params: { estatusCID: estatusCID, idtipoproceso: pro_idtipoproceso },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getLoteDetail: function(loteID) {
            return $http({
                url: apiCompensacionUrl + 'LoteDetail/',
                method: "GET",
                params: { loteID: loteID },
                headers: { 'Content-Type': 'application/json' }
            });
        }

    };

});