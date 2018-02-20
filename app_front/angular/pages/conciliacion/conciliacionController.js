appModule.controller('conciliacionController', function($scope, $rootScope, $location, conciliacionFactory, commonFactory, staticFactory) {
    $scope.lstConceal           = [];
    $scope.lstFinancial         = [];
    $scope.currentFinancialName = "Seleccionar Financiera";
    $scope.currentFinancial     = {};
    $scope.total                = { sistema: 0, archivo: 0 };
    $scope.loadLayout           = false;
    $scope.currentPanel         = 'pnlCargaArchivo';

    commonFactory.getFinancial().then(function(result) {
        $scope.lstFinancial = result.data;
    });


    var myDropzone;

    $scope.Dropzone = function() {
        myDropzone = new Dropzone("#idDropzone", {
            url: "/apiConciliacion/upload",
            uploadMultiple: 0,
            acceptedFiles: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        myDropzone.on("success", function(req, res) {
            var filename = res + '.xlsx';
            $scope.readLayout(filename);
            //$(".row_dropzone").hide();
        });

    };

    $scope.readLayout = function(filename) {
        console.log(filename);
        conciliacionFactory.readLayout(filename).then(function(result) {
            var LayoutFile = result.data;
            var aux = [];
            for( var i = 1; i < LayoutFile.length; i++ ){
                aux.push( LayoutFile[i] );
            }
            var execelFields = $scope.arrayToObject(aux);
            $scope.nexStep();

            conciliacionFactory.insExcelData(execelFields).then(function(result) {
                console.log(result.data);
            });
        }, function(error) {
            console.log("Error", error);
        });
    };

    $scope.arrayToObject = function(array) {
        var lst = [];
        for (var i = 0; i < array.length; i++) {
            var obj = { dato1: array[i][0], dato2: array[i][1], dato3: array[i][2] };
            lst.push(obj);
        }
        return lst;
    };

    $scope.conceal = function() {
        console.log($scope.currentFinancial.financieraID);
        conciliacionFactory.getConciliacion($scope.currentFinancial.financieraID).then(function(result) {
            $scope.lstConceal = result.data;
            $scope.sumTotal();
        });
    };
    $scope.sumTotal = function() {
        $scope.total.archivo = 0;
        $scope.total.sistema = 0;

        $scope.lstConceal.forEach(function(item) {
            $scope.total.archivo += item.InteresMesActual;
            $scope.total.sistema += item.interes;
        });
    };

    $scope.setCurrentFinancial = function(financialObj) {
        $scope.currentFinancial = financialObj;
        $scope.currentFinancialName = financialObj.nombre;
    };

    $scope.nexStep = function() {
        $scope.currentPanel = 'pnlConciliar';
    };

    $scope.prevStep = function() {
        $scope.currentPanel = 'pnlCargaArchivo';
    };

    $scope.setTableStyle = function(tblID) {
        staticFactory.setTableStyleOne(tblID);
    };





});