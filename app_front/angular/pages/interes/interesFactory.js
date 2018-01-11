appModule.factory('interesFactory', function($http) {

    return {
        getInterestUnits: function(empresaID, sucursalID) {
            return $http({
                url: '/apiInteres/getInterestUnits',
                method: "GET",
                params: { empresaID: empresaID, sucursalID: sucursalID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getDetailUnits: function(unidadID) {
            return $http({
                url: '/apiInteres/getDetailUnits',
                method: "GET",
                params: { unidadID: unidadID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insLotePago: function() {
            return $http({
                url: '/apiInteres/insLotePago',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insLotePagoDetalle: function(params) {
            return $http({
                url: '/apiInteres/insLotePagoDetalle',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        }

    };
});