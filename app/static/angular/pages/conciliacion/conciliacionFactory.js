
var conciliacionUrl = global_settings.urlCORS + 'api/apiConciliacion/';
appModule.factory('conciliacionFactory', function($http) {
    return {
        readLayout: function(LayoutName) {
            return $http({
                url: conciliacionUrl + 'readLayout/',
                method: "GET",
                params: { LayoutName: LayoutName },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        insExcelData: function(lstUnidades) {
            return $http({
                url: conciliacionUrl + 'insExcelData/',
                method: "GET",
                params: { lstUnidades: lstUnidades },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getConciliacion: function( periodo, consecutivo, financiera ) {
            return $http({
                url: conciliacionUrl + 'Conciliacion/',
                method: "GET",
                params: { 
                    periodo: periodo, 
                    consecutivo: consecutivo,
                    financiera: financiera
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getCierreMes: function( periodo ) {
            return $http({
                url: conciliacionUrl + 'CierreMes/',
                method: "GET",
                params: { periodo: periodo },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        creaConciliacion: function( parametros ) {
            return $http({
                url: conciliacionUrl + 'creaConciliacion/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        validaExistencia: function( parametros ) {
            return $http({
                url: conciliacionUrl + 'validaExistencia/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        creaConciliacionDetalle: function( parametros ) {
            return $http({
                url: conciliacionUrl + 'creaConciliacionDetalle/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        solicitaAutorizacion: function( parametros ) {
            return $http({
                url: conciliacionUrl + 'solicitaAutorizacion/',
                method: "GET",
                params: parametros,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        porAutorizar: function() {
            return $http({
                url: conciliacionUrl + 'porAutorizar/',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        autorizacionDetalle: function( consecutivo ) {
            return $http({
                url: conciliacionUrl + 'AutorizacionDetalle/',
                method: "GET",
                params:{ consecutivo: consecutivo },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        generaConciliacion: function( periodo, anio, financiera ) {
            return $http({
                url: conciliacionUrl + 'generaConciliacion/',
                method: "GET",
                params:{ 
                    periodo: periodo,
                    anio: anio,
                    financiera: financiera
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        obtieneCociliacion: function() {
            return $http({
                url: conciliacionUrl + 'obtieneConciliacion/',
                method: "GET",
                params:{},
                headers: { 'Content-Type': 'application/json' }
            });
        },
        conciliaDetalle: function( idConciliacion ) {
            return $http({
                url: conciliacionUrl + 'conciliaDetalle/',
                method: "GET",
                params:{ idConciliacion: idConciliacion },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        validaCancelacion: function( idConciliacion ) {
            return $http({
                url: conciliacionUrl + 'validaCancelacion/',
                method: "GET",
                params:{ idConciliacion: idConciliacion },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        CancelaConciliacion: function( idConciliacion ) {
            return $http({
                url: conciliacionUrl + 'CancelaConciliacion/',
                method: "GET",
                params:{ idConciliacion: idConciliacion },
                headers: { 'Content-Type': 'application/json' }
            });
        }        
    };
});