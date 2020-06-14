var fechaPromesaUrl = global_settings.urlCORS + 'api/apifechapromesa/';
appModule.factory('fechaPromesaFactory', function($http) {
    return {
        getCartera: function(idEmpresa, idPersona, tipoCartera) {
            return $http({
                url: fechaPromesaUrl + 'cartera/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idPersona: idPersona,
                    tipoCartera: tipoCartera
                },
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };
});