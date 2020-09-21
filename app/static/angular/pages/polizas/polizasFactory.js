var polizasUrl = global_settings.urlCORS + 'api/apipolizas/';
appModule.factory('polizasFactory', function($http) {
    return {
        getLote: function(estatusCID, pro_idtipoproceso) {
            return $http({
                url: polizasUrl + 'Lote/',
                method: "GET",
                params: { estatusCID: estatusCID, idtipoproceso: pro_idtipoproceso },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getLoteDetail: function(loteID) {
            return $http({
                url: polizasUrl + 'LoteDetail/',
                method: "GET",
                params: { loteID: loteID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        pruebaReporte: function(idUsuario) {
            return $http({
                url: global_settings.urlCORS + 'api/apiNotificaciones/reporteReduccion/',
                method: "GET",
                params: { idUsuario: idUsuario },
                headers: { 'Content-Type': 'application/json' },
                responseType: 'arraybuffer'
            });
        }

    };

});