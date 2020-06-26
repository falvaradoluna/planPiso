var apisacarunidadUrl = global_settings.urlCORS + 'api/apisacarunidad/';
appModule.factory('sacarunidadFactory', function($http) {
    return {
        getDocumentos: function(idEmpresa) {
            return $http({
                url: apisacarunidadUrl + 'documentos/',
                method: "GET",
                params: { idEmpresa: idEmpresa },
                headers: { 'Content-Type': 'application/json' }
            });
        }

    };

});