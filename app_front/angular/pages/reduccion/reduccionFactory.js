appModule.factory('reduccionFactory', function($http) {
    // return true;
    return {
        getEsquema: function( idEmpresa ) {
            return $http({
                url: 'apiReduccion/getEsquemaExpiration',
                method: "GET",
                params: { 
                    idEmpresa: idEmpresa
                },
                headers: { 'Content-Type': 'application/json' }
            });
        }

    };
});