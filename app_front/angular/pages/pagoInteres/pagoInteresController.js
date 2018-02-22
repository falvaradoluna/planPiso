appModule.controller('pagoInteresController', function($scope, $rootScope, $location, commonFactory, staticFactory, pagoFactory) {

    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));

    $scope.topBarNav = staticFactory.pagoBar();
    $scope.lstPayTypes = [];
    $scope.lstUnitsPending = [];
    $scope.lstUnitsApply = [];
    $scope.lstUnitDeatil = [];
    $scope.objEdit = { visible: false };
    $scope.currentPanel = 'pnlPendientes';
    $scope.currentPayName = 'Pagos Pendiente';
    $scope.showDropDown = true;


    pagoFactory.getLote(0).then(function(result) {
        $scope.lstUnitsPending = result.data;
    });


    pagoFactory.getLote(1).then(function(result) {
        $scope.lstUnitsApply = result.data;
    });


    commonFactory.getCatalog(4).then(function(result) {
        $scope.lstPayTypes = result.data;
    });



    $scope.setCurrentpay = function(payType) {

        $scope.currentPayName = payType.texto;

        switch (parseInt(payType.CID)) {
            case 0:
                $scope.currentPanel = 'pnlPendientes';
                break;
            case 1:
                $scope.currentPanel = 'pnlAplicados';
                break;
            default:
                break;
        }

    };



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
        pagoFactory.getLoteDetail(lote.ple_idplanpiso).then(function(result) {
            $scope.lstUnitDeatil = result.data;
        });
    };



});