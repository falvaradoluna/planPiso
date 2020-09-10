appModule.controller('interesController', function($scope, $rootScope, $location, filterFilter, $filter, commonFactory, staticFactory, interesFactory, esquemaFactory, alertFactory) {
    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.session = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.lstPermisoBoton = JSON.parse(sessionStorage.getItem("PermisoUsuario"));
    $scope.idUsuario = localStorage.getItem("idUsuario");
    $scope.currentEmpresa = sessionFactory.nombre;
    $scope.topBarNav = staticFactory.interesBar();
    $scope.ddlFinancialShow = false;
    $scope.showButtons = false;
    $scope.lstSucursal = [];
    $scope.lstFinancial = [];
    $rootScope.lstSchemas = [];
    $scope.lstSchemeDetail = [];
    $scope.lstNewUnits = [];
    $scope.lstSelectUnits = [];
    $scope.lstSelectPay = [];
    $scope.unitDetail = {};
    $scope.currentPanel = "pnlInteres";
    $rootScope.currentSucursalName = "Sucursal Todas";
    $rootScope.currentFinancialName = "Selecciona Financiera";
    $rootScope.currentFinancialName2 = "Selecciona Financiera";
    $rootScope.currentSchemaName2 = 'Seleccione Esquema';
    $scope.currentSucursal = [];
    $scope.currentFinancial = [];
    $scope.allUnits = { isChecked: false };
    $scope.currentFinancialID = 0;
    $scope.interesMesActual = 0;
    $scope.interesAcumulado = 0;
    $scope.interesPagado = 0;
    $scope.numUnidades = 0;
    $scope.fechaHoy = new Date();
    $scope.typeTraspaso = 0;
    $scope.TituloTraspaso = '';
    $scope.consecPago = 0;
    $scope.todos = true;
    $scope.noExisten = false;
    $rootScope.showwarningspread = false;
    $rootScope.fechainicio = '';
    $rootScope.fechafin = '';
    $rootScope.tiie = 0;
    $rootScope.puntos = 0;
    $scope.montoCompensar = 0;
    var CargarSpreadTiie = _.where($scope.lstPermisoBoton, { idModulo: 4, Boton: "CargarSpreadTiie" })[0];
    var cambiarEsquema = _.where($scope.lstPermisoBoton, { idModulo: 4, Boton: "cambiarEsquema" })[0];
    var traspasoFinanciera = _.where($scope.lstPermisoBoton, { idModulo: 4, Boton: "traspasoFinanciera" })[0];
    var pagarReduccion = _.where($scope.lstPermisoBoton, { idModulo: 4, Boton: "pagarReduccion" })[0];
    var generarPolizaInteres = _.where($scope.lstPermisoBoton, { idModulo: 4, Boton: "generarPolizaInteres" })[0];
    var compensacion = _.where($scope.lstPermisoBoton, { idModulo: 4, Boton: "compensacion" })[0];
    $scope.muestraCargarSpreadTiie = CargarSpreadTiie != undefined ? false : true;
    $scope.muestracambiarEsquema = cambiarEsquema != undefined ? false : true;
    $scope.muestratraspasoFinanciera = traspasoFinanciera != undefined ? false : true;
    $scope.muestrapagarReduccion = pagarReduccion != undefined ? false : true;
    $scope.muestragenerarPolizaInteres = generarPolizaInteres != undefined ? false : true;
    $scope.muestracompensacion = compensacion != undefined ? false : true;
    $scope.facturasCompensacion = [{
            'tipoFactura': 'Comisión Dealer',
            'cargo': 0,
            'iva': '',
            'total': 0,
            'fecha': '',
            'factura': '',
            'numeroSerie': '',
            'saldo': '',
            'tipoProducto': 'CD',
            'montoCompensar': 0
        },
        {
            'tipoFactura': 'Subsidio Dealer',
            'cargo': 0,
            'iva': '',
            'total': 0,
            'fecha': '',
            'factura': '',
            'numeroSerie': '',
            'saldo': '',
            'tipoProducto': 'PROV',
            'montoCompensar': 0
        },
        {
            'tipoFactura': 'Incentivo Penetración',
            'cargo': 0,
            'iva': '',
            'total': 0,
            'fecha': '',
            'factura': '',
            'numeroSerie': '',
            'saldo': '',
            'tipoProducto': 'IP',
            'montoCompensar': 0
        },
        {
            'tipoFactura': 'UDI por pagar',
            'cargo': 0,
            'iva': '',
            'total': 0,
            'fecha': '',
            'factura': '',
            'numeroSerie': '',
            'saldo': '',
            'tipoProducto': 'UDI',
            'montoCompensar': 0
        }
    ]
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
        if ($scope.todos == true) {
            $scope.ObtenUnidadesInteres();
        } else if ($scope.activoSeminuevos == true) {
            $scope.ObtenUnidadesInteresSeminuevas();
        } else if ($scope.activoNuevos == true) {
            $scope.ObtenUnidadesInteresNuevas();
        }

    };
    $scope.setCurrentFinancial = function(financialObj) {
        //  $scope.currentPanel = "pnlResumen";
        $scope.currentFinancialName = financialObj.nombre;
        $scope.currentFinancial = financialObj;
        $('#mdlLoading').modal('show');
        if ($scope.todos == true) {
            $scope.ObtenUnidadesInteres();
        } else if ($scope.activoSeminuevos == true) {
            $scope.ObtenUnidadesInteresSeminuevas();
        } else if ($scope.activoNuevos == true) {
            $scope.ObtenUnidadesInteresNuevas();
        }
    };
    $scope.ObtenUnidadesInteres = function() {
        $('#mdlLoading').modal('show');
        $scope.activoSeminuevos = false;
        $scope.activoNuevos = false;
        $scope.todos = true;
        $scope.initAmounts();
        interesFactory.getInterestUnits(sessionFactory.empresaID, $scope.currentSucursal.sucursalID, $scope.currentFinancial.financieraID).then(function(result) {
            $scope.setResetTable('tblUnidadesNuevas', 'Unidades Nuevas', 20);
            $scope.lstNewUnits = [];
            $scope.lstNewUnits = result.data;
            if ($scope.lstNewUnits.length == 0) {
                $scope.noExisten = true;
            } else {
                $scope.noExisten = false;
            }

            for (var i = 0; i < $scope.lstNewUnits.length; i++) {
                $scope.lstNewUnits[i].excludeField = false;
                $scope.interesPagado += $scope.lstNewUnits[i].InteresCortePagado;
                $scope.interesMesActual += $scope.lstNewUnits[i].InteresMesActual;
                $scope.interesAcumulado += $scope.lstNewUnits[i].InteresAcumulado;
                $scope.numUnidades++;
            }
        });
    }
    // Obtiene las unidades nuevas desde el tab nuevas
    $scope.ObtenUnidadesInteresNuevas = function() {
        $('#mdlLoading').modal('show');
        $scope.activoSeminuevos = false;
        $scope.activoNuevos = true;
        $scope.todos = false;
        $scope.initAmounts();
        interesFactory.getInterestUnitsNews(sessionFactory.empresaID, $scope.currentSucursal.sucursalID, $scope.currentFinancial.financieraID).then(function(result) {
            $scope.setResetTable('tblUnidadesNuevas', 'Unidades Nuevas', 20);
            $scope.lstNewUnits = [];
            $scope.lstNewUnits = result.data;
            if ($scope.lstNewUnits.length == 0) {
                $scope.noExisten = true;
            } else {
                $scope.noExisten = false;
            }

            for (var i = 0; i < $scope.lstNewUnits.length; i++) {
                $scope.lstNewUnits[i].excludeField = false;
                $scope.interesPagado += $scope.lstNewUnits[i].InteresCortePagado;
                $scope.interesMesActual += $scope.lstNewUnits[i].InteresMesActual;
                $scope.interesAcumulado += $scope.lstNewUnits[i].InteresAcumulado;
                $scope.numUnidades++;
            }
        });
    }
    //Obtiene las unidades seminuevas desde el tab seminuevas
    $scope.ObtenUnidadesInteresSeminuevas = function() {
        $('#mdlLoading').modal('show');
        $scope.activoSeminuevos = true;
        $scope.activoNuevos = false;
        $scope.todos = false;
        $scope.initAmounts();
        interesFactory.getInterestUnitsPreOwned(sessionFactory.empresaID, $scope.currentSucursal.sucursalID, $scope.currentFinancial.financieraID).then(function(result) {
            $scope.setResetTable('tblUnidadesNuevas', 'Unidades Nuevas', 20);
            $scope.lstNewUnits = [];
            $scope.lstNewUnits = result.data;
            if ($scope.lstNewUnits.length == 0) {
                $scope.noExisten = true;
            } else {
                $scope.noExisten = false;
            }

            for (var i = 0; i < $scope.lstNewUnits.length; i++) {
                $scope.lstNewUnits[i].excludeField = false;
                $scope.interesPagado += $scope.lstNewUnits[i].InteresCortePagado;
                $scope.interesMesActual += $scope.lstNewUnits[i].InteresMesActual;
                $scope.interesAcumulado += $scope.lstNewUnits[i].InteresAcumulado;
                $scope.numUnidades++;
            }
        });
    }
    $scope.setCurrentFinance2 = function(financialObj) {
        //  $scope.currentPanel = "pnlResumen";
        $rootScope.currentFinancialName2 = financialObj.nombre;
        $rootScope.currentFinancial2 = financialObj;
        $rootScope.currentSchemaName2 = 'Seleccione Esquema';
        $rootScope.currentSchema2 = [];

        // $scope.getNewUnitsBySucursal(sessionFactory.empresaID, $scope.currentSucursal.sucursalID);

        commonFactory.getSchemas(financialObj.financieraID).then(function(result) {
            $rootScope.lstSchemas = result.data;
        });
    };
    $('#mdlLoading').modal('show');

    $scope.getSchemas = function(financialId) {
        $('#mdlLoading').modal('show');
        $scope.currentSchemaName = financialId.nombre;
        commonFactory.getSchemas(financialId).then(function(result) {
            $rootScope.lstSchemas = result.data;
            // $('#mdlLoading').modal('hide');
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
        $scope.interesPagado = 0;
        $scope.interesMesActual = 0;
        $scope.interesAcumulado = 0;
        for (var i = 0; i < $scope.lstNewUnits.length; i++) {
            if (parseInt($scope.lstNewUnits[i].diasRestantes) <= days) {
                $scope.lstNewUnits[i].excludeField = false;
                $scope.interesPagado += $scope.lstNewUnits[i].InteresCortePagado;
                $scope.interesMesActual += $scope.lstNewUnits[i].InteresMesActual;
                $scope.interesAcumulado += $scope.lstNewUnits[i].InteresAcumuladoFinanciera;
                $scope.numUnidades++;
            } else {
                $scope.lstNewUnits[i].excludeField = true;
            }

        }

        if (days == 1000) {
            $scope.setResetTable('tblUnidadesNuevas', 'Unidades Nuevas', 20);
        }
        if (days == 2000) {
            for (var i = 0; i < $scope.lstNewUnits.length; i++) {
                if (parseInt($scope.lstNewUnits[i].ccs) == 3) {
                    $scope.lstNewUnits[i].excludeField = false;
                    $scope.interesPagado += $scope.lstNewUnits[i].InteresCortePagado;
                    $scope.interesMesActual += $scope.lstNewUnits[i].InteresMesActual;
                    $scope.interesAcumulado += $scope.lstNewUnits[i].InteresAcumuladoFinanciera;
                    $scope.numUnidades++;
                } else {
                    $scope.lstNewUnits[i].excludeField = true;
                }
            }
        }
        if (days == 3000) {
            for (var i = 0; i < $scope.lstNewUnits.length; i++) {
                if ($scope.lstNewUnits[i].vin.length > 0) {
                    $scope.lstNewUnits[i].excludeField = false;
                    $scope.interesPagado += $scope.lstNewUnits[i].InteresCortePagado;
                    $scope.interesMesActual += $scope.lstNewUnits[i].InteresMesActual;
                    $scope.interesAcumulado += $scope.lstNewUnits[i].InteresAcumuladoFinanciera;
                    $scope.numUnidades++;
                } else {
                    $scope.lstNewUnits[i].excludeField = true;
                }

            }
        }




    };



    $scope.getSchemas = function(financialId) {
        $('#mdlLoading').modal('show');
        commonFactory.getSchemas(financialId).then(function(result) {
            $('#tblSchemas').DataTable().destroy();
            $rootScope.lstSchemas = result.data;
            // $('#mdlLoading').modal('hide');
        });
    };



    $scope.setPnlInteres = function() {
        $scope.currentPanel = "pnlInteres";
        $scope.setResetTable('tblUnidadesNuevas', 'Unidades Nuevas', 20);
        //  location.reload();
    };

    $scope.setPnlInteresMovimientos = function() {
        $scope.currentPanel = "pnlInteresMovimientos";
    };

    $scope.setBackToDetailUnit = function(unidad) {
        $scope.currentPanel = "pnlDetalleUnidad";
    }
    /////////////////////////
    $scope.setPnlSpread = function() {
        $scope.currentPanel = "pnlSpread";
        //  location.reload();
        //  $scope.showwarningspread=true;
    };
    commonFactory.getSpreads(sessionFactory.empresaID).then(function(result) {
        if (result.data.length > 0) {
            if ($scope.lstSpreads == undefined) {
                $scope.lstSpreads = result.data[0];
                $rootScope.fechainicio = result.data[1][0].fechainicio;
                $rootScope.fechafin = result.data[1][0].fechafin;
                $rootScope.showwarningspread = result.data[1][0].showwarningspread;
                $rootScope.tiie = result.data[1][0].tiie;
                $rootScope.puntos = 0;
            }
        }
    });
    $scope.CargarNuevo = function() {
        $('#selectReporte').modal('show');
    };
    $scope.GuardarDetail = function(puntos, tiie) {
        var data = {
            idempresa: sessionFactory.empresaID,
            puntos: puntos,
            tiie: tiie,
            fechainicio: $rootScope.fechainicio,
            fechafin: $rootScope.fechafin
        };
        interesFactory.saveSpread(data).then(function(resultSchema) {

            commonFactory.getSpreads(sessionFactory.empresaID).then(function(result) {
                if (result.data.length > 0) {
                    $scope.lstSpreads = result.data[0];
                    $rootScope.fechainicio = result.data[1][0].fechainicio;
                    $rootScope.fechafin = result.data[1][0].fechafin;
                    $rootScope.showwarningspread = result.data[1][0].showwarningspread;
                    $rootScope.tiie = result.data[1][0].tiie;
                    $rootScope.puntos = 0;

                }
                $('#selectReporte').modal('hide');
                swal("Ok", "Se guardo con exito", "success");
            });
        });

    }
    $scope.setPnlRecalcular = function() {
        $scope.currentPanel = "pnlRecalcular";
        $scope.deshabilitaBoton = false;
        //  location.reload();
        commonFactory.getFinancial(sessionFactory.empresaID).then(function(result) {
            $scope.lstFinanciale = result.data;
        });
        $scope.currentFinancialeName = 'Selecciona Financiera';
    };
    $scope.setCurrentFinanciale = function(financialeObj) {
        //  $scope.currentPanel = "pnlResumen";
        $scope.currentFinancialeName = financialeObj.nombre;
        $scope.currentFinanciale = financialeObj;
        $('#mdlLoading').modal('show');
        interesFactory.Meses(financialeObj.financieraID).then(function(result) {
            $scope.lstMes = result.data;
            $('#mdlLoading').modal('hide');
        });
    };
    $scope.setCurrentMes = function(mesObj) {
        //  $scope.currentPanel = "pnlResumen";
        $scope.currentMesName = mesObj.mes;
        $scope.currentMes = mesObj;

    };
    $scope.recalculaInteres = function() {
        swal({
            title: "Recalcular Intereses",
            text: "¿Esta seguro de recalcular intereses?",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: false,
            confirmButtonText: "Recalcula",
            cancelButtonText: "Cerrar"
        }, function() {
            $('#mdlLoading').modal('show');
            $scope.deshabilitaBoton = true;
            var data = {
                financieraId: $scope.currentFinanciale.financieraID,
                anio: $scope.currentMes.anio,
                mes: $scope.currentMes.nummes
            };
            interesFactory.RecalculaInteres(data).then(function(result) {
                if (result.data.length > 0) {
                    $('#mdlLoading').modal('hide');
                    $scope.deshabilitaBoton = false;
                    swal("Ok", "Se recalculo con exito", "success");
                    $scope.setPnlInteres();
                }



            });

        });

    }
    // $scope.reporteCaratula = function() {
    //     $('#selectReporte').modal('hide');
    ///////////////////////////
    $scope.setPnlDetalleUnidad = function(unidad) {
        historiaFolios(unidad.CCP_IDDOCTO);
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
                $scope.lstInteresesMov = resultSchema.data[3];
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

    $scope.regresarTraspaso = function() {
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
        staticFactory.setTableStyleClass('.' + tblID, display, length)
        // $('.' + tblID).DataTable().clear();
        // $('.' + tblID).DataTable().destroy();
        // setTimeout(function() {
        //     $('.' + tblID).DataTable({
        //         "scrollX": true,
        //         fixedColumns: {
        //             leftColumns: 1
        //         }
        //     });
        //     // staticFactory.filtrosTabla(tblID, display, length);
        // }, 100);
        $('#mdlLoading').modal('hide');
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



    $scope.PagoReduccion = function() {
        swal({
                title: "¿Esta seguro?",
                text: "Se aplicará el pago de reducción para las unidades seleccionadas.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#21B9BB",
                confirmButtonText: "Pagar",
                closeOnConfirm: false
            },
            function() {

                var paraReduccion = {
                    idUsuario: $scope.idUsuario,
                    idEmpresa: sessionFactory.empresaID,
                    idtipopoliza: 10 //pago reduccion
                }

                interesFactory.ReduccionFinanciera(paraReduccion).then(function(respuesta) {
                    $scope.LastId = respuesta.data[0].LastId;
                    $scope.lstUnitsReduccions = filterFilter($scope.lstNewUnits, { isChecked: true });
                    $scope.guardaReduccionDetalle();
                }, function(error) {
                    $scope.error(error.data.Message);
                });


            }
        );
    };
    $scope.LastId = 0;
    var contReduccionDetalle = 0;
    $scope.guardaReduccionDetalle = function() {
        if (contReduccionDetalle < $scope.lstUnitsReduccions.length) {
            var item = $scope.lstUnitsReduccions[contReduccionDetalle];
            var paraReduccionDetalle = {
                idpoliza: $scope.LastId,
                idmovimiento: item.movimientoID,
                idUsuario: $scope.idUsuario,
                saldo: item.pagoReduccion
            }

            interesFactory.ReduccionFinancieraDetalle(paraReduccionDetalle).then(function(response) {
                if (response.length != 0) {
                    if (contReduccionDetalle < $scope.lstUnitsReduccions.length) {
                        contReduccionDetalle++;
                        $scope.guardaReduccionDetalle();
                    }
                }
            }, function(error) {
                $scope.error(error.data.Message);
            });
        } else {
            angular.forEach($scope.lstUnitsReduccions, function(value, key) {
                value.idUsuario = $scope.idUsuario;
                value.idPoliza = $scope.LastId;
                value.estatus = 1;
            });
            interesFactory.insertaDocumentosLote($scope.lstUnitsReduccions).then(function success(result) {
                console.log(result);
                window.location = "/guardarLote?idPre=" + $scope.LastId;
            }, function error(err) {
                console.log(err)
            });
            // swal("Reduccion Plan Piso", "Se ha efectuado correctamente su Reduccion.");
            //Se agrega ir a crear lote de pago 
            // $scope.lstUnitsReduccions
            // interesFactory.procesaReduccion($scope.LastId).then(function( response ) {
            //     if( response.length != 0 ){
            //         swal(
            //         {
            //             title: "Reducción Plan Piso",
            //             text: "Se ha efectuado correctamente su Reducción.",
            //             type: "warning"
            //         }, function(){
            //             location.reload();
            //         });
            //     }
            // }, function(error) {
            //     $scope.error(error.data.Message);
            // });
        }
    }
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
            if ($scope.lstNewUnits[i].isChecked === true) {
                return true;
            }
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
    $scope.CrearProvision = function() {
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
                var paraProvision = {
                    idUsuario: $scope.idUsuario,
                    idEmpresa: sessionFactory.empresaID,
                    idtipopoliza: 7 //cambio de financiera
                }

                interesFactory.getProvisionToday(paraProvision).then(function(respuesta) {
                    $scope.LastId = respuesta.data[0].LastId;
                    $scope.lstUnitsProvisions = filterFilter($scope.lstNewUnits, { isChecked: true });
                    $scope.guardaProvisionDetalle();
                }, function(error) {
                    $scope.error(error.data.Message);
                });

            }

        });
    }
    var contProvisionDetalle = 0;
    $scope.guardaProvisionDetalle = function() {
        if (contProvisionDetalle < $scope.lstUnitsProvisions.length) {
            var item = $scope.lstUnitsProvisions[contProvisionDetalle];
            var paraProvisionDetalle = {
                idpoliza: $scope.LastId,
                idmovimiento: item.movimientoID,
                idUsuario: $scope.idUsuario,
                saldo: item.InteresMes
            }

            interesFactory.ProvisionFinancieraDetalle(paraProvisionDetalle).then(function(response) {
                if (response.length != 0) {
                    if (contProvisionDetalle < $scope.lstUnitsProvisions.length) {
                        contProvisionDetalle++;
                        $scope.guardaProvisionDetalle();
                    }
                }
            }, function(error) {
                $scope.error(error.data.Message);
            });
        } else {
            // swal("Provision Plan Piso", "Se ha efectuado correctamente su Provision.");
            interesFactory.procesaReduccion($scope.LastId).then(function(response) {
                if (response.length != 0) {
                    swal({
                        title: "Provisión Plan Piso",
                        text: "Se ha efectuado correctamente su Provisión.",
                        type: "warning"
                    }, function() {
                        location.reload();
                    });
                }
            }, function(error) {
                $scope.error(error.data.Message);
            });
        }
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
        $scope.montoTotal = 0;
        $scope.compra = 0;
        $scope.saldoCompensar = 0;
        $scope.diferenciaPP = 0;
        $scope.facturasTotal = [];
        if ($scope.haveSelection() === false) {
            swal("Aviso", "No se ha seleccionado ningun registro", "warning");
        } else {
            // $scope.listValida = _.where($scope.lstNewUnits, { sePago: true });
            seleccionados();
            if ($scope.unidadesSeleccionadas > 1) {
                swal("Aviso", "Solo se puede seleccionar uno a la vez.", "warning");
            } else {
                $scope.lstNewUnits.forEach(function(item) {
                    if (item.isChecked === true) {
                        $scope.unidadCompensacion = item;
                        console.log(item, 'SOY EL SELECCIONADO');
                        var facturas = [];
                        facturas.push(interesFactory.facturaUnidad(item.empresaID, item.sucursalID, item.CCP_IDDOCTO));
                        facturas.push(interesFactory.facturaTramites(item.empresaID, item.sucursalID, item.CCP_IDDOCTO));
                        facturas.push(interesFactory.facturaServicios(item.empresaID, item.sucursalID, item.CCP_IDDOCTO));
                        facturas.push(interesFactory.facturaOT(item.empresaID, item.sucursalID, item.CCP_IDDOCTO));
                        facturas.push(interesFactory.facturaAccesorios(item.empresaID, item.sucursalID, item.CCP_IDDOCTO));
                        // facturas.push(interesFactory.notaCredito(item.empresaID, item.sucursalID, item.CCP_IDDOCTO));

                        Promise.all(facturas).then(function(results) {
                            console.log(results, 'Facturaaaas')
                            var contadorFacturas = 0;
                            angular.forEach(results, function(value, key) {
                                console.log(value.data.length);
                                if (value.data.length > 0) {
                                    angular.forEach(value.data, function(value2, key) {
                                        // if (value2.tipoProducto != 'NCR') {
                                        $scope.montoTotal = $scope.montoTotal + value2.saldo;
                                        // } else if (value2.tipoProducto == 'NCR') {
                                        //     $scope.compra = $scope.montoTotal - value2.cargo;
                                        //     $scope.documentoNCR = value2.factura;
                                        //     $scope.importeNCR = value2.cargo;
                                        // }

                                        // value2.montoCompensar = value2.cargo - $scope.unidadCompensacion.importe;
                                        if (value2.saldo > $scope.unidadCompensacion.saldo) {
                                            value2.montoCompensar = $scope.unidadCompensacion.saldo;
                                        } else {
                                            value2.montoCompensar = value2.saldo;
                                        }
                                        value2.montoCompensar = value2.montoCompensar.toFixed(2);
                                        if (value2.tipoProducto == 'FU') {
                                            $scope.saldoFU = value2.montoCompensar;
                                        }
                                        $scope.$apply(function() {
                                            $scope.facturasTotal.push(value2);
                                        });

                                        contadorFacturas++;
                                    });
                                }
                            });
                            interesFactory.enganche(item.vehNumserie).then(function success(result) {
                                console.log(result.data[0], 'COTIZACION')
                                $scope.engancheCotizacion = result.data[0];
                                $scope.financieraCotizacion = result.data[0].nombre;
                                // $scope.$apply(function() {

                                $scope.diferenciaPP = $scope.montoTotal - $scope.engancheCotizacion.ucu_impenganche;
                                $scope.saldoCompensar = $scope.montoTotal - $scope.engancheCotizacion.ucu_impenganche;
                                $scope.saldoCompensar = $scope.saldoCompensar.toFixed(2);
                                // $scope.unidadCompensacion.montoCompensar = $scope.unidadCompensacion.montoCompensar; 
                                $scope.unidadCompensacion.montoCompensar = $scope.unidadCompensacion.saldo;
                                $scope.unidadCompensacion.montoCompensar = $scope.unidadCompensacion.montoCompensar.toFixed(2);
                                $scope.saldoFU = $scope.saldoFU - $scope.engancheCotizacion.ucu_impenganche;
                                console.log($scope.unidadCompensacion.montoCompensar, 'MMMTTAAAA')
                                // });
                            }, function err(error) {
                                console.log(error)
                            });

                            if (contadorFacturas > 0) {
                                $scope.currentPanel = "pnlCompensacion";
                            } else {
                                swal("Aviso", "No se puede compensar este documento.", "warning");
                            }
                            console.log($scope.facturasTotal, 'TOTAL FACTURAS');
                        });
                        // interesFactory.facturaUnidad(item.empresaID, item.sucursalID, item.CCP_IDDOCTO).then(function success(result) {
                        //     console.log(result.data);
                        // }, function error(err) {
                        //     console.log(err, 'Ocurrio un error al cargar la factura')
                        // });
                        // interesFactory.facturaTramites(item.empresaID, item.sucursalID, item.CCP_IDDOCTO).then(function success(result) {
                        //     console.log(result.data);
                        // }, function error(err) {
                        //     console.log(err, 'Ocurrio un error al cargar la factura')
                        // });
                        // interesFactory.facturaServicios(item.empresaID, item.sucursalID, item.CCP_IDDOCTO).then(function success(result) {
                        //     console.log(result.data);
                        // }, function error(err) {
                        //     console.log(err, 'Ocurrio un error al cargar la factura')
                        // });
                        // interesFactory.facturaOT(item.empresaID, item.sucursalID, item.CCP_IDDOCTO).then(function success(result) {
                        //     console.log(result.data);
                        // }, function error(err) {
                        //     console.log(err, 'Ocurrio un error al cargar la factura')
                        // });
                        // interesFactory.facturaAccesorios(item.empresaID, item.sucursalID, item.CCP_IDDOCTO).then(function success(result) {
                        //     console.log(result.data);
                        // }, function error(err) {
                        //     console.log(err, 'Ocurrio un error al cargar la factura')
                        // });

                    }
                });
            }

        }
    };
    var seleccionados = function() {
        $scope.unidadesSeleccionadas = 0;
        for (var i = 0; i < $scope.lstNewUnits.length; i++) {
            if ($scope.lstNewUnits[i].isChecked === true) {
                $scope.unidadesSeleccionadas++;
            }
        }
    };
    // $scope.callCompensation = function() {
    //     $scope.consecCompensacion = 0;

    //     if ($scope.haveSelection() === false) {
    //         swal("Aviso", "No se ha seleccionado ningun registro", "warning");
    //     } else {
    //         $scope.listValida = _.where($scope.lstNewUnits, { sePago: true });
    //         if ($scope.listValida.length > 1) {
    //             swal("Aviso", "Solo se puede seleccionar uno a la vez.", "warning");
    //         } else {
    //             $scope.lstNewUnits.forEach(function(item) {
    //                 if (item.isChecked === true) {
    //                     var data = {
    //                         CCP_IDDOCTO: item.CCP_IDDOCTO
    //                     };

    //                     interesFactory.GetCompensacion(data).then(function(result) {
    //                         $scope.currentPanel = "pnlCompensacion";
    //                         $scope.saldoFinanciera = result.data[0].saldoFinanciera;
    //                         $scope.precioUnidad = result.data[0].precioUnidad;
    //                         $scope.anticipoUnidad = result.data[0].anticipoUnidad;
    //                         $scope.saldoCliente = $scope.precioUnidad - $scope.anticipoUnidad;
    //                         $scope.diferenciaSaldo = $scope.precioUnidad - $scope.saldoFinanciera;
    //                         if ($scope.saldoFinanciera - $scope.saldoCliente > 0) {
    //                             $scope.saldoCompensar = $scope.saldoCliente;
    //                         } else {
    //                             $scope.saldoCompensar = $scope.saldoFinanciera;
    //                         }
    //                     }, function(error) {
    //                         $scope.error(error.data.Message);

    //                     });

    //                 }
    //             });
    //         }

    //     }
    // }


    $scope.setPnlCompensacion = function() {
        $scope.currentPanel = "pnlCompensacion";
    };
    $scope.setPnlCompensacionResumen = function(saldoCompensar) {
        var isok = 0;
        if (saldoCompensar - $scope.saldoFinanciera <= 0) {
            $scope.currentPanel = "pnlCompensacionResumen";
            $scope.saldoCompensar = saldoCompensar;
        } else {
            // swal("Aviso", "No puede ser mayor el saldo a compensar que el saldo e la financiera", "warning");
            swal({
                title: "¿Esta seguro?",
                text: "Se creara la compensación de la unidad  para la unidad seleccionada.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#21B9BB",
                confirmButtonText: "Aplicar",
                closeOnConfirm: true
            }, function() {
                $('#mdlLoading').modal('hide');
                var paraCompensacion = {
                    idUsuario: $scope.idUsuario,
                    idEmpresa: sessionFactory.empresaID,
                    idtipopoliza: 8 //cambio de financiera
                }

                interesFactory.cabeceraPoliza(paraCompensacion).then(function(respuesta) {
                    $scope.LastId = respuesta.data[0].LastId;
                    $scope.lstUnitsCompensacion = filterFilter($scope.lstNewUnits, { isChecked: true });
                    $scope.guardaCompensacionDetalle();
                }, function(error) {
                    $scope.error(error.data.Message);
                });
                // $scope.setPnlInteres();
            });

        }
    };
    $scope.guardaCompensacionDetalle = function() {
        var tiempo = new Date().toLocaleTimeString();
        var item = $scope.lstUnitsCompensacion[0];
        var paraCompensacionDetalle = {
            idpoliza: $scope.LastId,
            idmovimiento: item.movimientoID,
            idUsuario: $scope.idUsuario,
            saldo: item.InteresMes,
            tiempo: tiempo
        }

        interesFactory.compensacionDetalle(paraCompensacionDetalle).then(function(response) {
            detalleBproCompensacion(tiempo);
            // $scope.setPnlInteres();
        }, function(error) {
            $scope.error(error.data.Message);
        });

    };
    var detalleBproCompensacion = function(tiempo) {
        var item = $scope.lstUnitsCompensacion[0];
        // var d = new Date();
        // var hora = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

        var tiempo = tiempo;
        // Agrego al arreglo la de compra  
        var saldoNcr = 0;
        var FacturaUN = 0;
        angular.forEach($scope.facturasTotal, function(value, key) {
            if (value.tipoProducto == 'FA' && value.garantia == 1) {
                saldoNcr = value.montoCompensar * 0.75;
                FacturaUN = value.factura;
                console.log(saldoNcr, 'El saldo de la nota de credito')
                //Agrego el arreglo del PAG
                // $scope.facturasTotal.push({
                //     'tipoFactura': 'Compra',
                //     'cargo': saldoNcr,
                //     'iva': '',
                //     'total': saldoNcr,
                //     'fecha': '',
                //     'factura': value.factura,
                //     'numeroSerie': '',
                //     'saldo': '',
                //     'tipoProducto': 'NCR',
                //     'montoCompensar': saldoNcr
                // });
                $scope.facturasTotal.push({
                    'tipoFactura': 'PAG',
                    'cargo': saldoNcr,
                    'iva': '',
                    'total': saldoNcr,
                    'fecha': '',
                    'factura': value.factura,
                    'numeroSerie': '',
                    'saldo': '',
                    'tipoProducto': 'PAG',
                    'montoCompensar': saldoNcr
                });
            }
        });
        angular.forEach($scope.facturasCompensacion, function(value, key) {
            if (value.montoCompensar > 0) {
                $scope.facturasTotal.push(value);
                if (value.tipoProducto == 'PROV') {
                    // $scope.facturasTotal.push({
                    //     'tipoFactura': 'DEALER',
                    //     'cargo': value.montoCompensar,
                    //     'iva': '',
                    //     'total': value.montoCompensar,
                    //     'fecha': '',
                    //     'factura': '',
                    //     'numeroSerie': '',
                    //     'saldo': '',
                    //     'tipoProducto': 'PROV',
                    //     'montoCompensar': value.montoCompensar
                    // });
                    $scope.facturasTotal.push({
                        'tipoFactura': 'DEALER',
                        'cargo': value.montoCompensar,
                        'iva': '',
                        'total': value.montoCompensar,
                        'fecha': '',
                        'factura': FacturaUN,
                        'numeroSerie': '',
                        'saldo': '',
                        'tipoProducto': 'PLP',
                        'montoCompensar': value.montoCompensar
                    });
                }
            }
        });
        console.log($scope.saldoCompensar - saldoNcr, 'COMPRA');
        $scope.facturasTotal.push({
            'tipoFactura': 'Compra',
            'cargo': $scope.unidadCompensacion.montoCompensar,
            'iva': '',
            'total': $scope.unidadCompensacion.montoCompensar,
            'fecha': '',
            'factura': $scope.unidadCompensacion.CCP_IDDOCTO,
            'numeroSerie': '',
            'saldo': '',
            'tipoProducto': 'COMPRA'
        });

        var paraCompensacionDetalle;
        var promises = [];
        var auxConta = 1;
        $scope.facturasTotal.map((value) => {
            switch (value.tipoProducto) {
                case 'FU':
                    paraCompensacionDetalle = {
                        idpoliza: $scope.LastId,
                        idmovimiento: item.movimientoID,
                        idUsuario: $scope.idUsuario,
                        saldo: $scope.saldoFU,
                        tipoProducto: value.tipoProducto,
                        documento: value.factura,
                        tiempo: tiempo,
                        consecutivo: auxConta
                    }
                    break;
                case 'COMPRA':
                    paraCompensacionDetalle = {
                        idpoliza: $scope.LastId,
                        idmovimiento: item.movimientoID,
                        idUsuario: $scope.idUsuario,
                        saldo: $scope.saldoCompensar - saldoNcr,
                        tipoProducto: value.tipoProducto,
                        documento: value.factura,
                        tiempo: tiempo,
                        consecutivo: auxConta
                    }
                    var preLoteCompensacion = [{
                        'CCP_IDDOCTO': $scope.unidadCompensacion.CCP_IDDOCTO,
                        'idUsuario': $scope.idUsuario,
                        'idPoliza': $scope.LastId,
                        'pagoCompensacion': $scope.unidadCompensacion.saldo - $scope.saldoCompensar - saldoNcr,
                        'estatus': 1
                    }];
                    interesFactory.insertaDocumentosLoteCompensacion(preLoteCompensacion).then(function(result) {
                        console.log(result)
                    }, function err(error) {
                        console.log(error)
                    });
                    break;
                default:
                    paraCompensacionDetalle = {
                        idpoliza: $scope.LastId,
                        idmovimiento: item.movimientoID,
                        idUsuario: $scope.idUsuario,
                        saldo: value.montoCompensar,
                        tipoProducto: value.tipoProducto,
                        documento: value.factura,
                        tiempo: tiempo,
                        consecutivo: auxConta
                    }
            }
            console.log(paraCompensacionDetalle, 'Lo que insertare de facturas')
            promises.push(interesFactory.detalleBproCompensacion(paraCompensacionDetalle));
            auxConta++;
        });
        Promise.all(promises).then(function response(result) {
            console.log(result);
            $('#mdlLoading').modal('hide');
            swal("Ok", "Finalizó con exito", "success");
            setTimeout(function() {
                window.location = "/interes";
            }, 1000);
        });
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
    $scope.sumaCompensar = function(factura, index, oldValue) {
        console.log(factura, index, event)
        if (factura.montoCompensar <= factura.saldo) {
            if (factura.montoCompensar <= $scope.unidadCompensacion.montoCompensar) {
                $scope.facturasTotal[index].montoCompensar = factura.montoCompensar;
                //unidadCompensacion
                var auxSumaCxc = 0;
                var auxSumaCxcTotal = 0;
                // $scope.auxSumaCxp = 0;
                // $scope.auxSumaCxp = $scope.auxSumaCxp + $scope.unidadCompensacion.montoCompensar;
                // totalCompensar();
                angular.forEach($scope.facturasTotal, function(value, key) {
                    if (value.tipoProducto == 'FU') {
                        auxSumaCxc = value.montoCompensar
                    }
                    auxSumaCxcTotal = auxSumaCxcTotal + Number(value.montoCompensar);
                });
                if (auxSumaCxcTotal <= $scope.unidadCompensacion.montoCompensar) {
                    $scope.saldoFU = auxSumaCxc;
                    $scope.saldoCompensar = auxSumaCxcTotal;
                    $scope.saldoCompensar = $scope.saldoCompensar.toFixed(2);
                } else {
                    $scope.facturasTotal[index].montoCompensar = oldValue;
                    alertFactory.warning('No puede ingresar un valor mayor al monto a compensar');
                }

            } else {
                $scope.facturasTotal[index].montoCompensar = oldValue;
                alertFactory.warning('No puede ingresar un valor mayor al monto a compensar');
            }
        } else {
            $scope.facturasTotal[index].montoCompensar = oldValue;
            alertFactory.warning('No puede ingresar un valor mayor al saldo');
        }

    };
    $scope.sumaCompensarCxP = function(newValue, oldValue) {
        console.log(newValue, oldValue, 'CuentasXpagar')
        if (newValue <= $scope.unidadCompensacion.saldo) {
            $scope.unidadCompensacion.montoCompensar = newValue;
        } else {
            $scope.unidadCompensacion.montoCompensar = oldValue;
            alertFactory.warning('No puede ingresar un valor mayor al saldo');
        }
    };
    var totalCompensar = function() {
        $scope.montoCompensar = $scope.auxSumaCxp;
    };
    ///////////////////////////////
    /////traspaso sucursal
    ///////////////////////////////
    $scope.TraspasoSucursal = function(unidad) {
        $scope.unidad = unidad;
        $('#modaltraspasoSucursal').modal('show');
        interesFactory.Refacciones(unidad.sucursalID, unidad.vin).then(function(result) {
            $scope.lstRefacciones = result.data;
        });
    }

    /////////////////////////////
    ///////////////////////////
    // Obtiene historial de folios
    var historiaFolios = function(folio) {
        interesFactory.historiaFolios(folio).then(function(result) {
            console.log(result.data, 'HISTORIAL');
            $scope.historialFolios = result.data;
            var promises = [];
            $scope.historialFolios.map((value) => {
                promises.push(interesFactory.movimientosFolio(value.oce_folioorden));
            })
            Promise.all(promises).then(function response(result) {
                var respuesta = result;
                console.log(respuesta);
                angular.forEach($scope.historialFolios, function(value, key) {
                    console.log(respuesta[key].data, 'que pasa');
                    value.detalle = respuesta[key].data;
                });
                console.log($scope.historialFolios, 'Como quedo')
            });
        }, function error(err) {
            console.log('Ocurrio un error al tratar de obtener el historial de los folios', err);
        });
        interesFactory.historialCotizacion(folio).then(function success(result) {
            console.log(result.data)
            $scope.cotizacionHistorial = result.data;
            if ($scope.cotizacionHistorial.length > 0) {
                var facturas = [];
                $scope.cotizacionHistorial.map((value) => {
                    facturas.push(interesFactory.facturaUnidadH(value.ucu_idempresa, value.ucu_idsucursal, folio));
                    facturas.push(interesFactory.facturaTramitesH(value.ucu_idempresa, value.ucu_idsucursal, folio));
                    facturas.push(interesFactory.facturaServiciosH(value.ucu_idempresa, value.ucu_idsucursal, folio));
                    facturas.push(interesFactory.facturaOTH(value.ucu_idempresa, value.ucu_idsucursal, folio));
                    facturas.push(interesFactory.facturaAccesoriosH(value.ucu_idempresa, value.ucu_idsucursal, folio));
                })


                Promise.all(facturas).then(function(results) {
                    var resultadoFacturas = results
                    $scope.cotizacionHistorial[0].detalle = [];
                    angular.forEach(resultadoFacturas, function(value, key) {
                        if (value.data.length > 0) {
                            angular.forEach(value.data, function(value2, key) {
                                $scope.$apply(function() {
                                    $scope.cotizacionHistorial[0].detalle.push(value2);
                                });
                            });
                        }
                    });
                    console.log($scope.cotizacionHistorial, 'Queda Cotizacion')
                });
            }
        }, function error(err) {
            console.log(err)
        });
    };
    $scope.movimientoscxp = function(folio) {
        $scope.movimientos = [];
        $scope.documentoModal = "";
        $scope.documentoModal = folio;
        interesFactory.movimientoscxp(folio).then(function success(result) {
            console.log(result.data);
            $scope.movimientos = result.data;
            $("#movimientoDocumento").modal('show');
        }, function error(err) {
            console.log(err, 'Ocurrio un error al obtener los movimientos')
        });
    };
    $scope.movimientocxc = function(folio, documento) {
        $scope.movimientos = [];
        $scope.documentoModal = "";
        $scope.documentoModal = folio;
        interesFactory.movimientoscxc(folio, documento).then(function success(result) {
            console.log(result.data);
            $scope.movimientos = result.data;
            $("#movimientoDocumento").modal('show');
        }, function error(err) {
            console.log(err, 'Ocurrio un error al obtener los movimientos')
        });
    };
    // 

});