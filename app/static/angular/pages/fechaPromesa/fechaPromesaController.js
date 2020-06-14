appModule.controller('fechaPromesaController', function($scope, $rootScope, $location, fechaPromesaFactory, commonFactory, staticFactory, alertFactory) {
    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.idUsuario = localStorage.getItem("idUsuario");
    $scope.currentEmpresa = sessionFactory.nombre;
    $scope.topBarNav = staticFactory.fechaPromesaBar();
    $scope.currentSucursalName = "Seleccione una sucursal";
    $scope.financieraSeleccionada = false;
    commonFactory.getSucursal(sessionFactory.empresaID, $scope.idUsuario).then(function(result) {
        $scope.lstSucursal = result.data;
    });
    $scope.setCurrentSucursal = function(sucursal) {
        console.log(sucursal);
        $scope.financieraSeleccionada = false;
        $scope.currentSucursalName = sucursal.nombreSucursal;
        commonFactory.getFinancieraSucursal(sessionFactory.empresaID, sucursal.sucursalID).then(function success(result) {
            $scope.nombreFinanciera = 'Seleccione Financiera';
            $scope.financieras = result.data;
            console.log(result.data);
        }, function error(err) {
            console.log(err, 'No se pudo obtener las financieras')
        });
    };
    $scope.seleccionFinanciera = function(financiera) {
        $scope.nombreFinanciera = financiera.financiera;
        $scope.financiera = financiera;
        $scope.financieraSeleccionada = true;
    };
    $scope.getCartera = function() {
        getCarteras(0);
    };
    $scope.getCarteraVencida = function() {
        getCarteras(1);
    };
    var getCarteras = function(tipoCartera) { // 0 Toda la cartera 1 Cartera Vencida
        fechaPromesaFactory.getCartera(sessionFactory.empresaID, $scope.financiera.idPersona, tipoCartera).then(function success(result) {
            console.log(result.data);
            $scope.carteras = result.data;
            staticFactory.setTableStyleFechaPromesa('#carteras')
        }, function error(err) {
            console.log('Ocurrio un error al tratar de obtener la cartera', err);
        });
    };
    $scope.select = function(item) {
        item.seleccionada == false || item.seleccionada == undefined ? item.seleccionada = true : item.seleccionada = false;
    };
    $scope.SeleccionarTodo = function() {
        if ($scope.seleccionarTodo == true) {
            var table = $('#carteras').DataTable();
            var rowSelected = table.rows({ search: 'applied' }).data();
            var cartera = '';
            angular.forEach(rowSelected, function(value, key) {
                cartera = value[0];
                angular.forEach($scope.carteras, function(value, key) {
                    if (value.pbp_consCartera == cartera) {
                        value.seleccionada = true;
                    }
                });

            });
        } else if ($scope.seleccionarTodo == false) {
            angular.forEach($scope.carteras, function(value, key) {
                value.seleccionada = false;
            });
        }
        console.log($scope.carteras);
    };
    $scope.MostrarMensaje = function(item) {
        var fechauno = new Date();
        var fechados = new Date(fechauno);
        var resultado = fechauno.getTime() === fechados.getTime();
        var hoy = new Date();
        var fechaSeleccionada = new Date($scope.fechaPromesa);
        if (fechaSeleccionada < hoy) {
            alertFactory.warning("Debe seleccionar una fecha mayor al dia de hoy");
        } else {
            console.log('SACATELAS')
        }


    };
});