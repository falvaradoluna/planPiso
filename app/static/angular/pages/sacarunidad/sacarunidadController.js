appModule.controller('sacarunidadController', function($scope, $rootScope, $location, commonFactory, staticFactory, sacarunidadFactory) {

    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));

    $scope.topBarNav = staticFactory.sacarunidadBar();
    $scope.lstPayTypes = [];
    $scope.lstUnitsPending = [];
    $scope.lstUnitsApply = [];
    $scope.lstUnitDeatil = [];
    $scope.objEdit = { visible: false };
    $scope.currentPanel = 'pnlPendientes';
    $scope.currentPayName = 'Todos';
    $scope.showDropDown = true;



    sacarunidadFactory.getLote(0, '11').then(function(result) {
        $scope.lstUnitsPending = result.data;
    });

    sacarunidadFactory.getLote(1, '11').then(function(result) {
        $scope.lstUnitsApply = result.data;
    });






    $scope.setCurrentpay = function(id) {

        $scope.currentPayName = id.pro_nombre;
        $scope.currentPanel = 'pnlPendientes';
        sacarunidadFactory.getLote(id.pro_idtipoproceso).then(function(result) {
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
        sacarunidadFactory.getLoteDetail(lote.ple_idplanpiso).then(function(result) {
            $scope.lstUnitDeatil = result.data;
        });
    };



});