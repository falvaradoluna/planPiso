appModule.controller('empresaController', function($scope, $rootScope, $location, commonFactory, staticFactory, empresaFactory) {
    // sessionStorage.removeItem("sessionFactory");
    $scope.idUsuario        = localStorage.getItem("idUsuario");
    $scope.nombreUsuario    = localStorage.getItem("nombreUsuario");
    $scope.lstEmpresa       = [];

    empresaFactory.getEmpresa( $scope.idUsuario ).then(function(result) {
        $scope.lstEmpresa = result.data;
    });


    $scope.setEmpresa = function( index ) {
        // alert('Hola mundo');
        var current = $scope.lstEmpresa[ index ];
        var sessionFactory = { nombre: current.emp_nombre, empresaID: current.emp_idempresa, empresaRfc: current.rfc };
        console.log( sessionFactory );
        sessionStorage.setItem("sessionFactory", JSON.stringify(sessionFactory));
        window.location = "/interes";
        $scope.permisos(  $scope.idUsuario );
    };

    $scope.permisos=function(user)
    {
        empresaFactory.getUsuarioPermisos( user ).then(function(result) {                
            if(result.data[0].length>0)
            {
            $scope.lstModulos=result.data[0];

            }
         });
    }
    // $scope.test = function() {
    //     staticFactory.message();
    // };




});