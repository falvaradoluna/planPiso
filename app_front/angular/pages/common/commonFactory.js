appModule.factory('commonFactory', function($http) {
    return {
        getSucursal: function(idEmpresa, idUsuario) {
            return $http({
                url: 'apiCommon/getSucursal',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idUsuario: idUsuario
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getFinancial: function() {
            return $http({
                url: 'apiCommon/getFinancieras',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getSchemas: function(financieraID, esquemaID) {
            return $http({
                url: 'apiCommon/getSchemas',
                method: "GET",
                params: { financieraID: financieraID, esquemaID: esquemaID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getCatalog: function(catalogoID) {
            return $http({
                url: 'apiCommon/getCatalog',
                method: "GET",
                params: { catalogoID: catalogoID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getTipoTiie: function() {
            return $http({
                url: 'apiCommon/getTipoTiie',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        currentTIIE: function() {
            return $http({
                url: 'apiCommon/currentTIIE',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        }

    };

});