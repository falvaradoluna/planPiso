var provisionUrl = global_settings.urlCORS + 'api/apiProvision/';
appModule.factory('provisionFactory', function($http) {
    return {
        getLote: function(estatusCID, pro_idtipoproceso) {
            return $http({
                url: provisionUrl + 'Lote/',
                method: "GET",
                params: { estatusCID: estatusCID, idtipoproceso: pro_idtipoproceso },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getLoteDetail: function(loteID) {
            return $http({
                url: provisionUrl + 'LoteDetail/',
                method: "GET",
                params: { loteID: loteID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getProvisionType: function(loteID) {
            return $http({
                url: provisionUrl + 'ProvisionType/',
                method: "GET",
                params: { loteID: loteID },
                headers: { 'Content-Type': 'application/json' }
            });
        }

    };

});