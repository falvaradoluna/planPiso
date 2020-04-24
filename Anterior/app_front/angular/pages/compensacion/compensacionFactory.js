appModule.factory('compensacionFactory', function($http) {
    return {
        getLote: function(estatusCID, pro_idtipoproceso) {
            return $http({
                url: 'apiCompensacion/getLote',
                method: "GET",
                params: { estatusCID: estatusCID, idtipoproceso: pro_idtipoproceso },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getLoteDetail: function(loteID) {
            return $http({
                url: 'apiCompensacion/getLoteDetail',
                method: "GET",
                params: { loteID: loteID },
                headers: { 'Content-Type': 'application/json' }
            });
        }

    };

});