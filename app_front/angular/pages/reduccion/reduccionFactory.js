appModule.factory('reduccionFactory', function($http) {
    return true;
    // return {
    //     getTiie: function() {
    //         return $http({
    //             url: 'apiTiie/getTiie',
    //             method: "GET",
    //             headers: { 'Content-Type': 'application/json' }
    //         });
    //     },
    //     insertTiie: function(params) {
    //         return $http({
    //             url: 'apiTiie/insertTiie',
    //             method: "GET",
    //             params: params,
    //             headers: { 'Content-Type': 'application/json' }
    //         });
    //     },
    //     actualizaTiie: function(params) {
    //         return $http({
    //             url: 'apiTiie/actualizaTiie',
    //             method: "GET",
    //             params: params,
    //             headers: { 'Content-Type': 'application/json' }
    //         });
    //     },
    //     getTiieDateExist: function(fecha) {
    //         return $http({
    //             url: 'apiTiie/getTiieDateExist',
    //             method: "GET",
    //             params: { fecha: fecha },
    //             headers: { 'Content-Type': 'application/json' }
    //         });
    //     }
    // };

});