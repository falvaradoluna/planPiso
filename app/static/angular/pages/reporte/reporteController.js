appModule.controller('reporteController', function($scope, $rootScope, $location, $interval, commonFactory, reporteFactory, staticFactory, uiGridConstants, uiGridGroupingConstants, empresaFactory) {
    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.idUsuario = localStorage.getItem("idUsuario");
    $scope.currentEmpresa = sessionFactory.nombre;

    $scope.topBarNav = staticFactory.reporteBar();
    $scope.today = staticFactory.todayDate();
    $scope.totalUnidades = 0;
    $scope.totalLineaUtilizada = 0;
    $scope.totalUnidadesInventario = 0;
    $scope.totalIventario = 0;
    $scope.unidadesEstrella = 0;
    $scope.totalEstrella = 0;
    $scope.unidadesDobleE = 0;
    $scope.totalDobleE = 0;
    $scope.muestraxempresa = true;
    reporteFactory.getReporteEmpresa(sessionFactory.empresaID).then(function success(result) {
        $scope.datosReporte = result.data;
        var promises = [];
        $scope.datosReporte.map((value) => {
            promises.push(reporteFactory.getReporteUnidades(sessionFactory.empresaID, value.financieraID));
        })
        Promise.all(promises).then(function response(result) {
            console.log(result, 'UNIDADEEEES');
            for (i = 0; i < $scope.datosReporte.length; i++) {
                $scope.datosReporte[i].subGridOptions = {
                    columnDefs: [{ name: 'Documento', field: 'CCP_IDDOCTO' },
                        { name: 'VIN', field: 'VIN' },
                        { name: 'Saldo documento', field: 'saldo' },
                        { name: 'Plazo', field: 'plazo' },
                        { name: 'Dias', field: 'dias' },
                        { name: 'TIIE', field: 'tiie' },
                        { name: 'Spread', field: 'puntos' },
                        { name: 'Intereses', field: 'totalInteres' },
                        { name: 'Estrella', field: 'estrella' },
                        { name: 'Doble Estrella', field: 'dobleEstrella' }
                    ],
                    data: result[i].data
                };
            }

            console.log($scope.datosReporte)
            $scope.gridOptions.data = $scope.datosReporte;
            $interval(function() {
                $scope.gridApi.core.handleWindowResize();
            }, 500, 10);
        }).catch(error => console.log('Ocurrio un error al obtener datos reporte' + error))
        console.log(JSON.stringify($scope.datosReporte))
        angular.forEach($scope.datosReporte, function(value, key) {
            $scope.totalUnidades = $scope.totalUnidades + value.unidades;
            $scope.totalLineaUtilizada = $scope.totalLineaUtilizada + value.saldo;
            $scope.totalUnidadesInventario = $scope.totalUnidadesInventario + value.unidades;
            $scope.totalIventario = $scope.totalIventario + value.saldo;
            $scope.unidadesEstrella = $scope.unidadesEstrella + value.estrella;
            $scope.totalEstrella = $scope.totalEstrella + value.estrellaMonto;
            $scope.unidadesDobleE = $scope.unidadesDobleE + value.dobleEstrella;
            $scope.totalDobleE = $scope.totalDobleE + value.dobleEstrellaMonto;
        });
    }, function err(error) {
        console.log(error);
    });
    $scope.descargarReporte = function() {
        $scope.contenidoReporte = {
            "empresa": sessionFactory.nombre,
            "totalUnidades": $scope.totalUnidades,
            "totalLineaUtilizada": $scope.totalLineaUtilizada,
            "totalUnidadesInventario": $scope.totalUnidadesInventario,
            "totalIventario": $scope.totalIventario,
            "unidadesEstrella": $scope.unidadesEstrella,
            "totalEstrella": $scope.totalEstrella,
            "unidadesDobleE": $scope.unidadesDobleE,
            "totalDobleE": $scope.totalDobleE,
            "detalle": $scope.datosReporte,
            "fecha": $scope.today
        };
        console.log('COMPLENTED', $scope.contenidoReporte);
        reporteFactory.jsReporte($scope.contenidoReporte).then(function success(result) {
            console.log(result);
            var file = new Blob([result.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," });
            var a = document.createElement("a");
            a.href = URL.createObjectURL(file);
            a.download = 'Reporte Plan Piso ' + sessionFactory.nombre;
            a.click();
        }, function err(error) {
            console.log(error);
        });
    };
    //BEGIN UI GRID
    $scope.gridOptions = {
        expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" style="height:150px;"></div>',
        expandableRowHeight: 150,
        //subGridVariable will be available in subGrid scope
        expandableRowScope: {
            subGridVariable: 'subGridScopeVariable'
        }
    };
    $scope.gridOptions.columnDefs = [
        { name: 'Financiera', field: 'nombre' },
        { name: 'TIIE', field: 'tiie' },
        { name: 'Spread', field: 'puntos' },
        { name: '--', field: 'sumaTP' },
        { name: 'Línea Autorizada', field: 'lineaAutorizada' },
        { name: 'unidades', field: 'unidades' },
        { name: 'Línea utilizada', field: 'saldo' },
        { name: 'Línea disponible', field: 'lineaResto' },
        { name: 'unidades', field: 'unidades' },
        { name: 'Inventario', field: 'saldo' },
        { name: 'Unidades en Estrella', field: 'estrella' },
        { name: 'Estrella', field: 'estrellaMonto' },
        { name: 'Unidades doble Estrella', field: 'dobleEstrella' },
        { name: 'Doble Estrella', field: 'dobleEstrellaMonto' }
    ];
    $scope.gridOptions.onRegisterApi = function(gridApi) {
        $scope.gridApi = gridApi;
    };

    $scope.expandAllRows = function() {
        $scope.gridApi.expandable.expandAllRows();
    };

    $scope.collapseAllRows = function() {
        $scope.gridApi.expandable.collapseAllRows();
    };

    $scope.toggleExpandAllBtn = function() {
        $scope.gridOptions.showExpandAllButton = !$scope.gridOptions.showExpandAllButton;
    };
    // END UI GRID
    $scope.reporteEmpresas = function() {
        $scope.muestraxempresa = false;
        empresaFactory.getEmpresa($scope.idUsuario).then(function(result) {
            $scope.lstEmpresa = result.data;
            $scope.encabezadoReporte = [];
            var promises = [];
            $scope.lstEmpresa.map((value) => {
                promises.push(reporteFactory.getReporteEmpresa(value.emp_idempresa));
            })
            Promise.all(promises).then(function response(result) {
                console.log(result, 'Reportes');
                var reporteEncabezado = result;
                var contador = 0;
                var contador2 = 0;
                var idEmpresa = 0;
                angular.forEach($scope.lstEmpresa, function(value, key) {
                    if (reporteEncabezado[key].data.length > 0) {
                        $scope.encabezadoReporte.push(value);
                        idEmpresa = value.emp_idempresa;
                        $scope.encabezadoReporte[contador].reporte = reporteEncabezado[key].data;
                        var promises2 = [];
                        $scope.encabezadoReporte[contador].reporte.map((value) => {
                            promises2.push(reporteFactory.getReporteUnidades(idEmpresa, value.financieraID));
                        })
                        Promise.all(promises2).then(function response(result) {
                            console.log(result.data)
                            for (i = 0; i < $scope.encabezadoReporte[contador2].reporte.length; i++) {
                                $scope.encabezadoReporte[contador2].reporte[i].subGridOptions = {
                                    columnDefs: [{ name: 'Documento', field: 'CCP_IDDOCTO' },
                                        { name: 'VIN', field: 'VIN' },
                                        { name: 'Saldo documento', field: 'saldo' },
                                        { name: 'Plazo', field: 'plazo' },
                                        { name: 'Dias', field: 'dias' },
                                        { name: 'TIIE', field: 'tiie' },
                                        { name: 'Spread', field: 'puntos' },
                                        { name: 'Intereses', field: 'totalInteres' },
                                        { name: 'Estrella', field: 'estrella' },
                                        { name: 'Doble Estrella', field: 'dobleEstrella' }
                                    ],
                                    data: result[i].data
                                };
                            }
                            contador2++;
                        }).catch(error => console.log('Ocurrio un error al obtener datos reporte' + error))
                        // angular.forEach(reporteEncabezado[key].data, function(value, key) {
                        //     value.subGridOptions = {
                        //         columnDefs: [{ name: 'Documento', field: 'CCP_IDDOCTO' },
                        //             { name: 'VIN', field: 'VIN' },
                        //             { name: 'Saldo documento', field: 'saldo' },
                        //             { name: 'Plazo', field: 'plazo' },
                        //             { name: 'Dias', field: 'dias' },
                        //             { name: 'TIIE', field: 'tiie' },
                        //             { name: 'Spread', field: 'puntos' },
                        //             { name: 'Intereses', field: 'totalInteres' },
                        //             { name: 'Estrella', field: 'estrella' },
                        //             { name: 'Doble Estrella', field: 'dobleEstrella' }
                        //         ],
                        //         data: [{
                        //             'CCP_IDDOCTO': 'hola',
                        //             'VIN': 'hola',
                        //             'saldo': 'hola',
                        //             'plazo': 'hola',
                        //             'dias': 'hola',
                        //             'tiie': 'hola',
                        //             'puntos': 'hola',
                        //             'totalInteres': 'hola',
                        //             'estrella': 'hola',
                        //             'dobleEstrella': 'hola'
                        //         }]
                        //     };
                        // });
                        // $scope.encabezadoReporte[contador].reporte = reporteEncabezado[key].data;
                        contador++;
                    }
                });
                console.log($scope.encabezadoReporte, 'Soy las empresas que si tiene detalle')
                angular.forEach($scope.encabezadoReporte, function(value, key) {
                    
                    //BEGIN UI GRID
                    $scope.gridOptions[key] = {
                        expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" style="height:150px;"></div>',
                        expandableRowHeight: 150,
                        //subGridVariable will be available in subGrid scope
                        expandableRowScope: {
                            subGridVariable: 'subGridScopeVariable'
                        }
                    };
                    $scope.gridOptions[key].columnDefs = [
                        { name: 'Financiera', field: 'nombre' },
                        { name: 'TIIE', field: 'tiie' },
                        { name: 'Spread', field: 'puntos' },
                        { name: '--', field: 'sumaTP' },
                        { name: 'Línea Autorizada', field: 'lineaAutorizada' },
                        { name: 'unidades', field: 'unidades' },
                        { name: 'Línea utilizada', field: 'saldo' },
                        { name: 'Línea disponible', field: 'lineaResto' },
                        { name: 'unidades', field: 'unidades' },
                        { name: 'Inventario', field: 'saldo' },
                        { name: 'Unidades en Estrella', field: 'estrella' },
                        { name: 'Estrella', field: 'estrellaMonto' },
                        { name: 'Unidades doble Estrella', field: 'dobleEstrella' },
                        { name: 'Doble Estrella', field: 'dobleEstrellaMonto' }
                    ];
                    $scope.gridOptions[key].onRegisterApi = function(gridApi) {
                        $scope.gridApi[key] = gridApi;
                    };

                    $scope.expandAllRows = function() {
                        $scope.gridApi[key].expandable.expandAllRows();
                    };

                    $scope.collapseAllRows = function() {
                        $scope.gridApi[key].expandable.collapseAllRows();
                    };

                    $scope.toggleExpandAllBtn = function() {
                        $scope.gridOptions[key].showExpandAllButton = !$scope.gridOptions[key].showExpandAllButton;
                    };
                    // END UI GRID
                    $scope.gridOptions[key].data = value.reporte;
                    value.group = $scope.gridOptions[key];
                })
                $scope.$apply();
            }).catch(error => console.log('Ocurrio un error al obtener datos reporte' + error))
            // angular.forEach($scope.lstEmpresa, function(value, key) {

            // });
            console.log($scope.lstEmpresa, 'LASEMPRESAS :S')
        });
    };
});