appModule.controller('reporteController', function($scope, $rootScope, $location, commonFactory, reporteFactory, staticFactory) {
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
        angular.forEach($scope.datosReporte, function(value, key) {
            $scope.totalUnidades = $scope.totalUnidades + value.unidades;
            $scope.totalLineaUtilizada = $scope.totalLineaUtilizada + value.saldo;
            $scope.totalUnidadesInventario = $scope.totalUnidadesInventario + value.unidades;
            $scope.totalIventario = $scope.totalIventario + value.saldo;
            $scope.unidadesEstrella = $scope.unidadesEstrella + 1;
            $scope.totalEstrella = $scope.totalEstrella + 1;
            $scope.unidadesDobleE = $scope.unidadesDobleE + 1;
            $scope.totalDobleE = $scope.totalDobleE + 1;
        });
    }, function err(error) {
        console.log(error);
    });
});