var apiinventarioUrl = global_settings.urlCORS + 'api/apiinventario/';
appModule.factory('inventarioFactory', function($http) {
    return {
        getInventory: function(idEmpresa, idSucursal) {
            return $http({
                url: apiinventarioUrl + 'inventory/',
                method: "GET",
                params: { idEmpresa: idEmpresa
                    , idSucursal: idSucursal },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        topNavBar: function() {
            return [
                { name: 'Empresas', url: 'empresa', isActive: false },
                { name: 'Unidades en Inventario', url: '#', isActive: true }
            ];
        },
        stepsBar: function() {
            return [
                { name: "1. Seleccionar", className: "active", panelName: "pnlSeleccionar" },
                { name: "2. Financiera", className: "", panelName: "pnlFinanciera" },
                { name: "3. Aplicar", className: "", panelName: "pnlAplicar" }
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