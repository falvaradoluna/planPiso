appModule.factory('empresaFactory', function($http) {
    return {        
        getEmpresa: function( idUsuario ) {
            return $http({
                url: 'apiEmpresa/getEmpresa',
                method: "GET",
                params:{
                	idUsuario: idUsuario
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getUsuarioNombre: function( idUsuario ) {
            return $http({
                url: 'apiEmpresa/getUsuarioNombre',
                method: "GET",
                params:{
                	idUsuario: idUsuario
                },
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };

});
