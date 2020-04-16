appModule.controller('empresaController', function($scope, $rootScope, $location, commonFactory, staticFactory, empresaFactory) {
    // sessionStorage.removeItem("sessionFactory");
    $scope.idUsuario        = localStorage.getItem("idUsuario");
    $scope.nombreUsuario    = localStorage.getItem("nombreUsuario");
    $scope.lstEmpresa       = [];

    empresaFactory.getEmpresa( $scope.idUsuario ).then(function(result) {
        $scope.lstEmpresa = result.data[0];
    });


    $scope.setEmpresa = function( index ) {
        // alert('Hola mundo');
        var current = $scope.lstEmpresa[ index ];
        var sessionFactory = { nombre: current.emp_nombre, empresaID: current.emp_idempresa };
        console.log( sessionFactory );
        sessionStorage.setItem("sessionFactory", JSON.stringify(sessionFactory));
        window.location = "/unuevas";
    };


    // $scope.test = function() {
    //     staticFactory.message();
    // };




});