appModule.factory('traspasosFactory', function($http) {
    return {
        obtieneTodos: function() {
            return $http({
                url: 'apiTraspaso/obtieneTodos',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        obtieneDetalle: function( idTraspasoFinanciera ) {
            return $http({
                url: 'apiTraspaso/getDetalle',
                method: "GET",
                params: { idTraspasoFinanciera: idTraspasoFinanciera },
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };
});