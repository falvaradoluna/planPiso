appModule.factory('dashboardFactory', function($http) {
    return {
        getDashboard: function(empresaID) {
            return $http({
                url: 'apiDashboard/getDashboard',
                method: "GET",
                params: { empresaID: empresaID },
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };

});