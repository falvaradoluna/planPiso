appModule.controller('reporteController', function($scope, $rootScope, $location, commonFactory, reporteFactory, staticFactory, uiGridConstants, uiGridGroupingConstants) {
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
                    columnDefs: [{ name: 'CCP_IDDOCTO', field: 'CCP_IDDOCTO' }, { name: 'VIN', field: 'VIN' }],
                    data: result[i].data
                };
            }
            console.log($scope.datosReporte)
            $scope.gridOptions.data = $scope.datosReporte;
        }).catch(error => console.log('Ocurrio un error al cambiar la fecha promesa' + error))
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
        { name: 'Puntos', field: 'puntos' },
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
        $scope.gridOptions.showExpandAllButton = !vm.gridOptions.showExpandAllButton;
    };
    // END UI GRID
});