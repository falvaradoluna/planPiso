var proveedorUrl = global_settings.urlCORS + 'api/apiproveedor/';
appModule.factory('proveedorFactory', function($http) {
    return {
        getLote: function(estatusCID, pro_idtipoproceso) {
            return $http({
                url: proveedorUrl + 'Lote/',
                method: "GET",
                params: { estatusCID: estatusCID, idtipoproceso: pro_idtipoproceso },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getLoteDetail: function(loteID) {
            return $http({
                url: proveedorUrl + 'LoteDetail/',
                method: "GET",
                params: { loteID: loteID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getproveedorType: function(loteID) {
            return $http({
                url: proveedorUrl + 'proveedorType/',
                method: "GET",
                params: { loteID: loteID },
                headers: { 'Content-Type': 'application/json' }
            });
        }

    };

});