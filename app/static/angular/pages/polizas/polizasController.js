appModule.controller('polizasController', function($scope, $rootScope, $location, commonFactory, staticFactory, polizasFactory, utils) {

    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));

    $scope.topBarNav = staticFactory.polizasBar();
    $scope.lstPayTypes = [];
    $scope.lstUnitsPending = [];
    $scope.lstUnitsApply = [];
    $scope.lstUnitDeatil = [];
    $scope.objEdit = { visible: false };
    $scope.currentPanel = 'pnlPendientes';
    $scope.currentPayName = 'polizass Pendiente';
    $scope.showDropDown = true;


    polizasFactory.getLote(0, '9').then(function(result) {
        $scope.lstUnitsPending = result.data;
    });


    polizasFactory.getLote(1, '9').then(function(result) {
        $scope.lstUnitsApply = result.data;
    });


    commonFactory.getCatalog(4).then(function(result) {
        $scope.lstPayTypes = result.data;
    });



    $scope.setCurrentpay = function(payType) {


        $scope.currentPanel = 'pnlPendientes';

    }





    $scope.prevStep = function() {
        $scope.setCurrentpay($scope.lstPayTypes[0]);
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
        polizasFactory.getLoteDetail(lote.ple_idplanpiso).then(function(result) {
            $scope.lstUnitDeatil = result.data;
        });
    };
    $scope.prueba = function() {
        polizasFactory.pruebaReporte(341).then(function(result) {
            console.log(result);
            var file = new Blob([result.data], { type: 'application/pdf' });
                    var fileURL = URL.createObjectURL(file);
        });
    };



});