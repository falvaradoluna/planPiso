appModule.controller('pagoInteresController', function($scope, $rootScope, $location, commonFactory, staticFactory, pagoInteresFactory, uiGridConstants, uiGridGroupingConstants, utils, $window, conciliacionFactory, alertFactory, crealoteFactory, $timeout, sacarunidadFactory) {
    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.lstPermisoBoton = JSON.parse(sessionStorage.getItem("PermisoUsuario"));
    $scope.idUsuario = localStorage.getItem("idUsuario");
    $scope.currentEmpresa = sessionFactory.nombre;
    $scope.topBarNav = staticFactory.pagoInteresBar();
    $scope.currentCuentaName = "Seleccione cuenta";
    pagoInteresFactory.getDocumentosPagos(sessionFactory.empresaID).then(function success(result) {
        console.log(result.data, 'Documentos Pagos')
        $scope.documentosPago = result.data;
    }, function error(err) {
        console.log('Ocurrio un error al tratar de obtener los documentos de pagos');
    });
    crealoteFactory.getLotes(sessionFactory.empresaID).then(function success(result) {
        console.log('SOY LOS LOTES', result.data)
        $scope.lotes = result.data;
        var date = new Date();
        $scope.nombreLote = ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + date.getFullYear() + '-' + sessionFactory.empresaRfc + '-' + ('0' + ($scope.lotes.length + 1)).slice(-2);
    }, function error(err) {
        console.log('Ocurrio un error al tratar de obtener el nombre del lote')
    });
    var myDropzone;
    var cargaInfoGridLotes = function() {
        $scope.sumaDocumentos = undefined;
        var valor = _.where($scope.lstPermisoBoton, { idModulo: 11, Boton: "guardarLote" })[0];
        $scope.BotonGuardarLote = valor != undefined;
        crealoteFactory.getescenario(sessionFactory.empresaID).then(function success(result) {
            console.log(result.data, 'SOY EL ESCENARIO');
            $scope.escenarios = result.data;
            $scope.pdPlanta = $scope.escenarios.Pdbanco;
            $scope.pdBanco = $scope.escenarios.Pdplanta;
            $scope.refPlanta = $scope.escenarios.TipoRefPlanta;
            $scope.refpdBanco = $scope.escenarios.tipoRefBanco;
            if ($scope.pdPlanta || $scope.pdBanco) {
                $scope.selPagoDirecto = true;
            } else {
                $scope.selPagoDirecto = false;
            }
            console.log($scope.selPagoDirecto, 'PAGO DIRECTO');
            crealoteFactory.getDocumentos(sessionFactory.empresaID).then(function success(result) {
                console.log(result.data);
                $scope.documentos = result.data;
                validaDocumentos($scope.documentos);
                $scope.gridOptions.data = $scope.documentos;
            }, function error(err) {
                console.log('Ocusrrio un error al obtener los documentos')
            });

        }, function error(err) {
            console.log('Ocurrio un erro al obtener los escenarios')
        });
    };
    cargaInfoGridLotes();
    crealoteFactory.getCuentas(sessionFactory.empresaID).then(function success(result) {
        console.log(result.data, 'SOY LAS CUENTAS');
        $scope.lstCuentas = result.data;
    }, function error(err) {
        console.log('Ocurrio un erro al obtener cuentas')
    });
    $scope.getDocumentos = function(cuenta) {
        $scope.currentCuentaName = cuenta.cuenta;
        $scope.bancoPago = cuenta;
    };
    var validaDocumentos = function(data) {
        $scope.data = data;
        $scope.carteraVencida = 0;
        $scope.cantidadTotal = 0;
        $scope.cantidadUpdate = 0;
        $scope.noPagable = 0;
        $scope.Reprogramable = 0;
        $scope.TotalSaldoPagar = 0;
        var contador = 1;

        $scope.pdPlanta = $scope.escenarios.Pdplanta;
        $scope.pdBanco = $scope.escenarios.Pdbanco;
        $scope.refPlanta = $scope.escenarios.TipoRefPlanta;
        $scope.refpdBanco = $scope.escenarios.tipoRefBanco;
        $scope.grdPagoDirecto = [];
        var j = 0;
        var tamdata = $scope.data.length;
        for (var i = 0; i < tamdata; i++) {


            $scope.TotalSaldoPagar = $scope.TotalSaldoPagar + $scope.data[i].saldo;
            $scope.data[i].Pagar = $scope.data[i].saldo;
            $scope.data[i].fechaPago = $scope.data[i].fechaPromesaPago;
            $scope.data[i].agrupar = 0;



            if ($scope.data[i].fechaPromesaPago == "1900-01-01T00:00:00") {
                $scope.data[i].fechaPromesaPago = "";
            }

            //FAL 23052016 dependiendo la lista de 
            if ($scope.pdPlanta) {
                if ($scope.data[i].idProveedor == 7) {
                    $scope.data[i].referencia = 'Planta';
                    var datadirecto = $scope.data[i];
                    $scope.grdPagoDirecto.push(datadirecto);
                } else {
                    $scope.data[i].referencia = '';
                }
            }
            if ($scope.pdPlanta) {
                if ($scope.data[i].idProveedor == 6) {
                    $scope.data[i].referencia = 'Financiera';
                    var datadirecto = $scope.data[i];
                    $scope.grdPagoDirecto.push(datadirecto);
                }
            }
            if ($scope.pdBanco) {
                if ($scope.data[i].esBanco == 'true') {
                    $scope.data[i].referencia = 'Banco';
                }
            }

            if ($scope.data[i].seleccionable == "False") {
                $scope.data[i].estGrid = 'Pago';
            }

            if ($scope.data[i].seleccionable == 'True') {
                $scope.data[i].Pagar = $scope.data[i].saldo;
                $scope.data[i].estGrid = 'No pagar';
            }

            if ($scope.data[i].documentoPagable == 'False') {
                $scope.data[i].Pagar = $scope.data[i].saldo;
            }

            // if (($scope.data[i].numeroSerie).length == 17) {
            //     $scope.data[i].referencia = $scope.data[i].numeroSerie.substring(9, 17);
            // }

            if (($scope.data[i].autorizado == 1) && ($scope.data[i].seleccionable == "False")) {
                $scope.data[i].seleccionable = 'False';
            } else {
                $scope.data[i].seleccionable = 'True';
            }

            if ($scope.data[i].convenioCIE === '') {
                $scope.data[i].agrupar = 0;
            } else {
                $scope.data[i].seleccionable == "False";
                $scope.data[i].estGrid = 'Pago';
            }

            $scope.data[i].agrupar = 0;
            $scope.data[i].numagrupar = i;
            //FAL17052016 Valido si lleva numero de serie y si es de lenght = 17 lo pango en referencia.
            $scope.carteraVencida = $scope.carteraVencida + $scope.data[i].saldo;


        }
        $scope.noPagable = $scope.carteraVencida - $scope.cantidadTotal;

        //FAL 20062016 separación de cartera en caso de pago directo

        if ($scope.selPlantaBanco) {

            $scope.datosModal = $scope.grdPagoDirecto;

        } else {
            $scope.datosModal = $scope.data;

        }

        // var newLote = { idLotePago: '0', idEmpresa: $rootScope.idEmpresa, idUsuario: $rootScope.currentEmployee, fecha: '', nombre: $scope.formData.nombreLoteNuevo, estatus: 0 };
        // $scope.ObtieneLotes(newLote);
        // $scope.LlenaIngresos();
        $scope.estatusLote = 0;
        //LQMA 15032016
        $scope.accionPagina = true;
        $scope.grdApagar = 0;
        //FAL 19042016 llena totales de bancos desde la consulta
        $scope.grdBancos = [];
        $scope.grdApagar = 0;

        $scope.blTotales = true;
        $scope.idOperacion = 0;
        //FAL grid  x vencer
        $scope.gridOptions.data = $scope.documentos;
    };

    $scope.gridOptions = {
        enableColumnResize: true,
        enableRowSelection: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableGroupHeaderSelection: true,
        treeRowHeaderAlwaysVisible: false,
        showColumnFooter: false,
        showGridFooter: false,
        height: 900,
        cellEditableCondition: function($scope) {
            return $scope.row.entity.seleccionable;
        },
        isRowSelectable: function(row) {
            if (row.entity.seleccionable == "True") return false; //rirani is not selectable
            return true; //everyone else is
        },
        enableSorting: true,
        // enableFiltering: true,
        columnDefs: [
            // {
            //         name: 'nombreAgrupador',
            //         grouping: { groupPriority: 0 },
            //         sort: { priority: 0, direction: 'asc' },
            //         width: '15%',
            //         displayName: 'Grupo',
            //         enableCellEdit: false,
            //         cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>'
            //     }, 
            {
                name: 'proveedor',
                grouping: { groupPriority: 0 },
                sort: { priority: 1, direction: 'asc' },
                width: '40%',
                displayName: 'Proveedor',
                enableCellEdit: false,
                enableFiltering: false,
                cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>'
            },
            {
                name: 'idProveedor',
                displayName: 'Clave',
                width: '5%',
                enableCellEdit: false,
                enableFiltering: false,
                headerTooltip: 'Nombre del provedor',
                cellClass: 'cellToolTip'
            }, ,
            {
                name: 'saldo',
                displayName: 'Saldo',
                width: '15%',
                cellFilter: 'currency',
                enableCellEdit: false,
                enableFiltering: false,
                treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
                customTreeAggregationFinalizerFn: function(aggregation) {
                    aggregation.rendered = aggregation.value
                }
            },
            {
                name: 'documento',
                displayName: '# Documento',
                width: '15%',
                enableCellEdit: false,
                headerTooltip: 'Documento # de factura del provedor',
                cellClass: 'cellToolTip',
                cellTemplate: '<div style="text-align: center;"><span align="center"><a class="urlTabla" href ng-click="grid.appScope.VerDocumento(row.entity)">{{row.entity.documento}}</a></span></div>'
            },
            {
                name: 'agrupar',
                field: 'agrupar',
                displayName: 'No agrupar',
                width: '8%',
                type: 'boolean',
                enableFiltering: false,
                cellTemplate: '<input type="checkbox" ng-model="row.entity.agrupar">'
            },
            {
                name: 'ordenCompra',
                displayName: 'Orden de compra',
                width: '13%',
                enableCellEdit: false,
                cellTemplate: '<div class="urlTabla" ng-class="col.colIndex()" ><a tooltip="Ver en digitalización" class="urlTabla" href="http://192.168.20.92:3200/?id={{row.entity.ordenCompra}}&employee=' + $scope.idUsuario + '&proceso=1" target="_new">{{row.entity.ordenCompra}}</a></div>'
            },
            {
                name: 'monto',
                displayName: 'Monto',
                width: '10%',
                cellFilter: 'currency',
                enableCellEdit: false,
                enableFiltering: false
            },
            {
                name: 'Pagar',
                field: 'Pagar',
                displayName: 'Pagar (total)',
                width: '10%',
                cellFilter: 'currency',
                enableCellEdit: ($scope.currentIdOp == 1) ? false : true,
                enableFiltering: false,
                editableCellTemplate: '<div><form name="inputForm"><input type="number" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></form></div>'
            },
            {
                name: 'cuentaPagadora',
                width: '10%',
                displayName: 'Banco Origen',
                enableCellEdit: false,
                enableFiltering: false
            },
            {
                name: 'cuenta',
                width: '15%',
                displayName: '# Cuenta',
                enableCellEdit: false,
                enableFiltering: false
            },
            {
                name: 'fechaPromesaPago',
                displayName: 'Fecha Promesa de Pago',
                type: 'date',
                cellFilter: 'date:"dd/MM/yyyy"',
                width: '15%'
            },
            {
                name: 'referencia',
                displayName: 'Referencia',
                width: '10%',
                visible: true,
                enableCellEdit: true,
                enableFiltering: false
            },
            {
                name: 'tipo',
                width: '15%',
                displayName: 'Tipo',
                enableCellEdit: false,
                enableFiltering: false
            },
            {
                name: 'tipodocto',
                width: '15%',
                displayName: 'Tipo Documento',
                enableCellEdit: false
            },
            {
                name: 'cartera',
                width: '15%',
                displayName: 'Cartera',
                cellTooltip: true,
                enableCellEdit: false
            },
            {
                name: 'moneda',
                width: '10%',
                displayName: 'Moneda',
                enableCellEdit: false
            },
            {
                name: 'numeroSerie',
                width: '20%',
                displayName: 'N Serie',
                enableCellEdit: false
            },
            {
                name: 'facturaProveedor',
                width: '20%',
                displayName: 'Factura Proveedor',
                enableCellEdit: false
            },
            {
                name: 'fechaVencimiento',
                displayName: 'Fecha de Vencimiento',
                type: 'date',
                cellFilter: 'date:"dd/MM/yyyy"',
                width: '17%',
                enableCellEdit: false
            },
            {
                name: 'fechaRecepcion',
                displayName: 'Fecha Recepción',
                type: 'date',
                cellFilter: 'date:"dd/MM/yyyy"',
                width: '17%',
                enableCellEdit: false
            },
            {
                name: 'fechaFactura',
                displayName: 'Fecha Factura',
                type: 'date',
                cellFilter: 'date:"dd/MM/yyyy"',
                width: '17%',
                enableCellEdit: false
            },
            {
                name: 'saldoPorcentaje',
                field: 'saldoPorcentaje',
                displayName: 'Porcentaje %',
                width: '10%',
                cellFilter: 'number: 6',
                enableCellEdit: false
            },
            {
                name: 'estatus',
                displayName: 'Estatus',
                width: '10%',
                cellTooltip: true,
                enableCellEdit: false
            },
            {
                name: 'anticipo',
                displayName: 'Anticipo',
                width: '10%',
                enableCellEdit: false
            },
            {
                name: 'anticipoAplicado',
                displayName: 'Anticipo Aplicado',
                width: '15%',
                enableCellEdit: false
            },
            {
                name: 'documentoPagable',
                width: '15%',
                displayName: 'Estatus del Documento',
                visible: false,
                enableCellEdit: false
            },
            {
                name: 'ordenBloqueada',
                displayName: 'Bloqueada',
                width: '20%',
                enableCellEdit: false
            },
            {
                name: 'fechaPago',
                displayName: 'fechaPago',
                width: '20%',
                visible: false,
                enableCellEdit: false
            },
            {
                name: 'estGrid',
                width: '15%',
                displayName: 'Estatus Grid',
                enableCellEdit: false
            },
            {
                name: 'seleccionable',
                displayName: 'seleccionable',
                width: '20%',
                enableCellEdit: false,
                visible: false
            },
            {
                name: 'cuentaDestino',
                displayName: 'Cuenta Destino',
                editableCellTemplate: 'ui-grid/dropdownEditor',
                cellTooltip: true,
                width: '20%',
                editDropdownOptionsFunction: function(rowEntity, colDef) {
                    if (rowEntity.cuentaDestino === 'bar') {
                        return [{ id: 'SIN CUENTA', value: 'SIN CUENTA' }];
                    } else {
                        var index;
                        var bancosArray = rowEntity.cuentaDestinoArr.split(',');
                        var bancoSalida = [];

                        for (index = 0; index < bancosArray.length; ++index) {
                            var obj = {};
                            obj.id = bancosArray[index];
                            obj.value = bancosArray[index];
                            bancoSalida.push(obj);
                        }
                        return bancoSalida;
                    }
                }
            },
            {
                name: 'idEstatus',
                displayName: 'idEstatus',
                width: '20%',
                enableCellEdit: false,
                visible: true
            },
            {
                name: 'tipoCartera',
                displayName: 'tipoCartera',
                width: '20%',
                enableCellEdit: false,
                visible: true
            },
            {
                name: 'numagrupar',
                displayName: 'numagrupar',
                width: '20%',
                enableCellEdit: false,
                visible: false
            },
            {
                name: 'bancoPagador',
                displayName: 'bancoPagador',
                width: '20%',
                enableCellEdit: false,
                visible: false
            },
            {
                name: 'autorizado',
                displayName: 'Cuenta Autorizada',
                width: '20%',
                enableCellEdit: false,
                visible: true,
                cellTemplate: '<div ng-if="row.entity.autorizado == 1">Autorizado</div><div ng-if="row.entity.autorizado == 0">No autorizado</div>'
            }
        ],
        rowTemplate: '<div ng-class="{\'ordenBloqueada\':(row.entity.ordenBloqueada==\'True\' && ((row.entity.idEstatus < 1 || row.entity.idEstatus > 5) && row.entity.idEstatus != 20) && !row.isSelected)' +
            ',\'bloqueadaSelec\': (row.isSelected && row.entity.ordenBloqueada==\'True\') || (row.isSelected && ((row.entity.idEstatus >= 1 && row.entity.idEstatus <= 5) || row.entity.idEstatus == 20)),' +
            '\'bancocss\': (row.entity.referencia==\'Banco\'),' +
            '\'plantacss\': (row.entity.referencia==\'Planta\'),' +
            '\'selectNormal\': (row.isSelected && row.entity.ordenBloqueada==\'False\' && ((row.entity.idEstatus < 1 || row.entity.idEstatus > 5) && row.entity.idEstatus != 20))' +
            ',\'docIncompletos\': (!row.isSelected && ((row.entity.idEstatus >= 1 && row.entity.idEstatus <= 5) || row.entity.idEstatus == 20) && row.entity.ordenBloqueada==\'False\')' +
            ',\'bloqDocIncom\': (!row.isSelected && ((row.entity.idEstatus >= 1 && row.entity.idEstatus <= 5) || row.entity.idEstatus == 20) && row.entity.ordenBloqueada==\'True\')' +
            ',\'ordenBloqueada\':(row.entity.ordenBloqueada==\'True\' && ((row.entity.idEstatus < 1 || row.entity.idEstatus > 5) && row.entity.idEstatus != 20) && !row.isSelected)' +
            ',\'pruebaLAu\': (row.entity.procesoPendiete == 1) ' +
            '}"> <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader == \'True\'}" ui-grid-cell></div></div>',
        onRegisterApi: function(gridApi1) {
            $scope.gridApi1 = gridApi1;
            //FAL14042016 Marcado de grupos y proveedores
            gridApi1.selection.on.rowSelectionChanged($scope, function(row, rows) {
                var filasSeleccionadas = $scope.gridApi1.selection.getSelectedRows();
                console.log(filasSeleccionadas)
                $scope.sumaDocumentos = 0;
                angular.forEach(filasSeleccionadas, function(value, key) {
                    $scope.sumaDocumentos = $scope.sumaDocumentos + value.Pagar;
                });
                if (row.internalRow == true && row.isSelected == true) {
                    var childRows = row.treeNode.children;
                    for (var j = 0, length = childRows.length; j < length; j++) {
                        $scope.selectAllChildren(gridApi1, childRows[j]);
                    }
                }
                if (row.internalRow == true && row.isSelected == false) {
                    var childRows = row.treeNode.children;
                    for (var j = 0, length = childRows.length; j < length; j++) {
                        $scope.unSelectAllChildren(gridApi1, childRows[j]);
                    }
                }
                if (row.internalRow == undefined && row.isSelected == true && row.entity.seleccionable == "False") {
                    var ctrCuentaDestinoArr = row.entity.cuentaDestino.split(',');

                    if (ctrCuentaDestinoArr.length > 1) {
                        // proveedorcuentaDestino = row.proveedor;
                        var rowCol = $scope.gridApi1.cellNav.getFocusedCell();
                        if (rowCol) {
                            alertFactory.warningCenter('El proveedor tiene mas de una cuenta destino');
                            $scope.gridApi1.core.scrollTo($scope.gridOptions.data[rowCol.row.entity.id], $scope.gridOptions.columnDefs[32]);
                            $interval(function() {
                                $scope.gridApi1.core.handleWindowResize();
                            }, 100, 10);
                            // return true;
                            console.log('tiene mas de una cuenta destino ')
                        }
                    } else {
                        var childRows = row.treeNode.parentRow.treeNode.children;
                        var numchilds = row.treeNode.parentRow.treeNode.aggregations[0].value;
                        var ctdSeleccionados = 0;
                        for (var j = 0; j < numchilds; j++) {
                            if (childRows[j].row.isSelected == true) {
                                ctdSeleccionados = ctdSeleccionados + 1;
                            }
                            if (ctdSeleccionados == numchilds) {
                                id = "closeMenu"
                                row.treeNode.parentRow.treeNode.row.isSelected = true;
                            }
                        }
                    }

                }
                if (row.internalRow == undefined && row.isSelected == false) {
                    var childRows = row.treeNode.parentRow.treeNode.children;
                    var numchildRows = row.treeNode.parentRow.treeNode.aggregations[0].value;
                    var ctdSeleccionados = 0;
                    for (var j = 0; j < numchildRows; j++) {
                        if (childRows[j].row.isSelected == true) {
                            ctdSeleccionados = ctdSeleccionados + 1;
                        }
                        if (ctdSeleccionados > 0) {
                            j = numchildRows;
                            row.treeNode.parentRow.treeNode.row.isSelected = false;
                            // row.treeNode.parentRow.treeNode.parentRow.treeNode.row.isSelected = false;
                        }
                    }
                }
                //FAL seleccionado de padres sin afectar las sumas
                if (row.entity.Pagar == null) {
                    var grdPagarxdocumento = 0
                } else {
                    grdPagarxdocumento = row.entity.Pagar;
                }
                if (row.isSelected) {
                    $scope.grdNoIncluido = Math.round($scope.grdNoIncluido * 100) / 100 - Math.round(grdPagarxdocumento * 100) / 100;
                    if ($scope.grdNoIncluido < 0) { $scope.grdNoIncluido = 0; }
                    //FAL actualizar cuenta pagadoras
                    if ($scope.grdinicia > 0) {
                        if (row.entity.estGrid == 'Pago Reprogramado') {
                            $scope.grdReprogramado = Math.round($scope.grdReprogramado * 100) / 100 - Math.round(row.entity.Pagar * 100) / 100;
                        };

                        if ((isNaN(row.entity.Pagar)) == false) {

                            $scope.grdApagar = Math.round($scope.grdApagar * 100) / 100 + Math.round(row.entity.Pagar * 100) / 100;
                            row.entity.estGrid = 'Pago'

                        }

                    }
                } else {
                    $scope.grdNoIncluido = Math.round($scope.grdNoIncluido * 100) / 100 + Math.round(grdPagarxdocumento * 100) / 100;
                    //FAL actualizar cuenta pagadoras
                    i = 0;
                    if ($scope.grdinicia > 0) {

                        if ((isNaN(row.entity.Pagar)) == false) {

                            $scope.grdApagar = Math.round($scope.grdApagar * 100) / 100 - Math.round(row.entity.Pagar * 100) / 100;
                            row.entity.estGrid = 'Pago'

                        }


                        //$scope.grdApagar = Math.round($scope.grdApagar * 100) / 100 - Math.round(row.entity.Pagar * 100) / 100;
                        if (row.entity.estGrid != 'Pago Reprogramado') {
                            row.entity.estGrid = 'Permitido'
                        } else {
                            $scope.grdReprogramado = Math.round($scope.grdReprogramado * 100) / 100 + Math.round(row.entity.Pagar * 100) / 100;
                        }

                    }
                }


            });
            gridApi1.selection.on.rowSelectionChangedBatch($scope, function(rows) {
                //FAL 29042016 cambio de seleccion de padres
                var i = 0;
                // var numcuentas = $scope.grdBancos.length;
                $scope.grdNoIncluido = 0;
                if ($scope.grdinicia > 0) {
                    $scope.grdBancos.forEach(function(banco, l) {
                        $scope.grdBancos[l].subtotal = 0;
                        $scope.grdApagar = 0;
                    });
                }
                if ($scope.grdinicia > 0) {
                    rows.forEach(function(row, i) {
                        if (row.isSelected) {
                            if (row.entity.seleccionable == 'False') {
                                row.entity.estGrid = 'Pago';
                                $scope.grdNoIncluido = 0;
                                $scope.grdApagar = Math.round($scope.grdApagar * 100) / 100 + Math.round(row.entity.Pagar * 100) / 100;
                                //$scope.grdApagar = $scope.grdApagar + row.entity.Pagar;
                                // i = numcuentas;
                                $scope.grdNoIncluido = 0;
                            }
                        } else {
                            if (row.entity.seleccionable == 'False') {
                                row.entity.estGrid = 'Permitido';
                                $scope.grdNoIncluido = $scope.grdApagarOriginal;
                                row.treeNode.parentRow.treeNode.row.isSelected = false;
                                // row.treeNode.parentRow.treeNode.parentRow.treeNode.row.isSelected = false;
                                $scope.grdApagar = 0;
                            }
                        }
                    });
                }

            });
            gridApi1.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                //FAL trabaja con las variables dependiendo si se edita o cambia la fecha
                var i = 0;
                // var numcuentas = $scope.grdBancos.length;
                var filasSeleccionadas = $scope.gridApi1.selection.getSelectedRows();
                console.log(filasSeleccionadas)
                $scope.sumaDocumentos = 0;
                angular.forEach(filasSeleccionadas, function(value, key) {
                    $scope.sumaDocumentos = $scope.sumaDocumentos + value.Pagar;
                });
                if (rowEntity.estGrid == 'Pago' || rowEntity.estGrid == 'Pago Reprogramado') {
                    if (rowEntity.fechaPago == "1900-01-01T00:00:00") {
                        old_date = "";
                    } else {
                        old_date = new Date(rowEntity.fechaPago);
                    }
                    if (colDef.name == 'fechaPromesaPago') {
                        dtHoy = Date.now();
                        now_date = new Date($scope.formatDate(dtHoy));
                        new_date = new Date($scope.formatDate(newValue));
                        if (new_date <= now_date) {
                            alertFactory.warning('La fecha promesa de pago no puede ser menor o igual a ' + $scope.formatDate(dtHoy) + ' !!!');
                            rowEntity.fechaPromesaPago = old_date;
                            rowEntity.estGrid = 'Pago';
                        } else {
                            rowEntity.Pagar = rowEntity.saldo;
                            rowEntity.estGrid = 'Pago Reprogramado';
                            $scope.gridApi1.selection.unSelectRow(rowEntity);
                        }
                    }
                    if (colDef.name == 'Pagar') {
                        $scope.cantidadUpdate = newValue - oldValue;
                        if ((newValue > rowEntity.saldo) || (newValue <= 0)) {
                            alertFactory.warning('El pago es inválido !!!');
                            rowEntity.Pagar = oldValue;
                        } else {
                            if (rowEntity.estGrid == 'Pago Reprogramado') {
                                $scope.grdReprogramado = Math.round($scope.grdReprogramado * 100) / 100 - Math.round(rowEntity.Pagar * 100) / 100;
                            }
                            // for (var i = 0; i < numcuentas; i++) {
                            //     if (rowEntity.cuentaPagadora == $scope.grdBancos[i].banco) {
                            //         $scope.grdBancos[i].subtotal = Math.round($scope.grdBancos[i].subtotal * 100) / 100 + Math.round($scope.cantidadUpdate * 100) / 100;
                            //         i = numcuentas;
                            //     }
                            // };
                            $scope.grdNoIncluido = Math.round($scope.grdNoIncluido * 100) / 100 - Math.round($scope.cantidadUpdate * 100) / 100;
                            $scope.grdApagar = Math.round($scope.grdApagar * 100) / 100 + Math.round($scope.cantidadUpdate * 100) / 100;
                            rowEntity.estGrid = 'Pago';
                            rowEntity.fechaPromesaPago = old_date;
                        }
                    }
                    //FAL valido la referencia.
                    if (colDef.name == 'referencia') {
                        if (rowEntity.convenioCIE == "")

                        {
                            if (newValue.length > 30) {
                                alertFactory.warning('La referencia no puede tener más de 30 caracteres');
                                rowEntity.referencia = oldValue;
                            }
                        } else {
                            if ((newValue.length < 5) || (newValue.length > 30)) {
                                alertFactory.warning('La referencia CIE no puede tener más de 30 caracteres ni menos de 5');
                                rowEntity.referencia = oldValue;
                            }
                        }
                    }


                } else {
                    alertFactory.warning('Solo se pueden modificar datos de los documentos seleccionados');
                    if (colDef.name == 'Pagar') {
                        rowEntity.Pagar = oldValue;
                    }
                    if (colDef.name == 'fechaPromesaPago') {
                        rowEntity.fechaPromesaPago = oldValue;
                    }
                }
            });
        }
    };
    $scope.VerDocumento = function(lote) {
        crealoteFactory.getPdf(lote.polTipo, lote.annio, lote.polMes, lote.polConsecutivo, sessionFactory.empresaID).then(function(d) {
            var pdf = URL.createObjectURL(utils.b64toBlob(d.data.arrayBits, "application/pdf"))
            var pdf_link = '';
            var typeAplication = '';
            var titulo = 'Poliza del documento' + lote.documento;
            $scope.rptPoliza = $sce.trustAsResourceUrl(pdf);
            $("<object id='embedReportePoliza' data=" + $scope.rptPoliza + " style='width:800px;height:400px;'></object>").appendTo('#pdfPoliza');
            $('#modalPdf').modal('show');
            $("#modalPdf").on('hidden.bs.modal', function() {
                $("#embedReportePoliza").remove();
            });
        });

    };
    $scope.descargarArchivo = function() {
        $('#mdlLoading').modal('show');
        var arregloBytes = [];
        $rootScope.pdf = undefined;
        pagoInteresFactory.getreadFile().then(function(result) {
            arregloBytes = result.data;
            if (arregloBytes.length == 0) {
                $rootScope.NohayPdf = 1;
                $rootScope.pdf = [];
            } else {
                $rootScope.NohayPdf = undefined;
                $rootScope.excel = URL.createObjectURL(utils.b64toBlob(arregloBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            }
            setTimeout(function() {
                $window.open($rootScope.excel);
            }, 100);
            $('#mdlLoading').modal('hide');
            console.log($rootScope.excel, 'Soy el arreglo ')
        }, function(error) {
            console.log("Error", error);
        });
    };
    $scope.cargarLayout = function() {
        $('#modalCargaLayout').modal('show');
        $scope.Dropzone();
    };
    $scope.Dropzone = function() {
        $("#cargaLotout").html('')

        var html = `<form action="/file-upload" class="dropzone" id="idDropzone">
                        <div class="fallback">
                            <input name="file" type="file" accept="text/csv, .csv" />
                        </div>
                    </form>`;

        $("#cargaLotout").html(html);
        myDropzone = new Dropzone("#idDropzone", {
            url: "api/apiConciliacion/upload",
            uploadMultiple: 0,
            maxFiles: 1,
            autoProcessQueue: false,
            acceptedFiles: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            webkitRelativePath: "/uploads"
        });

        myDropzone.on("success", function(req, xhr) {
            var _this = this;

            var filename = xhr + '.xlsx';
            $scope.loadingPanel = true;
            $('#mdlLoading').modal('show');
            $scope.readLayout(filename);

            $scope.limpiarDropzone = function() {
                _this.removeAllFiles();
                myDropzone.enable()
                // $scope.frmConciliacion.loadLayout = true;
            }
        });

        myDropzone.on("addedfile", function() {
            // $scope.frmConciliacion.loadLayout = true;
        });
    };
    $scope.procesaDocumentos = function() {
        myDropzone.processQueue();
    };
    var execelFields = [];
    $scope.readLayout = function(filename) {
        conciliacionFactory.readLayout(filename).then(function(result) {
            var LayoutFile = result.data;
            var aux = [];
            for (var i = 0; i < LayoutFile.length; i++) {
                aux.push(LayoutFile[i]);
            }
            execelFields = $scope.arrayToObject(aux);
            $scope.buscaDocumentos();
        }, function(error) {
            console.log("Error", error);
        });
    };
    $scope.arrayToObject = function(array) {
        var lst = [];
        for (var i = 0; i < array.length; i++) {
            var obj = { dato1: array[i].Documento, dato2: array[i].Interes };
            lst.push(obj);
        }
        return lst;
    };
    $scope.buscaDocumentos = function() {
        console.log(execelFields, 'Lodel excel');
        console.log($scope.gridOptions.data, 'DATA')
        var vinExcel = '';
        var interesExcel = 0;
        var vinKey = 0;
        var ctrCuentaDestinoArr;
        $scope.financieraMasCuenta = [];
        $scope.saldoMenor = [];
        $scope.noSeleccionable = [];
        $scope.documenosNoEncontrados = [];
        var objetoExcel;
        angular.forEach(execelFields, function(value, key) {
            objetoExcel = value;
            vinExcel = value.dato1;
            interesExcel = value.dato2;
            vinKey = key;
            var auxContador = 1;
            var auxMax = $scope.gridOptions.data.length;
            var unidadEncontrada = false;
            angular.forEach($scope.gridOptions.data, function(value, key) {
                auxContador++;
                if (value.numeroSerie == vinExcel || value.documento == vinExcel) {
                    unidadEncontrada = true;
                    if (value.seleccionable == "True") {
                        $scope.noSeleccionable.push(value);

                    } else {
                        var ctrCuentaDestinoArr = value.cuentaDestino.split(',');
                        if (ctrCuentaDestinoArr.length > 1) {
                            $scope.financieraMasCuenta.push(value);
                        }
                        $timeout(function() {
                            if ($scope.gridApi1.selection.selectRow) {
                                $scope.gridApi1.selection.selectRow($scope.gridOptions.data[key]);

                            }
                        });

                    }
                }
                // if(){

                // }
            });
            if (unidadEncontrada == false) {
                $scope.documenosNoEncontrados.push(objetoExcel);
            }
        });
        if ($scope.financieraMasCuenta.length > 0) {
            $scope.cuentasRepetidas = Array.from(new Set($scope.financieraMasCuenta.map(s => s.proveedor))).map(proveedor => {
                return {
                    proveedor: proveedor,
                    currentCuentaDestino: 'Seleccione cuenta destino',
                    cuentaDestino: $scope.financieraMasCuenta.find(s => s.proveedor === proveedor).cuentaDestino.split(',')
                }
            });
            console.log($scope.cuentasRepetidas, 'MMM SI QUEDARA???')
        }
        $('#mdlLoading').modal('hide');
        $('#modalCargaLayout').modal('hide');
        $scope.loadingPanel = false;
        // $scope.gridApi1.selection.selectRow($scope.gridOptions.data[1]);
    };
    $scope.cambioCuentasGrid = function(cuenta, financiera) {
        console.log($scope.gridOptions.data, 'POR QUE NOOO')
        var financieraSeleccion = financiera;
        angular.forEach($scope.gridOptions.data, function(value, key) {
            if (financieraSeleccion == value.proveedor) {
                value.cuentaDestino = cuenta;
            }
        });
    };
    $scope.validaDocumentosSeleccionados = function() {
        $scope.mostrarAlerta = false;
        $scope.noMostrar = false;
        $scope.muestraInteresesBanamex = false;
        $scope.noMostrarInactivas = false;
        var contador = 0;
        console.log($scope.bancoPago, 'BANCO')
        $scope.montoIgual = 0;
        $scope.interesesUnidades = [];
        $scope.arrayInteresUnidad = [];
        $scope.arrayInteresUnidadOriginal = [];
        var rows = $scope.gridApi1.selection.getSelectedRows();
        if (rows.length > 0) {
            var idProveedorUnico = rows[0].idProveedor;
            var proveedorDiferente = false;
            console.log('SOY EL PROVEEDOR', idProveedorUnico)
            if ($scope.bancoPago) {
                //$scope.gridOptions2.data = rows;
                console.log(rows);
                var pasaxCIE = true;
                var proveedorCIE = '';
                var pasaxbancoDestino = true;
                var proveedorcuentaDestino = '';
                var unaCuenta = true;
                $scope.unidadesInactiva = [];
                rows.some(function(row, i, j) {
                    if (idProveedorUnico != row.idProveedor) {
                        proveedorDiferente = true;
                    }
                    if (row.saldo == row.Pagar) {
                        $scope.montoIgual = 1;
                        $scope.noMostrar = true;
                        sacarunidadFactory.getIntesesUnidad(row.documento, row.idProveedor, row.Pagar).then(function success(result) {
                            console.log(result.data, 'soy el interes de la unidad ')
                            if (result.data[0][0].success == 0) {
                                $scope.mostrarAlerta = true;
                                contador++;
                            } else if (result.data[0][0].success == 2) {
                                $scope.noMostrar = false;
                            } else if (result.data[0][0].success == 3) {
                                $scope.noMostrar = false;
                                $scope.noMostrarInactivas = true;
                                $scope.unidadesInactiva.push(result.data[0][0]);
                            } else {
                                var banderaIntereses = result.data[0][0].bandera;
                                $scope.muestraInteresesBanamex = banderaIntereses == 2 ? true : false;
                                $scope.interesesUnidades.push(row);
                                if (result.data[1]) {
                                    if (execelFields.length > 0) {
                                        var unidadesInteres = result.data[1];
                                        var excelUnidad;
                                        angular.forEach(execelFields, function(value, key) {
                                            excelUnidad = value;
                                            angular.forEach(unidadesInteres, function(value, key) {
                                                if (excelUnidad.dato1 == value.vin) {
                                                    if (excelUnidad.dato2 != value.totalInteres) {
                                                        value.totalInteres = excelUnidad.dato2;
                                                    }
                                                }
                                            });
                                        });
                                        $scope.arrayInteresUnidad.push(unidadesInteres[0]);
                                        $scope.arrayInteresUnidadOriginal = angular.copy($scope.arrayInteresUnidad);
                                        console.log($scope.arrayInteresUnidad, 'Soy los intereses')
                                    } else {
                                        $scope.arrayInteresUnidad.push(result.data[1][0]);
                                        $scope.arrayInteresUnidadOriginal = angular.copy($scope.arrayInteresUnidad);
                                        console.log($scope.arrayInteresUnidad, 'Soy los intereses')
                                    }
                                }

                            }
                            // $scope.noMostrar = contador > 0 ? true : false;
                        }, function error(err) {
                            console.log('Ocurrio un error al intentar obtener el interes de la unidad')
                        });

                    }
                    if ((row.convenioCIE == null) || (row.convenioCIE == undefined) || (row.convenioCIE == "")) {
                        pasaxCIE = true;
                    } else {
                        pasaxCIE = false;
                    }
                    if (pasaxCIE == false) {
                        if ((row.referencia == null) || (row.referencia == undefined) || (row.referencia == "")) {
                            proveedorCIE = row.proveedor;
                            return true;
                        } else {
                            var ctrCuentaDestinoArr = row.cuentaDestino.split(',');
                            if (ctrCuentaDestinoArr.length > 1) {
                                pasaxbancoDestino = false;
                                proveedorcuentaDestino = row.proveedor;
                                alertFactory.warning('El proveedor CIE' + proveedorcuentaDestino + ' Tiene mas de una cuenta destino');
                                unaCuenta = false;
                                pasaxCIE = false;
                                return true;
                            } else {
                                pasaxCIE = true;
                                return false;
                            }
                        }
                    }
                    var ctrCuentaDestinoArr = row.cuentaDestino.split(',');
                    if (ctrCuentaDestinoArr.length > 1) {
                        pasaxbancoDestino = false;
                        proveedorcuentaDestino = row.proveedor;
                        alertFactory.warning('El proveedor ' + proveedorcuentaDestino + ' Tiene mas de una cuenta destino');
                        unaCuenta = false;
                        return true;
                    }
                });
                if (unaCuenta) {
                    if (pasaxCIE) {
                        if (proveedorDiferente == true) {
                            alertFactory.warning('No puede seleccionar documentos de diferentes proveedores');
                        } else {
                            $('#modalDetalleInteres').modal('show');
                        }
                    } else {
                        alertFactory.warning('Existe un documento del proveedor ' + proveedorCIE + ' con convenio CIE sin referencia');
                    };
                }
            } else {
                alertFactory.warning('Debe seleccionar una cuenta');
            }
        } else {
            alertFactory.warning('Debe seleccionar por lo menos un documento');
        }
    };
    $scope.verificaIntereses = function() {
        swal({
            title: "Atención",
            text: "Se crearan ordenes de compra para los intereses. ¿Seguro que desea continuar?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#21B9BB",
            confirmButtonText: "OK",
            closeOnConfirm: true
        }, function() {
            $scope.guardaIntereses();
        });
    };
    $scope.guardaIntereses = function() {
        console.log($scope.arrayInteresUnidad);
        pagoInteresFactory.guardaIdIntereses().then(function success(result) {
            console.log(result.data[0].idBitacora);
            var idBitacora = result.data[0].idBitacora;
            var promisesIntereses = [];
            $scope.arrayInteresUnidad.map((value) => {
                var tasa = 0;
                if (value.tasa) {
                    tasa = value.tasa;
                }
                var objetoInteres = {
                    'idmovimiento': value.idmovimiento,
                    'idfinanciera': value.idfinanciera,
                    'idesquema': value.idesquema,
                    'saldo': value.saldo,
                    'puntos': value.puntos,
                    'tiie': value.tiie,
                    'penetracion': value.penetracion,
                    'plazo': value.plazo,
                    'fechatiie': value.fechatiie,
                    'fechainicio': value.fechainicio,
                    'fechafin': value.fechafin,
                    'Interes': value.Interes,
                    'dias': value.dias,
                    'totalInteres': value.totalInteres,
                    'tipo': 'calculo',
                    'idpagoInteres': idBitacora,
                    'tasa': tasa
                };
                promisesIntereses.push(pagoInteresFactory.insInteres(objetoInteres));
            });
            Promise.all(promisesIntereses).then(function response(result) {
                console.log('Termino Bitacora');
                var rows = $scope.gridApi1.selection.getSelectedRows();
                var idProveedorGeneral = rows[0].idProveedor;
                var dataEncabezado = {
                    idEmpresa: sessionFactory.empresaID,
                    idUsuario: $scope.idUsuario,
                    nombreLote: $scope.nombreLote,
                    estatus: -1,
                    esAplicacionDirecta: 0,
                    cifraControl: ($scope.sumaDocumentos).toFixed(2),
                    interesAgrupado: 0
                };
                var idProveedor = 0;
                crealoteFactory.setEncabezadoPago(dataEncabezado)
                    .then(function successCallback(response) {
                        $scope.idLotePadre = response.data[0].idLotePadre;
                        var array = [];
                        var count = 1;
                        rows.forEach(function(row, i) {
                            idProveedor = row.idProveedor;
                            var elemento = {};
                            elemento.pal_id_lote_pago = $scope.idLotePadre; //response.data;
                            elemento.pad_polTipo = row.polTipo; //entity.polTipo;
                            elemento.pad_polAnnio = row.annio;
                            elemento.pad_polMes = row.polMes;
                            elemento.pad_polConsecutivo = row.polConsecutivo;
                            elemento.pad_polMovimiento = row.polMovimiento;
                            elemento.pad_fechaPromesaPago = (row.fechaPromesaPago == '' ? '1900-01-01T00:00:00' : row.fechaPromesaPago);
                            elemento.pad_saldo = parseFloat(row.Pagar) + .00000001; //row.saldo;//                    
                            //15062018
                            if ((row.referencia == null) || (row.referencia == undefined) || (row.referencia == "")) {
                                row.referencia = "AUT";
                            } else {
                                if (row.convenioCIE == "") {
                                    //row.referencia = $scope.idLotePadre + '-' + row.idProveedor + '-' + row.referencia.replace(" ", "");
                                }
                            }
                            //fin 15062018
                            elemento.pad_documento = row.documento;
                            elemento.pad_polReferencia = row.referencia; //FAL 09052015 mandar referencia
                            elemento.tab_revision = '1';
                            if (row.agrupar == 1) {
                                elemento.pad_agrupamiento = count;
                            } else {
                                elemento.pad_agrupamiento = row.agrupar;
                            }

                            elemento.pad_bancoPagador = $scope.bancoPago.cuenta;
                            var lonbancodestino = row.cuentaDestino.length;
                            var primerparentesis = row.cuentaDestino.indexOf("(", 0)
                            var numcuentaDestino = row.cuentaDestino.substring(primerparentesis + 1, lonbancodestino)
                            var res = numcuentaDestino.replace("(", "");
                            res = res.replace(")", "");
                            res = res.replace(",", "");
                            res = res.replace(",", "");
                            res = res.replace(",", "");
                            res = res.replace(" ", "");
                            elemento.pad_bancoDestino = res;
                            array.push(elemento);
                            count = count + 1;
                        });

                        var jsIngresos = angular.toJson([{}]); //delete $scope.ingresos['$$hashKey'];
                        var jsTransf = angular.toJson([{}]);
                        var jsEgresos = angular.toJson([{}]);
                        // array, $rootScope.currentEmployee, $scope.idLotePadre, jsIngresos, jsTransf, $scope.caja, $scope.cobrar, jsEgresos, ($scope.estatusLote == 0) ? 1 : 2
                        crealoteFactory.setDatos(array, $scope.idUsuario, $scope.idLotePadre, jsIngresos, jsTransf, 0, 0, jsEgresos, 1)
                            .then(function successCallback(response) {
                                console.log(response.data[0].estatus, 'INSERTO???MMMM')
                                if (response.data[0].estatus == 1) {
                                    pagoInteresFactory.updInteresLote($scope.idLotePadre, idBitacora).then(function success(result) {
                                        console.log(result.data, 'Relacion Lote Interes');
                                        pagoInteresFactory.polizaInteres(idBitacora, $scope.idUsuario, idProveedorGeneral).then(function success(result) {
                                            console.log(result.data);
                                            window.location = "/pagoInteres";
                                        }, function error(err) {
                                            console.log('Ocurrio un error al intentar crear las polizas')
                                        });
                                    }, function error(err) {
                                        console.log('Ocurrio un error al relacionar el interes con el pago');
                                    });

                                } else {
                                    alertFactory.error('Ocurrio un Problema al guardar el lote')
                                }

                            }, function errorCallback(response) {
                                alertFactory.error('Error al guardar Datos');
                            });
                    }, function errorCallback(response) {
                        alertFactory.error('Error al insertar en tabla padre.');
                    });
            });

            // pagoInteresFactory.guardaInteres().then(function success(result) {
            //     console.log(result.data);
            // }, function error(err) {
            //     console.log(err, 'Ocurrio un error al intentar guardar los Intereses')
            // });
        }, function error(err) {
            console.log(err, 'Ocurrio un error al intentar guardar los Intereses')
        });

    };
});