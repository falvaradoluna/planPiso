appModule.controller('provisionController', function($scope, $rootScope, $location, commonFactory, staticFactory, provisionFactory) {

    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));

    $scope.topBarNav = staticFactory.provisionBar();
    $scope.lstPayTypes = [];
    $scope.lstUnitsPending = [];
    $scope.lstUnitsApply = [];
    $scope.lstUnitDeatil = [];
    $scope.objEdit = { visible: false };
    $scope.currentPanel = 'pnlPendientes';
    $scope.currentPayName = 'Todos';
    $scope.showDropDown = true;



    provisionFactory.getLote(0).then(function(result) {
        $scope.lstUnitsPending = result.data;
    });

    provisionFactory.getLote(1).then(function(result) {
        $scope.lstUnitsApply = result.data;
    });


    provisionFactory.getProvisionType().then(function(result) {
        $scope.lstPayTypes = result.data;
    });



    $scope.setCurrentpay = function(id) {

        $scope.currentPayName = id.pro_nombre;
        $scope.currentPanel = 'pnlPendientes';
        provisionFactory.getLote(id.pro_idtipoproceso).then(function(result) {
            $scope.lstUnitsPending = result.data;
        });

    };



    $scope.prevStep = function() {
        provisionFactory.getLote(0).then(function(result) {
            $scope.lstUnitsPending = result.data;
        });
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
        provisionFactory.getLoteDetail(lote.ple_idplanpiso).then(function(result) {
            $scope.lstUnitDeatil = result.data;
        });
    };



});