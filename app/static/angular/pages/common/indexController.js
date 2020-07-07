appModule.controller("indexController", function($scope, empresaFactory) {
    // $scope.nombreUsuario    = localStorage.getItem("nombreUsuario");
    $scope.nombreUsuario    = "";
    $scope.permisos=function(user)
    {
        empresaFactory.getUsuarioPermisos( user ).then(function(result) {                
            if(result.data[0].length>0)
            {
             $scope.unuevas=undefined;
             $scope.esquema=undefined;
             $scope.financiera=undefined;
             $scope.interes=undefined;
             $scope.polizas=undefined;
             $scope.proveedor=undefined;
             $scope.inventario=undefined;
             $scope.sacarunidad=undefined;
             $scope.conciliacion=undefined;
             $scope.auditoria=undefined;
             $scope.crealote=undefined;
             $scope.fechaPromesa=undefined;
             $scope.reporte=undefined;
             $scope.tiie=undefined;
             $scope.dashboard=undefined;
    
                for(var i=0;i<result.data[0].length;i++)
                {
                     if(result.data[0][i].smo_nombre =="unuevas")
                     {
                         $scope.unuevas=result.data[0][i].smo_nombre;
                     }
                     if(result.data[0][i].smo_nombre =="esquema")
                     {
                         $scope.esquema=result.data[0][i].smo_nombre;
                     }
                     if(result.data[0][i].smo_nombre =="financiera")
                     {
                         $scope.financiera=result.data[0][i].smo_nombre;
                     }
                     if(result.data[0][i].smo_nombre =="interes")
                     {
                         $scope.interes=result.data[0][i].smo_nombre;
                     }
                     if(result.data[0][i].smo_nombre =="polizas")
                     {
                         $scope.polizas=result.data[0][i].smo_nombre;
                     }
                     if(result.data[0][i].smo_nombre =="proveedor")
                     {
                         $scope.proveedor=result.data[0][i].smo_nombre;
                     }
                     if(result.data[0][i].smo_nombre =="inventario")
                     {
                         $scope.inventario=result.data[0][i].smo_nombre;
                     }
                     if(result.data[0][i].smo_nombre =="sacarunidad")
                     {
                         $scope.sacarunidad=result.data[0][i].smo_nombre;
                     }
                     if(result.data[0][i].smo_nombre =="conciliacion")
                     {
                         $scope.conciliacion=result.data[0][i].smo_nombre;
                     }
                     if(result.data[0][i].smo_nombre =="auditoria")
                     {
                         $scope.auditoria=result.data[0][i].smo_nombre;
                     }
                     if(result.data[0][i].smo_nombre =="crealote")
                     {
                         $scope.crealote=result.data[0][i].smo_nombre;
                     }
                     if(result.data[0][i].smo_nombre =="fechaPromesa")
                     {
                         $scope.fechaPromesa=result.data[0][i].smo_nombre;
                     }
                     if(result.data[0][i].smo_nombre =="reporte")
                     {
                         $scope.reporte=result.data[0][i].smo_nombre;
                     }
                     if(result.data[0][i].smo_nombre =="tiie")
                     {
                         $scope.tiie=result.data[0][i].smo_nombre;
                     }
                     if(result.data[0][i].smo_nombre =="dashboard")
                     {
                         $scope.dashboard=result.data[0][i].smo_nombre;
                     }
                     
    
                }
            }
         });
    }
    
    setTimeout(function(){ $(".init-loading").hide(); }, 500)
    
    if (!($('#idUsuario').val().indexOf('[') > -1)) {
        localStorage.setItem("idUsuario", $('#idUsuario').val())
        $scope.permisos($('#idUsuario').val());
        empresaFactory.getUsuarioNombre( $('#idUsuario').val() ).then(function(result) {
            localStorage.setItem("nombreUsuario", result.data[0].nombre);
            $scope.nombreUsuario    = result.data[0].nombre;
           
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
                localStorage.setItem("nombreUsuario", result.data[0].nombre);
                $scope.nombreUsuario    = result.data[0].nombre;
            });
           $scope.permisos(idUser);
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