var apiNewUnitsUrl = global_settings.urlCORS + 'api/apiNewUnits/';
appModule.factory('unuevasFactory', function($http) {
    return {
        getNewUnits: function(empresaID) {
            return $http({
                url: apiNewUnitsUrl + 'NewUnits/',
                method: "GET",
                params: { empresaID: empresaID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        getNewUnitsBySucursal: function(empresaID, sucursalID,financieraID) {
            return $http({
                url: apiNewUnitsUrl + 'NewUnitsBySucursal/',
                method: "GET",
                params: { empresaID: empresaID, sucursalID: sucursalID,financieraID:financieraID },
                headers: { 'Content-Type': 'application/json' }
            });
        },
        setUnitSchema: function(objectData) {
            return $http({
                url: apiNewUnitsUrl + 'setUnitSchema/',
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
                { name: "2. Esquema", className: "", panelName: "pnlFinanciera" },
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
