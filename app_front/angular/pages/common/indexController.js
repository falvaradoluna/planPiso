appModule.controller("indexController", function($scope) {

    $scope.userLog = "";
    $scope.userPass = "";

    var localvar = localStorage.getItem("userData");
    console.log(localvar);
    
    $scope.setConstValues = function() {
        var welcomeName = document.getElementById("welcomeName");
        var nameUsr = sessionStorage.getItem("lastname");
        var usrName = document.getElementById("usrName");
        welcomeName.innerHTML = "Bienvenido " + nameUsr;
        usrName.innerHTML = nameUsr;
    };

    // alert( $('#idUsuario').val() )

    if (!($('#idUsuario').val().indexOf('[') > -1)) {     // Cuando viene de control de aplicaciones
        // $rootScope.currentEmployee = $('#lgnUser').val();
        alert( $('#idUsuario').val() );

        // $scope.permisos($rootScope.currentEmployee);
    } 
    else {                                              // Cuando NO vienen de control de aplicaciones
        alert('No se ha encontrado el inicio desde Control de Aplicaciones');
    }
    

    if (sessionStorage.getItem("lastname") == null) {
        // window.location = "#pnlLogin";
    } else {
        $scope.setConstValues();
    }

    $scope.login = function() {
        sessionStorage.setItem("lastname", "Juan Perez");
        // window.location = "#";
        $scope.setConstValues();
    };

    if (sessionStorage.getItem("sessionFactory") == null && window.location.pathname != '/empresa') {
        // window.location = "/empresa";
    }


});