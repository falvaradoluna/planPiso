appModule.controller('unuevasController', function($scope, $rootScope, $location, unuevasFactory, commonFactory, staticFactory) {
    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.idUsuario = localStorage.getItem("idUsuario");
    $scope.lstPermisoBoton = JSON.parse(sessionStorage.getItem("PermisoUsuario"));

    $scope.currentEmpresa = sessionFactory.nombre;
    $scope.topBarNav = unuevasFactory.topNavBar();
    $scope.steps = unuevasFactory.stepsBar();
    $scope.totalUnidades = 0;
    $scope.currentStep = 0;
    $scope.userID = 875;
    $scope.currentPanel = $scope.steps[0].panelName;
    $scope.lstSucursal = [];
    $scope.lstNewUnits = [];
    $scope.lstFinancial = [];
    $scope.lstSchemas = [];
    $scope.selectedSchema = [];
    $scope.listPoliza = [];
    $scope.incremental = 0;
    $scope.currentSucursalName = "Sucursal Todas";
    $scope.currentFinancialName = "Seleccionar Financiera";

    $scope.allUnits = { isChecked: false };
    $scope.ddlFinancialShow = false;
    $scope.showStep = 1;
    $scope.SucursalSel = [];
    $scope.FinancieraSel = [];

    $('#mdlLoading').modal('show');
    var finalizar = _.where($scope.lstPermisoBoton, { idModulo: 1, Boton: "finalizar" })[0];
    $scope.muestrafinalizar = finalizar != undefined ? false : true;


    commonFactory.getSucursal(sessionFactory.empresaID, $scope.idUsuario).then(function(result) {
        $scope.lstSucursal = result.data;
        var promises = [];
        $scope.lstSucursal.map((value) => {
            promises.push(unuevasFactory.getNewUnitsBySucursal(sessionFactory.empresaID, value.sucursalID, null));
        })
        Promise.all(promises).then(function response(result) {
            console.log(result, 'UNIDADEEEES');
            angular.forEach(result, function(value, key) {
                var unidadesFor = value.data;
                // $scope.lstNewUnits.push(value.data);
                angular.forEach(unidadesFor, function(value2, key2) {
                    $scope.lstNewUnits.push(value2);
                });
            });
            console.log($scope.lstNewUnits);
            $scope.initTblUnidadesNuevas();
            $scope.$apply(function() {
                $scope.lstNewUnits;
            });
            $('#mdlLoading').modal('hide');
        });
    });

    // unuevasFactory.getNewUnits(sessionFactory.empresaID).then(function(result) {
    //     $scope.lstNewUnits = result.data;
    //     $scope.initTblUnidadesNuevas();
    //     $('#mdlLoading').modal('hide');
    // });

    $scope.setCurrentSucursal = function(sucursalObj) {
        $scope.SucursalSel = sucursalObj;
        $('#mdlLoading').modal('show');
        $scope.totalUnidades = 0;
        $scope.currentSucursalName = sucursalObj.nombreSucursal;
        $scope.getNewUnitsBySucursal(sessionFactory.empresaID, sucursalObj.sucursalID, $scope.FinancieraSel.financieraID);
        commonFactory.getFinancial(sessionFactory.empresaID, $scope.idUsuario).then(function(result) {
            $scope.lstFinancial = result.data;
            $scope.ddlFinancialShow = true;
        });

    };

    $scope.getNewUnitsBySucursal = function(empresaID, sucursalID, financieraID) {
        $('#tblUnidadesNuevas').DataTable().destroy();
        unuevasFactory.getNewUnitsBySucursal(empresaID, sucursalID, financieraID).then(function(result) {
            $scope.lstNewUnits = result.data;
            $scope.initTblUnidadesNuevas();
            $('#mdlLoading').modal('hide');
        });
    };

    $scope.setCurrentFinancialHead = function(financialObj) {
        $scope.FinancieraSel = financialObj;
        $('#mdlLoading').modal('show');
        $scope.currentFinancialName = financialObj.nombre;
        $scope.getNewUnitsBySucursal(sessionFactory.empresaID, $scope.SucursalSel.sucursalID, $scope.FinancieraSel.financieraID);
        $scope.getSchemas($scope.FinancieraSel.financieraID);
    };
    $scope.setCurrentFinancial = function() {
        $scope.listUnidades = _.where($scope.lstNewUnits, { isChecked: true });
        $scope.currentFinancialName = $scope.listUnidades[0].nombreFinanciera;
        $scope.getSchemasBP($scope.listUnidades[0].idPersona);
    };

    $scope.getSchemas = function(financieraID) {
        commonFactory.getSchemas(financieraID).then(function(result) {
            $('#tblSchemas').DataTable().destroy();
            $scope.lstSchemas = result.data;
        });
    };
    $scope.getSchemasBP = function(financieraID, idempresa) {
        commonFactory.getSchemasBP(financieraID, idempresa).then(function(result) {
            $('#tblSchemas').DataTable().destroy();
            $scope.lstSchemas = result.data;
        });
    };
    $scope.checkAllUnits = function() {

        for (var i = 0; i < $scope.lstNewUnits.length; i++) {
            $scope.lstNewUnits[i].isChecked = $scope.allUnits.isChecked;
        }

    };

    $scope.uncheckSchemas = function(itemSchemas) {
        for (var i = 0; i < $scope.lstSchemas.length; i++) {
            $scope.lstSchemas[i].isChecked = false;
        }
        itemSchemas.isChecked = true;
        $scope.selectedSchema = itemSchemas;
    };


    $scope.nextStep = function() {
        if ($scope.currentStep == 0) {
            var contador = 0;
            angular.forEach($scope.lstNewUnits, function(value, key) {
                if (value.isChecked === true) {
                    contador++;
                }
            });
            if (contador === 0) {
                swal("Aviso", "No ha seleccionado ningun documento", "warning");
                return;
            } else {
                $scope.setCurrentFinancial();
            }
        }
        if ($scope.currentStep === 1 && $scope.selectedSchema.esquemaID === undefined) {
            swal("Aviso", "No ha seleccionado un esquema", "warning");
            return;
        } else if (($scope.currentStep + 1) < $scope.steps.length) {
            $scope.steps[$scope.currentStep].className = "visited";
            $scope.currentStep++;
            $scope.showStep = $scope.currentStep + 1;
            $scope.currentPanel = $scope.steps[$scope.currentStep].panelName;
            $scope.steps[$scope.currentStep].className = "active";
            $scope.showFilterButtons($scope.currentStep);
            if ($scope.currentStep == 2) {
                angular.forEach($scope.lstNewUnits, function(value, key) {
                    if (value.isChecked === true) {
                        value.plazo = $scope.selectedSchema.plazo;
                        value.diasgracia = $scope.selectedSchema.diasGracia;
                        value.fechaRecibo = staticFactory.DateFormat(regresafechareal(value.fechaCalculoString));
                        value.fechainicio = regresafechareal(value.fechaCalculoString);
                        value.fechafin = sumarDias(regresafechareal(value.fechaCalculoString), value.plazo);
                    }
                });

            }
        }
    };

    function sumarDias(fecha, dias) {



        var dateObject = new Date(fecha);

        fecha = dateObject.setSeconds(dias * 86400);
        return fecha;
    }

    function regresafechareal(fecha) {
        var dateParts = fecha.split("/");


        var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);


        return dateObject;
    }

    $scope.Cambiarfecha = function(fecha, unidad) {
        angular.forEach($scope.lstNewUnits, function(value, key) {
            if (value.isChecked === true && value.$$hashkey == unidad.$$hashkey) {
                value.plazo = $scope.selectedSchema.plazo;
                value.diasgracia = $scope.selectedSchema.diasGracia;
                value.fechainicio = value.fechaRecibo;
                value.fechafin = sumarDias(value.fechaRecibo, value.plazo);
            }
        });
    }
    $scope.prevStep = function() {
        if (($scope.currentStep - 1) >= 0) {
            $scope.steps[$scope.currentStep].className = "visited";
            $scope.showStep = $scope.currentStep;
            $scope.currentStep--;
            $scope.currentPanel = $scope.steps[$scope.currentStep].panelName;
            $scope.steps[$scope.currentStep].className = "active";
            $scope.showFilterButtons($scope.currentStep);
        }
    };

    $scope.initTblUnidadesNuevas = function() {
        $scope.setTableStyle('#tblUnidadesNuevas');
        $scope.totalUnidades = $scope.lstNewUnits.length;
        $scope.setCalendarStyle();
    };

    $scope.setTableStyle = function(tableID) {
        staticFactory.setTableStyleOne(tableID);
    };


    $scope.setCalendarStyle = function() {
        staticFactory.setCalendarStyle();
    };


    $scope.showFilterButtons = function(step) {
        if (step === 0)
            $scope.ddlFinancialShow = false;
        else
            $scope.ddlFinancialShow = true;
    };

    $scope.showMsg = function() {
        unuevasFactory.assignMesage($scope.setSchema);
    };

    $scope.setSchema = function() {

        $scope.listPoliza = _.where($scope.lstNewUnits, { isChecked: true });
        $scope.incremental = 0;
        $scope.guardandoPoliza();


    };
    $scope.guardandoPoliza = function() {
        var saplica = 0;
        var item = $scope.listPoliza[$scope.incremental];

        var data = {
            CCP_IDDOCTO: item.CCP_IDDOCTO,
            userID: $scope.userID,
            esquemaID: $scope.selectedSchema.esquemaID,
            saldoInicial: item.SALDO,
            interes: parseFloat(item.interes),
            fechaCalculo: staticFactory.toISODate(item.fechaCalculoString),
            fechainicio: staticFactory.todayDateGiven(item.fechainicio),
            fechafin: staticFactory.todayDateGiven(item.fechafin),
            diasgracia: item.diasgracia
        };

        unuevasFactory.setUnitSchema(data).then(function(result) {

            var insercion = result;
            console.log("insercion", insercion);

            if (insercion.status == 200) {

                $scope.incremental++;

                if ($scope.incremental < $scope.listPoliza.length) {
                    $scope.guardandoPoliza();
                } else {
                    $scope.incremental = 0;
                    $scope.consecNum = 0;
                    swal("Unidades asignadas", "Guardado correctamente");
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
    $scope.success = function() {
        swal("Ok", "Asignación finalizó con exito", "success");
        setTimeout(function() {
            window.location = "/unuevas";
        }, 5000);
    };


});