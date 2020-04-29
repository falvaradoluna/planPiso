var crealoteUrl = global_settings.urlCORS + 'api/apicrealote/';
appModule.factory('crealoteFactory', function($http) {
    return {
        obtieneTodos: function() {
            return $http({
                url: crealoteUrl + 'obtieneTodos/',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        obtieneDetalle: function( idcrealoteFinanciera ) {
            return $http({
                url: crealoteUrl + 'Detalle/',
                method: "GET",
                params: { idcrealoteFinanciera: idcrealoteFinanciera },
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };
});