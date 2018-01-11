appModule.factory('pagoFactory', function($http) {
    return {
        getLote: function(estatusCID) {
            return $http({
                url: 'apiPagoInteres/getLote',
                method: "GET",
                params: { estatusCID: estatusCID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getLoteDetail: function(loteID) {
            return $http({
                url: 'apiPagoInteres/getLoteDetail',
                method: "GET",
                params: { loteID: loteID },
                headers: { 'Content-Type': 'application/json' }
            });
        }

    };

});