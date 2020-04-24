appModule.factory('unuevasFactory', function($http) {
    return {
        getNewUnits: function(empresaID) {
            return $http({
                url: '/apiNewUnits/getNewUnits',
                method: "GET",
                params: { empresaID: empresaID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getNewUnitsBySucursal: function(empresaID, sucursalID) {
            return $http({
                url: '/apiNewUnits/getNewUnitsBySucursal',
                method: "GET",
                params: { empresaID: empresaID, sucursalID: sucursalID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        setUnitSchema: function(objectData) {
            return $http({
                url: '/apiNewUnits/setUnitSchema',
                method: "POST",
                data: objectData,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        topNavBar: function() {
            return [
                { name: 'Home', url: 'home', isActive: false },
                { name: 'Unidades Nuevas', url: '#', isActive: true }
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
                    text: "Se asignarán todas la unidades seleccionadas.",
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
