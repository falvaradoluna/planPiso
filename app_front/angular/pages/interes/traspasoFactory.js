appModule.factory('traspasoFactory', function($http) {
    return {
        setChangeSchema: function(params) {
            return $http({
                url: '/apiTraspaso/setChangeSchema',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };
});