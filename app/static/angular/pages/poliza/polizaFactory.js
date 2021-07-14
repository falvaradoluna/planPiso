
var auditoriaUrl = global_settings.urlCORS + 'api/apiPoliza/';
appModule.factory('polizaFactory', function($http) {
    return {
        
        topNavBar: function() {
            return [
                { name: 'Empresas', url: 'empresa', isActive: false },
                { name: 'Polizas', url: '#', isActive: true }
            ];
        },
       

        obtienePeriodosActivos: function(parametros) {
            return $http({
                url: auditoriaUrl + 'obtienePeriodosActivos/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        CancelaPoliza: function(parametros) {
            return $http({
                url: auditoriaUrl + 'CancelaPoliza/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
    };
});