appModule.controller('polizaCompController', function($scope, polizaFactory) {

    $scope.idUsuario = parseInt(localStorage.getItem("idUsuario"))
    $scope.session = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.lstPermisoBoton = JSON.parse(sessionStorage.getItem("PermisoUsuario"));
    $scope.currentEmpresa = $scope.session.nombre;
    $scope.topBarNav = polizaFactory.topNavBar();
    console.log($scope.session)
 
    // $scope.obtienePeriodosActivos= function(){
    //     var parametros = {
    //         idEmpresa:      $scope.session.empresaID,
    //         periodo: undefined
          
    //     }
    //     polizaFactory.obtienePeriodosActivos(parametros).then(function(result) {
    //         if( result.data.length != 0 ){
    //             $scope.lstPeriodos = result.data[1];
    //             $scope.setPeriodo($scope.lstPeriodos[0]);
    //         }
    //     });
    // }   
     

    // $scope.setPeriodo = function(item) {
    //     // $scope.listUnidades = _.where($scope.lstNewUnits, { isChecked: true });
    //     $scope.currentPeriodo =item;
    //     $scope.currentNombrePeriodo =item.periodo;
    //     var parametros = {
    //         idEmpresa:      $scope.session.empresaID,
    //         periodo: item.periodo
          
    //     }
    //     polizaFactory.obtienePeriodosActivos(parametros).then(function(result) {
    //         if( result.data.length != 0 ){
    //             $scope.lstPendiente = result.data[0];
    //         }
    //     });
      
    // };
    // $scope.CancelaPoliza = function(item) {
    //     swal({
    //         title: "Compensación Plan Piso",
    //         text: "¿Desea cancelar la compensación?",
    //         showCancelButton: true,
    //         closeOnConfirm: false,
    //         showLoaderOnConfirm: true
    //     }, function () {
    //         var parametros = {
    //             agencia:      item.agencia,
    //             documento:      item.documento,
    //             fechabusqueda:      item.fecha,
    //             horabusqueda:      item.hora
              
    //         }
    //         polizaFactory.CancelaPoliza(parametros).then(function(result) {
    //             var parametros = {
    //                 idEmpresa:      $scope.session.empresaID,
    //                 periodo: $scope.currentNombrePeriodo 
                  
    //             }
    //             polizaFactory.obtienePeriodosActivos(parametros).then(function(result) {
    //                 if( result.data.length != 0 ){
    //                     $scope.lstPendiente = result.data[0];
    //                 }
    //             });
    //         }, function(error) {
    //             console.log("Error", error);
    //         });
    //     });
    
      
    // };
   
});