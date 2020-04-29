appModule.controller('inventarioController', function($scope, $rootScope, $location, commonFactory, staticFactory, inventarioFactory) {

    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.idUsuario = localStorage.getItem("idUsuario");

    $scope.currentSucursalName = "Sucursal Todas";
    $scope.currentEmpresa = sessionFactory.nombre;
    $scope.topBarNav = inventarioFactory.topNavBar();
    $scope.steps = inventarioFactory.stepsBar();

    $scope.currentStep = 0;
    $scope.showStep = 1;
    // $scope.topBarNav = staticFactory.proveedorBar();
    // $scope.lstPayTypes = [];
    // $scope.lstUnitsPending = [];
    // $scope.lstUnitsApply = [];
    // $scope.lstUnitDeatil = [];
    // $scope.objEdit = { visible: false };
    // $scope.currentPanel = 'pnlPendientes';
    // $scope.currentPayName = 'Todos';
    // $scope.showDropDown = true;
    $('#mdlLoading').modal('show');

    commonFactory.getSucursal(sessionFactory.empresaID, $scope.idUsuario).then(function(result) {
        $scope.lstSucursal = result.data;
    });
    inventarioFactory.getInventory(sessionFactory.empresaID).then(function(result) {
        $scope.lstNewUnits = result.data;
        $scope.initTblProviders();
        $('#mdlLoading').modal('hide');
    });
    $scope.initTblProviders = function() {
        $scope.setTableStyle('#tblUnidadesInventario');
        $scope.totalUnidades = $scope.lstNewUnits.length;
        $scope.setCalendarStyle();
    };
    $scope.setTableStyle = function(tableID) {
        staticFactory.setTableStyleOne(tableID);
    };
    $scope.setCalendarStyle = function() {
        staticFactory.setCalendarStyle();
    };
    $scope.checkAllUnits = function() {

        for (var i = 0; i < $scope.lstNewUnits.length; i++) {
            $scope.lstNewUnits[i].isChecked = $scope.allUnits.isChecked;
        }

    };

    $scope.nextStep = function() {
        var contador = 0;
        angular.forEach($scope.lstNewUnits, function(value, key) {
            if (value.isChecked === true) {
                contador++;
            }
        });
        if ($scope.currentStep === 0 && contador === 0) {
            swal("Aviso", "No ha seleccionado ningun documento", "warning");
            return;
        } else if (($scope.currentStep + 1) < $scope.steps.length) {
            $scope.steps[$scope.currentStep].className = "visited";
            $scope.currentStep++;
            $scope.showStep = $scope.currentStep + 1;
            $scope.currentPanel = $scope.steps[$scope.currentStep].panelName;
            $scope.steps[$scope.currentStep].className = "active";
            $scope.showFilterButtons($scope.currentStep);
        }
    };

    $scope.prevStep = function() {
        if (($scope.currentStep - 1) >= 0) {
            $scope.steps[$scope.currentStep].className = "visited";
            $scope.showStep = $scope.currentStep;
            $scope.currentStep--;
            $scope.currentPanel = $scope.steps[$scope.currentStep].panelName;
            $scope.steps[$scope.currentStep].className = "active";
            $scope.showFilterButtons($scope.currentStep);
        }
    };
    $scope.showFilterButtons = function(step) {
        if (step === 0)
            $scope.ddlFinancialShow = false;
        else
            $scope.ddlFinancialShow = true;
    };
    $scope.showMsg = function() {
        inventarioFactory.assignMesage($scope.setSchema);
    };



});