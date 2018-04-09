appModule.factory('interesFactory', function($http) {

    return {
        getInterestUnits: function(empresaID, sucursalID, financieraID) {
            return $http({
                url: '/apiInteres/getInterestUnits',
                method: "GET",
                params: { empresaID: empresaID, sucursalID: sucursalID, financieraID: financieraID },
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
        },
        setChangeSchema: function(params) {
            return $http({
                url: '/apiInteres/setChangeSchema',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getSchemaMovements: function(params) {
            return $http({
                url: '/apiInteres/getSchemaMovements',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getGuardaProvision: function(params) {
            return $http({
                url: '/apiInteres/guardaProvision',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getProcesaProvision: function(params) {
            return $http({
                url: '/apiInteres/procesaProvision',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getProvisionToday: function(params) {
            return $http({
                url: '/apiInteres/getProvisionToday',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insPago: function(params) {
            return $http({
                url: '/apiInteres/insPago',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        validaPago: function(params) {
            return $http({
                url: '/apiInteres/validaPago',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        }


    };
});