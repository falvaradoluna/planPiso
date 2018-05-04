appModule.controller('interesController', function($scope, $rootScope, $location, $filter, commonFactory, staticFactory, interesFactory, esquemaFactory) {
    var sessionFactory          = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.idUsuario            = localStorage.getItem("idUsuario");
    $scope.currentEmpresa       = sessionFactory.nombre;
    $scope.topBarNav            = staticFactory.interesBar();
    $scope.ddlFinancialShow     = false;
    $scope.showButtons          = false;
    $scope.lstSucursal          = [];
    $scope.lstFinancial         = [];
    $scope.lstSchemas           = [];
    $scope.lstSchemeDetail      = [];
    $scope.lstNewUnits          = [];
    $scope.lstSelectUnits       = [];
    $scope.lstSelectPay         = [];
    $scope.unitDetail           = {};
    $scope.currentPanel         = "pnlInteres";
    $scope.currentSucursalName  = "Sucursal Todas";
    $scope.currentFinancialName = "Selecciona Financiera";
    $scope.currentSucursal      = [];
    $scope.currentFinancial     = [];
    $scope.allUnits             = { isChecked: false };
    $scope.currentFinancialID   = 0;
    $scope.interesMesActual     = 0;
    $scope.interesAcumulado     = 0;
    $scope.interesPagado        = 0;
    $scope.numUnidades          = 0;
    $scope.fechaHoy             = new Date();
    $scope.typeTraspaso         = 0;
    $scope.TituloTraspaso       = '';
    $scope.consecPago           = 0;

    $scope.initAmounts = function() {
        $scope.lstNewUnits = [];
        $scope.interesPagado = 0;
        $scope.interesMesActual = 0;
        $scope.interesAcumulado = 0;
        $scope.numUnidades = 0;
    };

    commonFactory.getSucursal(sessionFactory.empresaID, $scope.idUsuario).then(function(result) {
        $scope.lstSucursal = result.data;
    });


    commonFactory.getFinancial(sessionFactory.empresaID).then(function(result) {
        $scope.lstFinancial = result.data;
    });
    $scope.checkUnits = function(value) {

        $scope.showButtons = _.where($scope.lstNewUnits, { isChecked: true }).length > 0;
    }

    $scope.setCurrentSucursal = function(sucursalObj) {
        $scope.totalUnidades = 0;
        if (sucursalObj != null) {
            $scope.currentSucursalName = sucursalObj.nombreSucursal;
            $scope.currentSucursal = sucursalObj;
            $scope.ddlFinancialShow = true;
        } else {
            $scope.currentSucursalName = "Sucursal Todas";
            $scope.currentSucursal = [];
            $scope.ddlFinancialShow = false;
        }
        $scope.lstNewUnits = [];
        $scope.currentFinancial = [];
        $scope.currentFinancialName = "Selecciona Financiera";

        $('#mdlLoading').modal('show');
        $scope.ObtenUnidadesInteres();
    };
    $scope.setCurrentFinancial = function(financialObj) {
        //  $scope.currentPanel = "pnlResumen";
        $scope.currentFinancialName = financialObj.nombre;
        $scope.currentFinancial = financialObj;
        $('#mdlLoading').modal('show');
        $scope.ObtenUnidadesInteres();
    };
    $scope.ObtenUnidadesInteres = function() {
        $scope.initAmounts();
        interesFactory.getInterestUnits(sessionFactory.empresaID, $scope.currentSucursal.sucursalID, $scope.currentFinancial.financieraID).then(function(result) {
            $scope.setResetTable('tblUnidadesNuevas', 'Unidades Nuevas', 20);
            $scope.lstNewUnits = [];
            $scope.lstNewUnits = result.data;
            for (var i = 0; i < $scope.lstNewUnits.length; i++) {
                $scope.lstNewUnits[i].excludeField = false;
                $scope.interesPagado += $scope.lstNewUnits[i].InteresCortePagado;
                $scope.interesMesActual += $scope.lstNewUnits[i].InteresMesActual;
                $scope.interesAcumulado += $scope.lstNewUnits[i].InteresAcumulado;
                $scope.numUnidades++;
            }

            $('#mdlLoading').modal('hide');
        });
    }
    $scope.setCurrentFinance2 = function(financialObj) {
        //  $scope.currentPanel = "pnlResumen";
        $scope.currentFinancialName2 = financialObj.nombre;
        $scope.currentFinancial2 = financialObj;
        $scope.currentSchemaName2 = '';
        $scope.currentSchema2 = [];

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
        console.log("financialId", financialId);
        $scope.currentSchemaName2 = financialId.nombre;
        $scope.currentSchema2 = financialId;
        // commonFactory.getSchemas(financialId).then(function(result) {
        //     $scope.lstSchemas = result.data;
        //     $('#mdlLoading').modal('hide');
        // });
    };

    $scope.ObtenUnidadesInteres();

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
        location.reload();
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

    $scope.regresarTraspaso = function(){
        $scope.currentPanel = "pnlFinanciera";
    }

    $scope.setPnlResumen = function() {
        $scope.currentPanel = "pnlResumen";
    };

    $scope.setPnlPagoResumen = function() {
        var isok = 0;
        $scope.lstSelectPay.forEach(function(item) {
            if (item.InteresMes == 0 || item.InteresMes == undefined) {
                isok++;

            }
        });
        if (isok == 0) {
            $scope.currentPanel = "pnlPagoResumen";
        } else {

            swal("Aviso", "Debe llenar el interes total para crear la provisión", "warning");

        }
    };
    $scope.setPnlPagoUnidadResumen = function() {
        var isok = 0;
        $scope.lstSelectPay.forEach(function(item) {
            if (item.InteresMes == 0 || item.InteresMes == undefined) {
                isok++;

            }
        });
        if (isok == 0) {
            $scope.currentPanel = "pnlPagoUnidadResumen";
        } else {

            swal("Aviso", "Debe llenar el interes total para crear la provisión", "warning");

        }
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
        $scope.showButtons = _.where($scope.lstNewUnits, { isChecked: true }).length > 0;
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

    $scope.success = function() {
        swal("Ok", "Finalizó con exito", "success");
        setTimeout(function() {
            console.log('Termino');
            window.location = "/interes";
        }, 1000);
    };

    $scope.error = function(msg) {
        swal("Error", "Finalizó con errores :" + msg, "error");
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


        $scope.currentPanel = "pnlPagoInteres";
        $scope.lstNewUnits.forEach(function(item) {
            if (item.isChecked === true) {
                item.InteresMes = item.InteresMesActual;
                $scope.lstSelectPay.push(item);

            }
        });

    };
    $scope.incremental = 0;
    $scope.consecNum = 0;
    $scope.Sumar = function(unidad) {
        if (unidad.InteresMes == undefined) {
            unidad.InteresMes = '0';
            unidad.InteresMes = unidad.InteresMesActual;
        }
        if (unidad.TotalMes == undefined)
            unidad.TotalMes = '0';
        if (unidad.FechaPromesa == undefined) {
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            unidad.FechaPromesa = tomorrow;
        }
        unidad.TotalMes = parseFloat(unidad.InteresMes) + unidad.saldo;
        return unidad.TotalMes;
    }
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
            if ($scope.haveSelection() === false) {
                swal("Aviso", "No se ha seleccionado ningun registro", "warning");
            } else {
                $scope.existeProvision = 0;
                $scope.consecProvision = 0;
                $scope.lstNewUnits.forEach(function(item) {
                    if (item.isChecked === true) {
                        var data = {
                            CCP_IDDOCTO: item.CCP_IDDOCTO,
                            empresaID: item.empresaID,
                            sucursalID: item.sucursalID
                        };
                        interesFactory.getProvisionToday(data).then(function(result) {
                            $scope.consecProvision++;
                            if (result.data[0].length > 0)
                                $scope.existeProvision++;

                        }, function(error) {
                            $scope.error(error.data.Message);

                        });

                    }
                });



            }
        });
    }
    $scope.CrearPago = function() {
        swal({
            title: "¿Esta seguro?",
            text: "Se creara  el pago de la unidad e interes para las unidades seleccionadas.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#21B9BB",
            confirmButtonText: "Aplicar",
            closeOnConfirm: false
        }, function() {
            if ($scope.haveSelection() === false) {
                swal("Aviso", "No se ha seleccionado ningun registro", "warning");
            } else {

                $scope.lstNewUnits.forEach(function(item) {
                    if (item.isChecked === true) {
                        var data = {
                            CCP_IDDOCTO: item.CCP_IDDOCTO,
                            empresaID: item.empresaID,
                            sucursalID: item.sucursalID,
                            InteresMes: parseFloat(item.InteresMes),
                            FechaPromesa: $filter('date')(item.FechaPromesa, "yyyy-MM-dd"),
                            TotalMes: parseFloat(item.TotalMes),
                            saldo: parseFloat(item.saldo),
                            tipoCobroInteresID: item.tipoCobroInteresID,
                            tipoPagoInteresID: item.tipoPagoInteresID,
                            tipoPagoMensualID: item.tipoPagoMensualID,
                            tipoSOFOMID: item.tipoSOFOMID,
                            usuarioID: $scope.idUsuario,
                        };

                        interesFactory.insPago(data).then(function(result) {
                            $scope.consecPago++;


                        }, function(error) {
                            $scope.error(error.data.Message);

                        });

                    }
                });
            }
        });
    }

    $scope.$watch('consecProvision', function() {
        $scope.listPoliza = _.where($scope.lstNewUnits, { isChecked: true });
        if ($scope.consecProvision == $scope.listPoliza.length) {
            if ($scope.existeProvision == 0) {
                $scope.guardandoPoliza();
            } else {
                swal("Aviso", "Ya existe una provisión del dia de hoy.", "warning");

            }
        }

    });

    $scope.$watch('consecPago', function() {
        $scope.listPoliza = _.where($scope.lstNewUnits, { isChecked: true });
        if ($scope.consecPago > 0 && $scope.consecPago == $scope.listPoliza.length) {
            swal("Pago de unidad e interes", "Guardado correctamente");
            setTimeout(function() {
                console.log('Termino');
                window.location = "/pagoInteres";
            }, 1000);
        }

    });

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
            idSucursal: item.sucursalID,
            idFinanciera: item.financieraID

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
                    $scope.procesaPoliza($scope.consecNum);
                }
            } else {
                swal("Poliza pago interes", "Guardado correctamente");
            }
        }, function(error) {
            console.log("Error", error);
        });
    }

    $scope.procesaPoliza = function(consecNum) {
        var saplica = 0;
        var item = $scope.listPoliza[$scope.incremental];
        if ($scope.listPoliza.length == ($scope.incremental + 1)) {
            saplica = 1;
        }
        var params = {

            consecutivo: consecNum

        };


        interesFactory.getProcesaProvision(params).then(function(result) {

            if (result.statusText == 'OK') {
                $scope.incremental = 0;
                $scope.consecNum = 0;
                swal("Poliza pago interes", "Guardado correctamente");
                setTimeout(function() {
                    console.log('Termino');
                    window.location = "/provision";
                }, 1000);

            } else {
                swal("Poliza pago interes", "Hubo un problema", "warning");
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

    $scope.callPay = function() {
        $scope.consec2Pago = 0;
        if ($scope.haveSelection() === false) {
            swal("Aviso", "No se ha seleccionado ningun registro", "warning");
        } else {
            $scope.lstNewUnits.forEach(function(item) {
                if (item.isChecked === true) {
                    var data = {
                        CCP_IDDOCTO: item.CCP_IDDOCTO
                    };

                    interesFactory.validaPago(data).then(function(result) {
                        $scope.consec2Pago++;
                        item.sePago = result.data[0].sePago;
                        if (result.data[0].interesMes > 0)
                            item.InteresMes = result.data[0].interesMes;

                    }, function(error) {
                        $scope.error(error.data.Message);

                    });

                }
            });
        }
    }

    $scope.$watch('consec2Pago', function() {
        $scope.listPoliza = _.where($scope.lstNewUnits, { isChecked: true });
        $scope.listValida = _.where($scope.lstNewUnits, { sePago: true });
        if ($scope.consec2Pago > 0 && $scope.consec2Pago == $scope.listPoliza.length) {

            if ($scope.listValida.length > 0) {
                swal("Aviso", "Ya se han pagado algunos documentos elegidos", "warning");
            } else {
                $scope.currentPanel = "pnlPago";
                $scope.lstNewUnits.forEach(function(item) {
                    if (item.isChecked === true) {
                        $scope.lstSelectPay.push(item);

                    }
                });
            }
        }
    });

    $scope.callCompensation = function() {
        $scope.consecCompensacion = 0;

        if ($scope.haveSelection() === false) {
            swal("Aviso", "No se ha seleccionado ningun registro", "warning");
        } else {
            $scope.listValida = _.where($scope.lstNewUnits, { sePago: true });
            if ($scope.listValida.length > 1) {
                swal("Aviso", "Solo se puede seleccionar uno a la vez.", "warning");
            } else {
                $scope.lstNewUnits.forEach(function(item) {
                    if (item.isChecked === true) {
                        var data = {
                            CCP_IDDOCTO: item.CCP_IDDOCTO
                        };

                        interesFactory.GetCompensacion(data).then(function(result) {
                            $scope.currentPanel = "pnlCompensacion";
                            $scope.saldoFinanciera = result.data[0].saldoFinanciera;
                            $scope.precioUnidad = result.data[0].precioUnidad;
                            $scope.anticipoUnidad = result.data[0].anticipoUnidad;
                            $scope.saldoCliente = $scope.precioUnidad - $scope.anticipoUnidad;
                            $scope.diferenciaSaldo = $scope.precioUnidad - $scope.saldoFinanciera;
                            if ($scope.saldoFinanciera - $scope.saldoCliente > 0) {
                                $scope.saldoCompensar = $scope.saldoCliente;
                            } else {
                                $scope.saldoCompensar = $scope.saldoFinanciera;
                            }
                        }, function(error) {
                            $scope.error(error.data.Message);

                        });

                    }
                });
            }

        }
    }


    $scope.setPnlCompensacion = function() {
        $scope.currentPanel = "pnlCompensacion";
    };
    $scope.setPnlCompensacionResumen = function(saldoCompensar) {
        var isok = 0;
        if (saldoCompensar - $scope.saldoFinanciera <= 0) {
            $scope.currentPanel = "pnlCompensacionResumen";
            $scope.saldoCompensar = saldoCompensar;
        } else {
            swal("Aviso", "No puede ser mayor el saldo a compensar que el saldo e la financiera", "warning");
        }
    };
    $scope.CreaCompensacion = function() {
        swal({
            title: "¿Esta seguro?",
            text: "Se creara la compensación de la unidad  para la unidad seleccionada.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#21B9BB",
            confirmButtonText: "Aplicar",
            closeOnConfirm: false
        }, function() {
            if ($scope.haveSelection() === false) {
                swal("Aviso", "No se ha seleccionado ningun registro", "warning");
            } else {

                $scope.lstNewUnits.forEach(function(item) {
                    if (item.isChecked === true) {
                        var data = {
                            CCP_IDDOCTO: item.CCP_IDDOCTO,
                            empresaID: item.empresaID,
                            sucursalID: item.sucursalID,

                            saldo: parseFloat($scope.saldoCompensar),

                            usuarioID: $scope.idUsuario,
                        };

                        interesFactory.insCompensacion(data).then(function(result) {
                            $scope.consecCompensacion++;


                        }, function(error) {
                            $scope.error(error.data.Message);

                        });

                    }
                });
            }
        });
    }

    $scope.$watch('consecCompensacion', function() {
        $scope.listPoliza = _.where($scope.lstNewUnits, { isChecked: true });
        if ($scope.consecCompensacion > 0 && $scope.consecCompensacion == $scope.listPoliza.length) {
            swal("Compensación", "Guardado correctamente");
            setTimeout(function() {
                console.log('Termino');
                window.location = "/compensacion";
            }, 1000);
        }

    });

});