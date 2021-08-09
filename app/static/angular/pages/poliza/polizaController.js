appModule.controller('polizaController', function($scope, polizaFactory,staticFactory) {

    $scope.idUsuario = parseInt(localStorage.getItem("idUsuario"))
    $scope.session = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.lstPermisoBoton = JSON.parse(sessionStorage.getItem("PermisoUsuario"));
    $scope.currentEmpresa = $scope.session.nombre;
    $scope.topBarNav = polizaFactory.topNavBar();
    console.log($scope.session)
 
    $scope.obtienePeriodosActivos= function(){
        var parametros = {
            idEmpresa:      $scope.session.empresaID,
            periodo: undefined
          
        }
        polizaFactory.obtienePeriodosActivos(parametros).then(function(result) {
            if( result.data.length != 0 ){
                $scope.lstPeriodos = result.data[1];
                $scope.setPeriodo($scope.lstPeriodos[0]);
            }
        });
    }   
     

    $scope.setPeriodo = function(item) {
        // $scope.listUnidades = _.where($scope.lstNewUnits, { isChecked: true });
        $scope.currentPeriodo =item;
        $scope.currentNombrePeriodo =item.periodo;
        var parametros = {
            idEmpresa:      $scope.session.empresaID,
            periodo: item.periodo
          
        }
        polizaFactory.obtienePeriodosActivos(parametros).then(function(result) {
            if( result.data.length != 0 ){
                $scope.lstPendiente = result.data[0];
                $scope.setResetTable('tblNormalesCancel', 'Cancelacion', 6);
               
            }
        });
      
    };
    $scope.CancelaPoliza = function(item) {
        swal({
            title: "Compensación Plan Piso",
            text: "¿Desea cancelar la compensación?",
            showCancelButton: true,
            closeOnConfirm: true,
            showLoaderOnConfirm: true
        }, function () {
            
            var parametros = {
                agencia:      item.agencia,
                documento:      item.documento,
                fechabusqueda:      item.fecha,
                horabusqueda:      item.hora
              
            }
            polizaFactory.CancelaPoliza(parametros).then(function(result) {
                swal("Aviso", "Se ha cancelado correctamente", "warning");
                var parametros = {
                    idEmpresa:      $scope.session.empresaID,
                    periodo: $scope.currentNombrePeriodo 
                  
                }
                polizaFactory.obtienePeriodosActivos(parametros).then(function(result) {
                    if( result.data.length != 0 ){
                        $scope.lstPendiente = result.data[0];
                    }
                });
            }, function(error) {
                console.log("Error", error);
            });
        });
    
      
    };
    $scope.setResetTable = function(tblID, display, length) {
        staticFactory.setTableStyleClass('.' + tblID, display, length)
    };
});