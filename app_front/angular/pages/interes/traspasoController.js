appModule.controller('traspasoController', function($scope, $rootScope, $location, filterFilter, commonFactory, staticFactory, interesFactory, esquemaFactory, traspasoFactory) {
    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.inicioTraspaso = function(){
        var valida = filterFilter( $scope.lstNewUnits , {isChecked: true} );
        
        var auxList = [];
        valida.forEach( function( item, key ){
            if( auxList.indexOf(item.financieraID) === -1 ){
                auxList.push( item.financieraID );
            }
        });

        if( auxList.length === 1){
            $scope.CurrentFinanciera = auxList[0];
            $scope.lstTraspasoFinanciera = filterFilter( $scope.lstFinancial , {financieraID: '!' + $scope.CurrentFinanciera} );
            
            $scope.lstTraspasoFinanciera = filterFilter( $scope.lstFinancial , {financieraID: '!' + $scope.CurrentFinanciera} );
            $scope.lstFinancieraOrigen = filterFilter( $scope.lstFinancial , {financieraID: $scope.CurrentFinanciera} );
            // console.log("$scope.lstFinancieraOrigen", $scope.lstFinancieraOrigen[0].nombre);
        }
        else{
            swal({
                title: "Traspaso entre Financieras",
                text: "Las unidades seleccionadas corresponden a más de una Financiera, asegurate de seleccionar unicamente de una sola."
            }, function(){
                location.reload();
            });
        }
    }

    $scope.setPanelResumen = function() { 
        console.log("$scope.currentFinancial2", $scope.currentFinancial2);
        console.log("$scope.currentSchema2", $scope.currentSchema2);

        if( $scope.currentFinancial2 === undefined ){
            swal("Traspaso de Financiera", "Favor de seleccionar la financiera destino.");
        }
        else if( $scope.currentSchema2 === undefined ){
            swal("Traspaso de Financiera", "Favor de seleccionar el esque de la financiera.");
        }
        else if( $scope.currentFinancial2.length == 0 ){
            swal("Traspaso de Financiera", "Favor de seleccionar la financiera destino.");
        }
        else if( $scope.currentSchema2.length == 0 ){
            swal("Traspaso de Financiera", "Favor de seleccionar el esque de la financiera.");
        }
        else{
    	   $scope.setPnlResumen();
        }
    };

    $scope.setPanelInteres = function() {
        $scope.regresarTraspaso();
    };

    $scope.Traspaso = function() {
        swal({
                title: "¿Esta seguro?",
                text: "Se aplicará el traspaso para las unidades seleccionadas.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#21B9BB",
                confirmButtonText: "Aplicar",
                closeOnConfirm: false
            },
            function() {                
                // console.log("$scope.lstFinancieraOrigen", $scope.lstFinancieraOrigen[0].financieraID);
                // console.log("FinancieraDestino", $scope.currentFinancial2.financieraID);
                // console.log("EsquemaDestino", $scope.currentFinancial2.financieraID);
                // console.log(sessionFactory.empresaID);

                var paraTraspaso = {
                    idUsuario: $scope.idUsuario,
                    idEmpresa: sessionFactory.empresaID,
                    idFinancieraDestino: $scope.lstFinancieraOrigen[0].financieraID,
                    idFinancieraOrigen: $scope.currentFinancial2.financieraID
                }

                traspasoFactory.traspasoFinanciera(paraTraspaso).then(function( respuesta ) {
                    $scope.LastId = respuesta.data[0].LastId;
                    $scope.lstUnitsTraspasos = filterFilter( $scope.lstNewUnits , {isChecked: true} );
                    console.log( "$scope.lstUnitsTraspasos", $scope.lstUnitsTraspasos );
                    $scope.guardaDetalle();
                    // $scope.success();
                }, function(error) {
                    $scope.error(error.data.Message);
                });
            }
        );
    };

    $scope.LastId = 0;
    var contTraspadoDetalle = 0;
    $scope.guardaDetalle = function(){
        if( contTraspadoDetalle < $scope.lstUnitsTraspasos.length ){
            var item = $scope.lstUnitsTraspasos[ contTraspadoDetalle ];
            var paraTraspasoDetalle = {
                idTraspasoFinanciera: $scope.LastId,
                idEsquemaOrigen: item.esquemaID,
                idEsquemaDestino: $scope.currentSchema2.esquemaID,
                CCP_IDDOCTO: item.CCP_IDDOCTO
            }

            traspasoFactory.traspasoFinancieraDetalle(paraTraspasoDetalle).then(function( response ) {
                if( response.length != 0 ){
                    if( contTraspadoDetalle < $scope.lstUnitsTraspasos.length ){
                        contTraspadoDetalle++;
                        $scope.guardaDetalle();
                    }
                }
            }, function(error) {
                $scope.error(error.data.Message);
            });
        }
        else{
            // console.log("Se ejecuta el traspaso " + $scope.LastId);
            traspasoFactory.procesaTraspaso($scope.LastId).then(function( response ) {
                if( response.length != 0 ){
                    swal("Traspaso Plan Piso", "Se ha efectuado correctamente su traspaso.");
                }
            }, function(error) {
                $scope.error(error.data.Message);
            });
        }
    }
});



// $scope.lstNewUnits.forEach(function(item) {
//     if (item.isChecked === true) {
//         var data = {
//             CCP_IDDOCTO: item.CCP_IDDOCTO,
//             usuarioID: $scope.idUsuario,
//             empresaID: item.empresaID,
//             sucursalID: item.sucursalID,
//             financieraID: $scope.currentFinancial2.financieraID,
//             esquemaID: $scope.currentSchema2.esquemaID,
//             tipoMovimientoId: $scope.typeTraspaso //cambio financiera
//         };

//         traspasoFactory.setChangeSchema(data).then(function() {

//         }, function(error) {
//             $scope.error(error.data.Message);
//         });
//     }
// });