var traspasosUrl = global_settings.urlCORS + 'api/apiTraspaso/';
appModule.factory('traspasosFactory', function($http) {
    return {
        obtieneTodos: function() {
            return $http({
                url: traspasosUrl + 'obtieneTodos/',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        obtieneDetalle: function( idTraspasoFinanciera ) {
            return $http({
                url: traspasosUrl + 'Detalle/',
                method: "GET",
                params: { idTraspasoFinanciera: idTraspasoFinanciera },
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };
});