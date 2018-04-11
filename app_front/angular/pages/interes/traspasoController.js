appModule.controller('traspasoController', function($scope, $rootScope, $location, $filter, commonFactory, staticFactory, interesFactory, esquemaFactory, traspasoFactory) {
    // $scope.lstNewUnits => Arreglo con los documentos a traspasar.

    $scope.setPanelResumen = function() {
    	$scope.setPnlResumen();
    };

    $scope.setPanelInteres = function() {        
        location.reload();
    };

    $scope.Traspaso = function() {
        swal({
                title: "¿Esta seguro?",
                text: "Se aplicará el traspaso para las unidades seleccionadas.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#21B9BB",
                confirmButtonText: "Aplicar",
                closeOnConfirm: false
            },
            function() {
                $scope.lstNewUnits.forEach(function(item) {
                    if (item.isChecked === true) {
                        var data = {
                            CCP_IDDOCTO: item.CCP_IDDOCTO,
                            usuarioID: $scope.idUsuario,
                            empresaID: item.empresaID,
                            sucursalID: item.sucursalID,
                            financieraID: $scope.currentFinancial2.financieraID,
                            esquemaID: $scope.currentSchema2.esquemaID,
                            tipoMovimientoId: $scope.typeTraspaso //cambio financiera
                        };

                        traspasoFactory.setChangeSchema(data).then(function() {

                        }, function(error) {
                            $scope.error(error.data.Message);

                        });
                    }
                });
                // $scope.success();
            }
        );
    };
});