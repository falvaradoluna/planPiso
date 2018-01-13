appModule.controller("indexController", function($scope, empresaFactory) {
    // $scope.nombreUsuario    = localStorage.getItem("nombreUsuario");
    $scope.nombreUsuario    = "";

    setTimeout(function(){ $(".init-loading").hide(); }, 500)
    
    if (!($('#idUsuario').val().indexOf('[') > -1)) {
        localStorage.setItem("idUsuario", $('#idUsuario').val())
        empresaFactory.getUsuarioNombre( $('#idUsuario').val() ).then(function(result) {
            localStorage.setItem("nombreUsuario", result.data[0][0].nombre);
            $scope.nombreUsuario    = result.data[0][0].nombre;
        });
        $("#wrapper").show();
    } 
    else {
        var idUser = localStorage.getItem("idUsuario");
        if( idUser === null || idUser == 0 ){
            $scope.warningMsg = 'Favor de ingresar mediante el Panel de Aplicaciones';
        }
        else{
            empresaFactory.getUsuarioNombre( idUser ).then(function(result) {                
                localStorage.setItem("nombreUsuario", result.data[0][0].nombre);
                $scope.nombreUsuario    = result.data[0][0].nombre;
            });
            $(".init-mgs").hide();
            $("#wrapper").show();
        }
    }
    


    // $scope.userLog = "";
    // $scope.userPass = "";

    // var localvar = localStorage.getItem("userData");
    
    // $scope.setConstValues = function() {
    //     var welcomeName = document.getElementById("welcomeName");
    //     var nameUsr = sessionStorage.getItem("lastname");
    //     var usrName = document.getElementById("usrName");
    //     welcomeName.innerHTML = "Bienvenido " + nameUsr;
    //     usrName.innerHTML = nameUsr;
    // };

    // // alert( $('#idUsuario').val() )

    

    // if (sessionStorage.getItem("lastname") == null) {
    //     // window.location = "#pnlLogin";
    // } else {
    //     $scope.setConstValues();
    // }

    // $scope.login = function() {
    //     sessionStorage.setItem("lastname", "Juan Perez");
    //     // window.location = "#";
    //     $scope.setConstValues();
    // };

    // if (sessionStorage.getItem("sessionFactory") == null && window.location.pathname != '/empresa') {
    //     // window.location = "/empresa";
    // }
});