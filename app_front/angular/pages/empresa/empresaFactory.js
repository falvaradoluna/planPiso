appModule.factory('empresaFactory', function($http) {
    return {        
        getEmpresa: function() {
            return $http({
                url: 'apiEmpresa/getEmpresa',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };

});
