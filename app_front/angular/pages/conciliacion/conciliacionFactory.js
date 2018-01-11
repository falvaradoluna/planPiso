appModule.factory('conciliacionFactory', function($http) {
    return {
        readLayout: function(LayoutName) {
            return $http({
                url: 'apiConciliacion/readLayout',
                method: "GET",
                params: { LayoutName: LayoutName },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insExcelData: function(lstUnidades) {
            return $http({
                url: 'apiConciliacion/insExcelData',
                method: "GET",
                params: { lstUnidades: lstUnidades },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getConciliacion: function(financieraID) {
            return $http({
                url: 'apiConciliacion/getConciliacion',
                method: "GET",
                params: { financieraID: financieraID },
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };

});