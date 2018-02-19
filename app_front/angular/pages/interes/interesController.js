appModule.controller('interesController', function($scope, $rootScope, $location, commonFactory, staticFactory, interesFactory, esquemaFactory) {

    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.idUsuario = localStorage.getItem("idUsuario");
    $scope.currentEmpresa = sessionFactory.nombre;
    $scope.topBarNav = staticFactory.interesBar();
    $scope.ddlFinancialShow = false;
    $scope.showButtons = false;
    $scope.lstSucursal = [];
    $scope.lstFinancial = [];
    $scope.lstSchemas = [];
    $scope.lstSchemeDetail = [];
    $scope.lstNewUnits = [];
    $scope.lstSelectUnits = [];
    $scope.lstSelectPay = [];
    $scope.unitDetail = {};
    $scope.currentPanel = "pnlInteres";
    $scope.currentSucursalName = "Sucursal Todas";
    $scope.currentFinancialName = "Selecciona Financiera";
    $scope.currentSucursal = [];
    $scope.allUnits = { isChecked: false };
    $scope.currentFinancialID = 0;
    $scope.interesMesActual = 0;
    $scope.interesAcumulado = 0;
    $scope.interesPagado = 0;
    $scope.numUnidades = 0;
    $scope.fechaHoy = new Date();
    $scope.typeTraspaso = 0;
    $scope.TituloTraspaso = '';


    commonFactory.getSucursal(sessionFactory.empresaID, $scope.idUsuario).then(function(result) {
        $scope.lstSucursal = result.data;
    });


    commonFactory.getFinancial().then(function(result) {
        $scope.lstFinancial = result.data;
    });
    $scope.checkUnits = function(value) {
        var log = [];

        if (value.isChecked) {
            $scope.lstSelectUnits.push(value);
        } else { $scope.lstSelectUnits = _.reject($scope.lstSelectUnits, function(el) { return el.unidadID === value.unidadID; });; }


        $scope.showButtons = $scope.lstSelectUnits.length > 0;
    }

    $scope.setCurrentSucursal = function(sucursalObj) {
        $scope.totalUnidades = 0;
        $scope.currentSucursalName = sucursalObj.nombreSucursal;
        $scope.currentSucursal = sucursalObj;
        $scope.lstNewUnits = [];

        $scope.ddlFinancialShow = true;
    };
    $scope.setCurrentFinancial = function(financialObj) {
        //  $scope.currentPanel = "pnlResumen";
        $scope.currentFinancialName = financialObj.nombre;

        // $scope.getNewUnitsBySucursal(sessionFactory.empresaID, $scope.currentSucursal.sucursalID);

        $scope.initAmounts();

        $('#mdlLoading').modal('show');
        interesFactory.getInterestUnits(sessionFactory.empresaID, $scope.currentSucursal.sucursalID, financialObj.financieraID).then(function(result) {
            $scope.setResetTable('tblUnidadesNuevas', 'Unidades Nuevas', 20);
            $scope.lstNewUnits = [];
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
    $scope.setCurrentFinance2 = function(financialObj) {
        //  $scope.currentPanel = "pnlResumen";
        $scope.currentFinancialName2 = financialObj.nombre;
        $scope.currentFinancial2 = financialObj;
        // $scope.getNewUnitsBySucursal(sessionFactory.empresaID, $scope.currentSucursal.sucursalID);

        commonFactory.getSchemas(financialObj.financieraID).then(function(result) {
            $scope.lstSchemas = result.data;
        });
    };
    $('#mdlLoading').modal('show');
    $scope.getSchemas = function(financialId) {
        $('#mdlLoading').modal('show');
        $scope.currentSchemaName = financialId.nombre;
        commonFactory.getSchemas(financialId).then(function(result) {
            $scope.lstSchemas = result.data;
            $('#mdlLoading').modal('hide');
        });
    };
    $scope.setCurrentSchema2 = function(financialId) {
        $scope.currentSchemaName2 = financialId.nombre;
        $scope.currentSchema2 = financialId;
        // commonFactory.getSchemas(financialId).then(function(result) {
        //     $scope.lstSchemas = result.data;
        //     $('#mdlLoading').modal('hide');
        // });
    };
    interesFactory.getInterestUnits(sessionFactory.empresaID).then(function(result) {
        // $('#tblUnidadesNuevas').DataTable().destroy();
        $scope.lstNewUnits = [];
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
        //  $('#tblUnidadesNuevas').DataTable().destroy();
        $scope.initDashboardCounters();
        $scope.setFilterDay($scope.lstNewUnits, 0, days);
    };


    $scope.setFilterDay = function(dataArray, index, value) {

        if (index === undefined) index = 0;
        if (index >= dataArray.length) {
            //   $scope.setDelayTableStyle('#tblUnidadesNuevas');
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
            var data = {
                CCP_IDDOCTO: unidad.CCP_IDDOCTO
            };
            interesFactory.getSchemaMovements(data).then(function(resultSchema) {
                /*no debe de venir de aqui eliminar esquema factory es de movimientos*/
                $scope.lstSchemeDetail = resultSchema.data[0];
                $scope.unitDetail = resultSchema.data[1][0];
                $scope.unitDetailEsquema = resultSchema.data[2][0];
            });
        });

        $scope.currentPanel = "pnlDetalleUnidad";

    };

    $scope.setPnlCambioAgencia = function() {
        $scope.currentPanel = "pnlAgencia";
    };

    $scope.setPnlTraspasoFinanciero = function(typeTraspaso) {
        $scope.typeTraspaso = typeTraspaso;
        if ($scope.haveSelection() === false) {
            swal("Aviso", "No se ha seleccionado ningun registro", "warning");
        } else {
            $scope.currentPanel = "pnlFinanciera";
            if ($scope.typeTraspaso == 3) {
                $scope.TituloTraspaso = "Traspaso de Financiera";
            } else if ($scope.typeTraspaso == 4) {
                $scope.TituloTraspaso = "Cambio de Esquema";
            } else {
                $scope.TituloTraspaso = "";
            }
        }

    };

    $scope.setPnlResumen = function() {
        $scope.currentPanel = "pnlResumen";
    };
    $scope.setPnlPagoResumen = function() {
        $scope.currentPanel = "pnlPagoResumen";
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
    $scope.setResetTable = function(tblID, display, length) {
        $('.' + tblID).DataTable().destroy();
        setTimeout(function() {
            staticFactory.filtrosTabla(tblID, display, length);
        }, 500);
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

                        interesFactory.setChangeSchema(data).then(function() {

                        }, function(error) {
                            $scope.error(error.data.Message);

                        });
                    }
                });
                $scope.success();
            }
        );
    };


    $scope.success = function() {
        swal("Ok", "Traspaso finalizó con exito", "success");
        setTimeout(function() {
            console.log('Termino');
            window.location = "/interes";
        }, 1000);
    };
    $scope.error = function(msg) {
        swal("Error", "Traspaso finalizó con errores :" + msg, "error");
        setTimeout(function() {
            console.log('Termino');
        }, 1000);
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
            $scope.currentPanel = "pnlPagoInteres";
            $scope.lstNewUnits.forEach(function(item) {
                if (item.isChecked === true) {
                    $scope.lstSelectPay.push(item);

                }
            });

        }
    };
    $scope.incremental = 0;
    $scope.consecNum = 0;
    $scope.CrearPolizaPago = function() {
        swal({
            title: "¿Esta seguro?",
            text: "Se creara la poliza para el pago de interes para las unidades seleccionadas.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#21B9BB",
            confirmButtonText: "Aplicar",
            closeOnConfirm: false
        }, function() {
            $scope.listPoliza = _.where($scope.lstNewUnits, { isChecked: true });
            $scope.guardandoPoliza();
        });
    }

    $scope.guardandoPoliza = function() {
        var saplica = 0;
        var item = $scope.listPoliza[$scope.incremental];
        if ($scope.listPoliza.length == ($scope.incremental + 1)) {
            saplica = 1;
        }
        var params = {
            CCP_IDDOCTO: item.CCP_IDDOCTO,
            consecutivo: $scope.consecNum,
            saldoDocumento: item.saldo,
            interesCalculado: item.InteresMesActual,
            interesAplicar: item.InteresMes,
            aplica: saplica,
            idEmpresa: item.empresaID,
            idSucursal: item.sucursalID

        };


        interesFactory.getGuardaProvision(params).then(function(result) {
            $scope.consecNum = result.data[0][0].consecutivo;
            var insercion = result.data[0][0];
            console.log("insercion", insercion);

            if (insercion.success == 1) {

                $scope.incremental++;

                if ($scope.incremental < $scope.listPoliza.length) {
                    $scope.guardandoPoliza();
                } else {
                    $scope.incremental = 0;
                    $scope.consecNum = 0;
                    swal("Poliza pago interes", "Guardado correctamente");
                    setTimeout(function() {
                        console.log('Termino');
                        window.location = "/interes";
                    }, 1000);
                }
            } else {
                swal("Poliza pago interes", "Guardado correctamente");
            }
        }, function(error) {
            console.log("Error", error);
        });
    }





    $scope.callPayCapital = function() {

        if ($scope.haveSelection() === false) {
            swal("Aviso", "No se ha seleccionado ningun registro", "warning");
        } else {
            $scope.currentPanel = "pnlInteresReduccion";
        }
    };








});