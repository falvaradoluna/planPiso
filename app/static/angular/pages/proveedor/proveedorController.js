appModule.controller('proveedorController', function($scope, $rootScope, $location, commonFactory, staticFactory, proveedorFactory) {

    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.idUsuario = localStorage.getItem("idUsuario");

    $scope.currentSucursalName = "Sucursal Todas";
    $scope.currentEmpresa = sessionFactory.nombre;
    $scope.topBarNav = proveedorFactory.topNavBar();
    $scope.steps = proveedorFactory.stepsBar();

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
    proveedorFactory.getProviders(sessionFactory.empresaID).then(function(result) {
        $scope.lstNewUnits = result.data;
        $scope.initTblProviders();
        $('#mdlLoading').modal('hide');
    });
    $scope.initTblProviders = function() {
        $scope.setTableStyle('#tblUnidadesProveedores');
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
        proveedorFactory.assignMesage($scope.setSchema);
    };
    // proveedorFactory.getLote(0, '1,3').then(function(result) {
    //     $scope.lstUnitsPending = result.data;
    // });

    // proveedorFactory.getLote(1, '1,3').then(function(result) {
    //     $scope.lstUnitsApply = result.data;
    // });


    // proveedorFactory.getproveedorType().then(function(result) {
    //     $scope.lstPayTypes = result.data;
    // });



    // $scope.setCurrentpay = function(id) {

    //     $scope.currentPayName = id.pro_nombre;
    //     $scope.currentPanel = 'pnlPendientes';
    //     proveedorFactory.getLote(id.pro_idtipoproceso).then(function(result) {
    //         $scope.lstUnitsPending = result.data;
    //     });

    // };



    // $scope.prevStep = function() {

    //     $scope.currentPanel = 'pnlPendientes';
    //     $scope.showDropDown = true;
    // };

    // $scope.setTableStyle = function(tableID) {
    //     staticFactory.setTableStyleOne(tableID);
    // };

    // $scope.showDetail = function(lote) {

    //     $scope.showDropDown = false;

    //     if (lote.estatusCID == 0) {
    //         $scope.objEdit.visible = true;
    //     } else {
    //         $scope.objEdit.visible = false;
    //     }

    //     $scope.currentPanel = 'pnlDetalle';
    //     proveedorFactory.getLoteDetail(lote.ple_idplanpiso).then(function(result) {
    //         $scope.lstUnitDeatil = result.data;
    //     });
    // };



});