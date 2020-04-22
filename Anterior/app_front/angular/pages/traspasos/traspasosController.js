appModule.controller('traspasosController', function($scope, $rootScope, $location, traspasosFactory, provisionFactory, commonFactory, staticFactory, filterFilter ) {
    $scope.idUsuario            = parseInt( localStorage.getItem( "idUsuario" ) )
    
    $scope.currentPanel = 'pnlHome';

    $scope.obtieneTodos = function(){
    	traspasosFactory.obtieneTodos().then(function(result) {
            $scope.Datos = result.data;
        });
    }

    $scope.Detalle = function( idTraspasoFinanciera ){
    	traspasosFactory.obtieneDetalle( idTraspasoFinanciera ).then(function(result) {
    		$scope.currentPanel = 'pnlDetale';
            $scope.Detalle = result.data;
            $scope.Registros = $scope.Detalle[1];
            console.log( "$scope.Detalle", $scope.Detalle );
        });
    }

    $scope.regresar = function(){
    	location.reload();
    }
});