var interesesUrl = global_settings.urlCORS + 'api/apiInteres/';
appModule.factory('interesFactory', function($http) {

    return {
        getInterestUnits: function(empresaID, sucursalID, financieraID) {
            return $http({
                url: interesesUrl + 'InterestUnits/',
                method: "GET",
                params: { empresaID: empresaID, sucursalID: sucursalID, financieraID: financieraID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getDetailUnits: function(unidadID) {
            return $http({
                url: interesesUrl + 'DetailUnits/',
                method: "GET",
                params: { unidadID: unidadID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insLotePago: function() {
            return $http({
                url: interesesUrl + 'insLotePago/',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insLotePagoDetalle: function(params) {
            return $http({
                url: interesesUrl + 'insLotePagoDetalle/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getSchemaMovements: function(params) {
            return $http({
                url: interesesUrl + 'SchemaMovements/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getGuardaProvision: function(params) {
            return $http({
                url: interesesUrl + 'guardaProvision/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getProcesaProvision: function(params) {
            return $http({
                url: interesesUrl + 'procesaProvision/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getProvisionToday: function(params) {
            return $http({
                url: interesesUrl + 'ProvisionToday/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insPago: function(params) {
            return $http({
                url: interesesUrl + 'insPago/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insCompensacion: function(params) {
            return $http({
                url: interesesUrl + 'insCompensacion/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        validaPago: function(params) {
            return $http({
                url: interesesUrl + 'validaPago/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        GetCompensacion: function(params) {
            return $http({
                url: interesesUrl + 'Compensacion/',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        }


    };
});