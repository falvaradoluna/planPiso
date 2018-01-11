appModule.controller('interesController', function($scope, $rootScope, $location, commonFactory, staticFactory, interesFactory, esquemaFactory) {

    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));

    $scope.currentEmpresa = sessionFactory.nombre;
    $scope.topBarNav = staticFactory.interesBar();

    $scope.lstSucursal = [];
    $scope.lstFinancial = [];
    $scope.lstSchemas = [];
    $scope.lstSchemeDetail = [];
    $scope.lstNewUnits =[];
    $scope.unitDetail = {};
    $scope.currentPanel = "pnlInteres";
    $scope.currentSucursalName = "Sucursal Todas";
    $scope.currentFinancialName = "Selecciona Financiera";
    $scope.allUnits = { isChecked: false };
    $scope.currentFinancialID = 0;
    $scope.interesMesActual = 0;
    $scope.interesAcumulado = 0;
    $scope.interesPagado = 0;
    $scope.numUnidades = 0;
    $scope.fechaHoy = new Date();


    commonFactory.getSucursal(sessionFactory.empresaID).then(function(result) {
        $scope.lstSucursal = result.data;
    });


    commonFactory.getFinancial().then(function(result) {
        $scope.lstFinancial = result.data;
    });

    //$scope.params = { empresaID: sessionFactory.empresaID, idSucursal: 1 };

    $('#mdlLoading').modal('show');

    interesFactory.getInterestUnits(sessionFactory.empresaID).then(function(result) {
        $scope.lstNewUnits = result.data;
        for (var i = 0; i < $scope.lstNewUnits.length; i++) {
            $scope.lstNewUnits[i].excludeField = false;
            $scope.interesPagado += $scope.lstNewUnits[i].InteresCortePagado;
            $scope.interesMesActual += $scope.lstNewUnits[i].InteresMesActual;
            $scope.interesAcumulado += $scope.lstNewUnits[i].InteresAcumuladoFinanciera;
            $scope.numUnidades++;
        }
        $('#mdlLoading').modal('hide');
    });

    $scope.filterDay = function(days) {
        $('#tblUnidadesNuevas').DataTable().destroy();
        $scope.initDashboardCounters();
        $scope.setFilterDay($scope.lstNewUnits, 0, days);
    };


    $scope.setFilterDay = function(dataArray, index, value) {

        if (index === undefined) index = 0;
        if (index >= dataArray.length) {
            $scope.setDelayTableStyle('#tblUnidadesNuevas');
            return;
        }

        if (parseInt(dataArray[index].diasInteres) <= value) {
            dataArray[index].excludeField = false;
            $scope.interesPagado += dataArray[index].InteresCortePagado;
            $scope.interesMesActual += dataArray[index].InteresMesActual;
            $scope.interesAcumulado += dataArray[index].InteresAcumuladoFinanciera;
            $scope.numUnidades++;
        } else {
            dataArray[index].excludeField = true;
        }

        $scope.setFilterDay(dataArray, ++index, value);
    };

    $scope.setCurrentFinancial = function(financialObj) {
        $scope.currentFinancialName = financialObj.nombre;
        $scope.currentFinancialID = financialObj.financieraID;
        $scope.getSchemas($scope.currentFinancialID);
    };


    $scope.getSchemas = function(financialId) {
        $('#mdlLoading').modal('show');
        commonFactory.getSchemas(financialId).then(function(result) {
            $('#tblSchemas').DataTable().destroy();
            $scope.lstSchemas = result.data;
            $('#mdlLoading').modal('hide');
        });
    };



    $scope.setPnlInteres = function() {
        $scope.currentPanel = "pnlInteres";
    };

    $scope.setPnlInteresMovimientos = function() {
        $scope.currentPanel = "pnlInteresMovimientos";
    };

    $scope.setBackToDetailUnit = function(unidad) {
        $scope.currentPanel = "pnlDetalleUnidad";
    }

    $scope.setPnlDetalleUnidad = function(unidad) {
        interesFactory.getDetailUnits(unidad.unidadID).then(function(result) {
            $scope.unitDetail = result.data[0];
            esquemaFactory.getSchemeDetail(unidad.esquemaID).then(function(resultSchema) {
                /*no debe de venir de aqui eliminar esquema factory es de movimientos*/
                $scope.lstSchemeDetail = resultSchema.data;
            });
        });

        $scope.currentPanel = "pnlDetalleUnidad";

    };

    $scope.setPnlCambioAgencia = function() {
        $scope.currentPanel = "pnlAgencia";
    };

    $scope.setPnlTraspasoFinanciero = function() {

        if ($scope.haveSelection() === false) {
            swal("Aviso", "No se ha seleccionado ningun registro", "warning");
        } else {
            $scope.currentPanel = "pnlFinanciera";
        }

    };

    $scope.setPnlResumen = function() {
        $scope.currentPanel = "pnlResumen";
    };

    $scope.setCurrentSucursal = function(sucursalObj) {
        $scope.currentSucursalName = sucursalObj.nombreSucursal;
        $scope.initAmounts();

        $('#mdlLoading').modal('show');
        $('#tblUnidadesNuevas').DataTable().destroy();
        interesFactory.getInterestUnits(sessionFactory.empresaID, sucursalObj.sucursalID).then(function(result) {

            $scope.lstNewUnits = result.data;
            for (var i = 0; i < $scope.lstNewUnits.length; i++) {
                $scope.lstNewUnits[i].excludeField = false;
                $scope.interesPagado += $scope.lstNewUnits[i].InteresCortePagado;
                $scope.interesMesActual += $scope.lstNewUnits[i].InteresMesActual;
                $scope.interesAcumulado += $scope.lstNewUnits[i].InteresAcumuladoFinanciera;
                $scope.numUnidades++;
            }

            $('#mdlLoading').modal('hide');
        });

    };

    $scope.initAmounts = function() {

        $scope.lstNewUnits = [];
        $scope.interesPagado = 0;
        $scope.interesMesActual = 0;
        $scope.interesAcumulado = 0;
        $scope.numUnidades = 0;
    };

    $scope.setTableStyle = function(tblID) {
        staticFactory.setTableStyleOne(tblID);
    };

    $scope.setDelayTableStyle = function(tblID) {
        setTimeout(function() {
            staticFactory.setTableStyleOne(tblID);
        }, 500);
    };

    $scope.initDashboardCounters = function() {
        $scope.interesPagado = 0;
        $scope.interesMesActual = 0;
        $scope.interesAcumulado = 0;
        $scope.numUnidades = 0;
    };

    $scope.checkAllUnits = function() {
        for (var i = 0; i < $scope.lstNewUnits.length; i++) {
            $scope.lstNewUnits[i].isChecked = $scope.allUnits.isChecked;
        }
    };



    $scope.doSomething = function() {
        swal({
                title: "¿Esta seguro?",
                text: "Se aplicará el pago de intereses para las unidades seleccionadas.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#21B9BB",
                confirmButtonText: "Pagar",
                closeOnConfirm: false
            },
            function() {
                swal("Ok", "Pago finalizó con exito", "success");
                setTimeout(function() {
                    console.log('Termino');
                }, 1000);
            }
        );
    };

    $scope.haveSelection = function() {
        for (var i = 0; i < $scope.lstNewUnits.length; i++) {
            if ($scope.lstNewUnits[i].isChecked === true) return true;
        }
        return false;
    };

    $scope.callPayInteres = function() {

        if ($scope.haveSelection() === false) {
            swal("Aviso", "No se ha seleccionado ningun registro", "warning");
        } else {
            swal({
                    title: "¿Esta seguro?",
                    text: "Se aplicará el pago de intereses para las unidades seleccionadas.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#21B9BB",
                    confirmButtonText: "Pagar",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                },
                function() {
                    $scope.payInteres();
                    swal("Ok", "Pago finalizó con exito", "success");
                }
            );
        }
    };

    $scope.payInteres = function() {

        interesFactory.insLotePago().then(function(result) {

            if (result.data[0].result > 0) {

                $scope.lstNewUnits.forEach(function(item) {
                    if (item.isChecked === true) {

                        var params = {
                            loteID: result.data[0].result,
                            unidadID: item.unidadID,
                            interesCalculado: item.InteresMesActual
                        };

                        interesFactory.insLotePagoDetalle(params).then(function(resultDetail) {
                            console.log(resultDetail.data);
                        });

                    }
                });
            }

        });

    };




    $scope.callPayCapital = function() {

        if ($scope.haveSelection() === false) {
            swal("Aviso", "No se ha seleccionado ningun registro", "warning");
        } else {
            $scope.currentPanel = "pnlInteresReduccion";
        }
    };








});