appModule.controller('proveedorController', function($scope, $rootScope, $location, commonFactory, staticFactory, proveedorFactory) {

    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));

    $scope.topBarNav = staticFactory.proveedorBar();
    $scope.lstPayTypes = [];
    $scope.lstUnitsPending = [];
    $scope.lstUnitsApply = [];
    $scope.lstUnitDeatil = [];
    $scope.objEdit = { visible: false };
    $scope.currentPanel = 'pnlPendientes';
    $scope.currentPayName = 'Todos';
    $scope.showDropDown = true;



    proveedorFactory.getLote(0, '1,3').then(function(result) {
        $scope.lstUnitsPending = result.data;
    });

    proveedorFactory.getLote(1, '1,3').then(function(result) {
        $scope.lstUnitsApply = result.data;
    });


    proveedorFactory.getproveedorType().then(function(result) {
        $scope.lstPayTypes = result.data;
    });



    $scope.setCurrentpay = function(id) {

        $scope.currentPayName = id.pro_nombre;
        $scope.currentPanel = 'pnlPendientes';
        proveedorFactory.getLote(id.pro_idtipoproceso).then(function(result) {
            $scope.lstUnitsPending = result.data;
        });

    };



    $scope.prevStep = function() {

        $scope.currentPanel = 'pnlPendientes';
        $scope.showDropDown = true;
    };

    $scope.setTableStyle = function(tableID) {
        staticFactory.setTableStyleOne(tableID);
    };

    $scope.showDetail = function(lote) {

        $scope.showDropDown = false;

        if (lote.estatusCID == 0) {
            $scope.objEdit.visible = true;
        } else {
            $scope.objEdit.visible = false;
        }

        $scope.currentPanel = 'pnlDetalle';
        proveedorFactory.getLoteDetail(lote.ple_idplanpiso).then(function(result) {
            $scope.lstUnitDeatil = result.data;
        });
    };



});