appModule.controller('unuevasController', function($scope, $rootScope, $location, unuevasFactory, commonFactory, staticFactory) {
    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.idUsuario = localStorage.getItem("idUsuario");

    $scope.currentEmpresa = sessionFactory.nombre;
    $scope.topBarNav = unuevasFactory.topNavBar();
    $scope.steps = unuevasFactory.stepsBar();
    $scope.totalUnidades = 0;
    $scope.currentStep = 0;
    $scope.userID = 875;
    $scope.currentPanel = $scope.steps[0].panelName;
    $scope.lstSucursal = [];
    $scope.lstNewUnits = [];
    $scope.lstFinancial = [];
    $scope.lstSchemas = [];
    $scope.selectedSchema = [];
    $scope.currentSucursalName = "Sucursal Todas";
    $scope.currentFinancialName = "Seleccionar Financiera";

    $scope.allUnits = { isChecked: false };
    $scope.ddlFinancialShow = false;


    $('#mdlLoading').modal('show');

    commonFactory.getFinancial().then(function(result) {
        $scope.lstFinancial = result.data;
    });

    commonFactory.getSucursal(sessionFactory.empresaID, $scope.idUsuario).then(function(result) {
        $scope.lstSucursal = result.data;
    });

    unuevasFactory.getNewUnits(sessionFactory.empresaID).then(function(result) {
        $scope.lstNewUnits = result.data;
        $('#mdlLoading').modal('hide');
    });

    $scope.setCurrentSucursal = function(sucursalObj) {
        $scope.totalUnidades = 0;
        $scope.currentSucursalName = sucursalObj.nombreSucursal;
        $scope.getNewUnitsBySucursal(sessionFactory.empresaID, sucursalObj.sucursalID);
    };

    $scope.getNewUnitsBySucursal = function(emresaID, sucursalID) {
        $('#tblUnidadesNuevas').DataTable().destroy();
        $('#mdlLoading').modal('show');
        unuevasFactory.getNewUnitsBySucursal(emresaID, sucursalID).then(function(result) {
            $scope.lstNewUnits = result.data;
            $('#mdlLoading').modal('hide');
        });
    };

    $scope.setCurrentFinancial = function(financialObj) {
        $scope.currentFinancialName = financialObj.nombre;
        $scope.getSchemas(financialObj.financieraID);
    };

    $scope.getSchemas = function(financieraID) {
        commonFactory.getSchemas(financieraID).then(function(result) {
            $('#tblSchemas').DataTable().destroy();
            $scope.lstSchemas = result.data;
        });
    };

    $scope.checkAllUnits = function() {

        for (var i = 0; i < $scope.lstNewUnits.length; i++) {
            $scope.lstNewUnits[i].isChecked = $scope.allUnits.isChecked;
        }

    };

    $scope.uncheckSchemas = function(itemSchemas) {
        for (var i = 0; i < $scope.lstSchemas.length; i++) {
            $scope.lstSchemas[i].isChecked = false;
        }
        itemSchemas.isChecked = true;
        $scope.selectedSchema = itemSchemas;
    };


    $scope.nextStep = function() {
        if ($scope.currentStep === 1 && $scope.selectedSchema.esquemaID === undefined) {
            swal("Aviso", "No ha seleccionado un esquema", "warning");
            return;
        } else if (($scope.currentStep + 1) < $scope.steps.length) {
            $scope.steps[$scope.currentStep].className = "visited";
            $scope.currentStep++;
            $scope.currentPanel = $scope.steps[$scope.currentStep].panelName;
            $scope.steps[$scope.currentStep].className = "active";
            $scope.showFilterButtons($scope.currentStep);
        }
    };

    $scope.prevStep = function() {
        if (($scope.currentStep - 1) >= 0) {
            $scope.steps[$scope.currentStep].className = "visited";
            $scope.currentStep--;
            $scope.currentPanel = $scope.steps[$scope.currentStep].panelName;
            $scope.steps[$scope.currentStep].className = "active";
            $scope.showFilterButtons($scope.currentStep);
        }
    };

    $scope.initTblUnidadesNuevas = function() {
        $scope.setTableStyle('#tblUnidadesNuevas');
        $scope.totalUnidades = $scope.lstNewUnits.length;
        $scope.setCalendarStyle();
    };

    $scope.setTableStyle = function(tableID) {
        staticFactory.setTableStyleOne(tableID);
    };


    $scope.setCalendarStyle = function() {
        staticFactory.setCalendarStyle();
    };


    $scope.showFilterButtons = function(step) {
        if (step === 0)
            $scope.ddlFinancialShow = false;
        else
            $scope.ddlFinancialShow = true;
    };

    $scope.showMsg = function() {
        unuevasFactory.assignMesage($scope.setSchema);
    };

    $scope.setSchema = function() {



        $scope.lstNewUnits.forEach(function(item) {
            if (item.isChecked === true) {
                var data = {
                    CCP_IDDOCTO: item.CCP_IDDOCTO,
                    userID: $scope.userID,
                    esquemaID: $scope.selectedSchema.esquemaID,
                    saldoInicial: item.SALDO,
                    fechaCalculo: staticFactory.toISODate(item.fechaCalculoString)
                };

                unuevasFactory.setUnitSchema(data);
            }
        });

        //aplicar la funcion paso a paso
        $scope.success();

    };

    $scope.success = function() {
        swal("Ok", "Asignación finalizó con exito", "success");
        setTimeout(function() {
            window.location = "/unuevas";
        }, 5000);
    };


});