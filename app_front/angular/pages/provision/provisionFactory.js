appModule.factory('provisionFactory', function($http) {
    return {
        getLote: function(estatusCID, pro_idtipoproceso) {
            return $http({
                url: 'apiProvision/getLote',
                method: "GET",
                params: { estatusCID: estatusCID, idtipoproceso: pro_idtipoproceso },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getLoteDetail: function(loteID) {
            return $http({
                url: 'apiProvision/getLoteDetail',
                method: "GET",
                params: { loteID: loteID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getProvisionType: function(loteID) {
            return $http({
                url: 'apiProvision/getProvisionType',
                method: "GET",
                params: { loteID: loteID },
                headers: { 'Content-Type': 'application/json' }
            });
        }

    };

});