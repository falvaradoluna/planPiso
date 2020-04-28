appModule.controller('crealoteController', function($scope, $rootScope, $location, crealoteFactory, commonFactory, staticFactory, filterFilter ) {
    $scope.idUsuario            = parseInt( localStorage.getItem( "idUsuario" ) )
    
    $scope.currentPanel = 'pnlHome';
    $scope.topBarNav            = staticFactory.crealoteBar();
    $scope.obtieneTodos = function(){
    	crealoteFactory.obtieneTodos().then(function(result) {
            $scope.Datos = result.data;
        });
    }

    $scope.Detalle = function( idTraspasoFinanciera ){
    	crealoteFactory.obtieneDetalle( idTraspasoFinanciera ).then(function(result) {
    		$scope.currentPanel = 'pnlDetalle';
            $scope.Detalle = result.data;
            $scope.Registros = $scope.Detalle[1];
            console.log( "$scope.Detalle", $scope.Detalle );
        });
    }

    $scope.regresar = function(){
    	location.reload();
    }
});