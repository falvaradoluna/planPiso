appModule.controller("indexController", function($scope) {
    setTimeout(function(){ $(".init-loading").hide(); }, 500)
    
    if (!($('#idUsuario').val().indexOf('[') > -1)) {
        localStorage.setItem("idUsuario", $('#idUsuario').val())
    } 
    else {
        var idUser = localStorage.getItem("idUsuario");
        if( idUser === null || idUser == 0 ){
            $scope.warningMsg = 'Favor de ingresar mediante el Panel de Aplicaciones';
        }
        else{
            // alert( "Desde localStorage: " + idUser );
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