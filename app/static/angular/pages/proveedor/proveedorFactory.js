var proveedorUrl = global_settings.urlCORS + 'api/apiproveedor/';
appModule.factory('proveedorFactory', function($http) {
    return {
        getProviders: function(idEmpresa, idSucursal) {
            return $http({
                url: proveedorUrl + 'providers/',
                method: "GET",
                params: {
                    empresaID: idEmpresa,
                    sucursalID: idSucursal
                },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        // getLote: function(estatusCID, pro_idtipoproceso) {
        //     return $http({
        //         url: proveedorUrl + 'Lote/',
        //         method: "GET",
        //         params: { estatusCID: estatusCID, idtipoproceso: pro_idtipoproceso },
        //         headers: { 'Content-Type': 'application/json' }
        //     });
        // },
        // getLoteDetail: function(loteID) {
        //     return $http({
        //         url: proveedorUrl + 'LoteDetail/',
        //         method: "GET",
        //         params: { loteID: loteID },
        //         headers: { 'Content-Type': 'application/json' }
        //     });
        // },
        // getproveedorType: function(loteID) {
        //     return $http({
        //         url: proveedorUrl + 'proveedorType/',
        //         method: "GET",
        //         params: { loteID: loteID },
        //         headers: { 'Content-Type': 'application/json' }
        //     });
        // },
        topNavBar: function() {
            return [
                { name: 'Empresas', url: 'empresa', isActive: false },
                { name: 'Unidades en Proveedor', url: '#', isActive: true }
            ];
        },
        stepsBar: function() {
            return [
                { name: "1. Seleccionar", className: "active", panelName: "pnlSeleccionar" },
                { name: "2. Aplicar", className: "", panelName: "pnlAplicar" }
            ];
        },
        assignMesage: function(callback) {
            swal({
                    title: "¿Estas Seguro?",
                    text: "Se le generara póliza a todos los documentos seleccionados.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#21B9BB",
                    confirmButtonText: "Continuar",
                    closeOnConfirm: false
                },
                callback
            );
        }

    };

});