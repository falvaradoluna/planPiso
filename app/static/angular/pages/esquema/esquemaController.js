appModule.controller('esquemaController', function($scope, $rootScope, $filter, $location, commonFactory, staticFactory, esquemaFactory) {

    var sessionFactory = JSON.parse(sessionStorage.getItem("sessionFactory"));
    var regularExpression = staticFactory.getRegExp();

    $scope.currentEmpresa = sessionFactory.nombre;
    $scope.currentFinancialName = "Selecciona Financiera";
    $scope.currentPanel = "pnlFinanciera";
    $scope.currentEsquema = 0;
    $scope.currentEsquemaDetail = 0;
    $scope.usuarioID = 0;
    $scope.editAddTitle = "";
    $scope.lstFinancial = [];
    $scope.lstSchemeDetail = [];
    $scope.lstTiie = [];
    $scope.currentFinancialID = 0;
    $scope.showAddBtn = false;
    $scope.showEditBtn = false;
    $scope.agregareditar=false;
    $scope.esquemaHeader = esquemaFactory.initSchemaHeader();

    $scope.topBarNav = staticFactory.esquemaBar();

    commonFactory.getFinancial(sessionFactory.empresaID).then(function(result) {
        $scope.lstFinancial = result.data;
    });
    commonFactory.getTipoTiie().then(function(result) {
        $scope.lstTiie = result.data;
    });
    commonFactory.getTipoColateral().then(function(result) {
        $scope.lstTipoColateral = result.data;
    });
    $scope.validateSchemaHeader = function() {
        var esquemaFormControls = esquemaFactory.setHeaderValues($scope.esquemaHeader, regularExpression);
        var isValid = esquemaFactory.formIsvalid(esquemaFormControls);
        if (isValid === true) $scope.insertSchemaHeader();
    };
    $scope.insertSchemaHeader = function() {

        var params = {
            usuarioID: $scope.usuarioID,
            financieraID: $scope.currentFinancialIDAP,
            diasGracia: $scope.esquemaHeader.diasGracia,
            plazo: $scope.esquemaHeader.plazo,
            nombre: $scope.esquemaHeader.nombre,
            interesMoratorio: $scope.esquemaHeader.interesMoratorio,
            usuarioID: $scope.usuarioID,
            tasaInteres: $scope.esquemaHeader.tasaInteres,
            tieneDPP: $scope.esquemaHeader.tieneDPP,
            tieneReduccion: $scope.esquemaHeader.tieneReduccion,
            fechaInicio: $scope.esquemaHeader.fechaInicio,
            fechaFin: $scope.esquemaHeader.fechaFin,
            porcentajePenetracion: $scope.esquemaHeader.porcentajePenetracion,
            tipoTiieCID: $scope.esquemaHeader.selectedOption.tipoTiieId,
            tipoColateralId:$scope.esquemaHeader.selectedtipoColateral.idtipoColateral,
            tiie: $scope.esquemaHeader.tiie,
        };

        esquemaFactory.putScheme(params).then(function(result) {
            console.log(result.data);
            $scope.currentEsquema=result.data[0].id;
            if($scope.esquemaHeader.tieneReduccion==1)
            {
                var resultado='';
                for (var i=0; i<$scope.esquemaHeader.lstreduccion.length; i++) { 
                    resultado=resultado+'|'+$scope.esquemaHeader.lstreduccion[i].dia+','+$scope.esquemaHeader.lstreduccion[i].porcentaje
                  }
                 
                  if(resultado.length>0)
                  {
                    resultado=resultado.substring(1,resultado.length);
                    var params2 = {
                        lista: resultado,
                        esquemaID: $scope.currentEsquema
                    };
                    esquemaFactory.guardarListaReduccion(params2).then(function(result) {
                        console.log(result.data);
                    });
                  }
            }
            swal('Guardado', 'Insertado con exito', 'success');
            $scope.getSchemas($scope.currentFinancialID);
            $scope.backToPrincipal();
        });
    };
$scope.ColateralChange= function(){
    var item = $scope.esquemaHeader.selectedtipoColateral;
    var params = {
        idempresa: sessionFactory.empresaID,
        idtipoColateral: item.idtipoColateral,
        idfinanciera: $scope.currentFinancialID
    };

    esquemaFactory.getPlantilla(params).then(function(result) {
       
        $scope.esquemaHeader.diasGracia = result.data[0].diasGracia;
        $scope.esquemaHeader.plazo = result.data[0].plazo;
        $scope.esquemaHeader.interesMoratorio = result.data[0].interesMoratorio;
        $scope.esquemaHeader.tasaInteres = result.data[0].tasaInteres;
        $scope.esquemaHeader.porcentajePenetracion = result.data[0].porcentajePenetracion;
        $scope.esquemaHeader.tieneReduccion = result.data[0].tieneReduccion;
        $scope.esquemaHeader.tieneDPP = result.data[0].tieneDPP;
        $scope.esquemaHeader.fechaInicio = result.data[0].fechaInicio;
        $scope.esquemaHeader.fechaFin = result.data[0].fechaFin;
        if($scope.esquemaHeader.tieneReduccion==1)
        $scope.esquemaHeader.lstreduccion = $scope.regresatabla(result.data[0].reducciondetalle);
        $scope.esquemaHeader.selectedOption = _.where($scope.lstTiie, { tipoTiieId: result.data[0].tipoTiieCID })[0];
        $scope.esquemaHeader.selectedtipoColateral = _.where($scope.lstTipoColateral, { idtipoColateral: result.data[0].tipoColateralID })[0];
    });
}
$scope.regresatabla= function(arreglo)
{
    var tablaregreso=[];
    var array = arreglo.split('|');
    for (var i=0; i<array.length; i++) {
        var array2 = array[i].split(',');
        var newobject={
            dia:array2[0],
            porcentaje:array2[1]
        }
        tablaregreso.push(newobject);
      }

    return tablaregreso;


}
$scope.AgregarDetail=function(){
    $scope.agregareditar=true;
    $scope.nuevo=1;
    $scope.ctrl={};
    $scope.ctrl.dia=0;
    $scope.ctrl.porcentaje=0;
}
$scope.GuardarDetail=function(){
    if($scope.nuevo==1)
    {
        var newobject={
            dia:$scope.ctrl.dia,
            porcentaje:$scope.ctrl.porcentaje
        }
        $scope.esquemaHeader.lstreduccion.push(newobject);
    }else
    {
        for (var i=0; i<$scope.esquemaHeader.lstreduccion.length; i++) { 
            if ($scope.esquemaHeader.lstreduccion[i].dia == $scope.ctrl.dia) {
                $scope.esquemaHeader.lstreduccion[i].porcentaje = $scope.ctrl.porcentaje;
               break; //Stop this loop, we found it!
            }
          }

    }
    $scope.ctrl.dia=0;
    $scope.ctrl.porcentaje=0;
    $scope.agregareditar=false;
}
$scope.CancelarDetail=function(){
    $scope.ctrl.dia=0;
    $scope.ctrl.porcentaje=0;
    $scope.agregareditar=false;
}
$scope.EditarDetail=function(item){
    $scope.agregareditar=true;
    $scope.ctrl={};
    $scope.nuevo=0;
    $scope.ctrl.dia=item.dia;
    $scope.ctrl.porcentaje=item.porcentaje;
   
}
$scope.BorrarDetail=function(item){
    $scope.esquemaHeader.lstreduccion.splice($scope.esquemaHeader.lstreduccion.findIndex(v =>v.dia===item.dia),1);
}
    $scope.setCurrentFinancial = function(financialObj) {
        $scope.showAddBtn = true;
        $scope.currentPanel = "pnlFinanciera";
        $scope.currentFinancialName = financialObj.nombre;
        $scope.currentFinancialID = financialObj.financieraIDBP;
        $scope.currentFinancialIDAP = financialObj.financieraIDAP;
        $scope.getSchemas($scope.financieraIDAP);
    };
    $scope.getSchemas = function() {
        $('#mdlLoading').modal('show');
        commonFactory.getSchemas( $scope.currentFinancialIDAP).then(function(result) {
            $('#tblSchemas').DataTable().destroy();
            $scope.lstSchemas = result.data;
            $('#mdlLoading').modal('hide');
        });
    };
    $scope.initTblSchemas = function() {
        $scope.setTableStyle('#tblSchemas');
    };
    $scope.setTableStyle = function(tblID) {
        staticFactory.setTableStyleOne(tblID);
    };
    $scope.newSchema = function() {
        $scope.isAddMode = true;
    };
    $scope.CambiarReduccion = function() {
        $scope.esquemaHeader.tieneReduccion = $scope.reducc;
    };
    $scope.addSchema = function() {
        $scope.isAddMode = true;
        $scope.showAddBtn = false;
        $scope.showEditBtn = false;
        $scope.currentPanel = "pnlEsquema";
        $scope.editAddTitle = "Nuevo esquema: " + $scope.currentFinancialName;
        $scope.esquemaHeader = esquemaFactory.initSchemaHeader();
    };
    $scope.deleteSchema = function(objSchema) {
        $scope.currentEsquema = objSchema.esquemaID;
        var params = {
            esquemaID: $scope.currentEsquema
        };
        esquemaFactory.deleteScheme(params).then(function(result) {
            console.log(result.data);
            swal('Guardado', 'Esquema borrado con exito', 'success');
            $scope.getSchemas($scope.currentFinancialID);
            $scope.backToPrincipal();
        });
    };

    $scope.backToPrincipal = function() {
        $scope.showAddBtn = true;
        $scope.showEditBtn = false;
        $scope.currentPanel = "pnlFinanciera";
        $scope.esquemaHeader = esquemaFactory.initSchemaHeader();
    };
    $scope.editSchema = function(objSchema) {
        $scope.currentEsquema = objSchema.esquemaID;
        $scope.isAddMode = true;
        $scope.showAddBtn = false;
        $scope.showEditBtn = true;
        $scope.currentPanel = "pnlEsquema";
        $scope.editAddTitle = "Editando esquema: " + objSchema.nombre;
        var params2 = {
            esquemaID: $scope.currentEsquema
        };
        esquemaFactory.obtenListaReduccion(params2).then(function(result) {
            $scope.esquemaHeader.lstreduccion=result.data;
        });

        $scope.setSchemaHeaderData(objSchema);
    };
    $scope.setSchemaHeaderData = function(objSchema) {
        $scope.esquemaHeader.nombre = objSchema.nombre;
        $scope.esquemaHeader.diasGracia = objSchema.diasGracia;
        $scope.esquemaHeader.plazo = objSchema.plazo;
        $scope.esquemaHeader.interesMoratorio = objSchema.interesMoratorio;
        $scope.esquemaHeader.tasaInteres = objSchema.tasaInteres;
        $scope.esquemaHeader.porcentajePenetracion = objSchema.porcentajePenetracion;
        $scope.esquemaHeader.tieneReduccion = objSchema.tieneReduccion;
        $scope.esquemaHeader.tieneDPP = objSchema.tieneDPP;
        $scope.esquemaHeader.fechaInicio = objSchema.fechaInicio;
        $scope.esquemaHeader.fechaFin = objSchema.fechaFin;
        $scope.esquemaHeader.tiie = objSchema.tiie;
        $scope.esquemaHeader.selectedOption = _.where($scope.lstTiie, { tipoTiieId: objSchema.tipoTiieCID })[0];
        $scope.esquemaHeader.selectedtipoColateral = _.where($scope.lstTipoColateral, { idtipoColateral: objSchema.tipoColateralId })[0];

    };
    $scope.validateSchemaHeaderEdit = function() {
        var esquemaFormControls = esquemaFactory.setHeaderValues($scope.esquemaHeader, regularExpression);
        var isValid = esquemaFactory.formIsvalid(esquemaFormControls);
        if (isValid === true) $scope.updSchemaHeader();
    };
    $scope.updSchemaHeader = function() {

        var params = {
            esquemaID: $scope.currentEsquema,
            usuarioID: $scope.usuarioID,
            financieraID: $scope.currentFinancialIDAP,
            diasGracia: $scope.esquemaHeader.diasGracia,
            plazo: $scope.esquemaHeader.plazo,
            nombre: $scope.esquemaHeader.nombre,
            interesMoratorio: $scope.esquemaHeader.interesMoratorio,
            tasaInteres: $scope.esquemaHeader.tasaInteres,
            tieneDPP: $scope.esquemaHeader.tieneDPP?1:0,
            tieneReduccion: $scope.esquemaHeader.tieneReduccion?1:0,
            fechaInicio: $scope.esquemaHeader.fechaInicio,
            fechaFin: $scope.esquemaHeader.fechaFin,
            porcentajePenetracion: $scope.esquemaHeader.porcentajePenetracion,
            tipoTiieCID: $scope.esquemaHeader.selectedOption.tipoTiieId,
            tipoColateralId: $scope.esquemaHeader.selectedtipoColateral.idtipoColateral,
            tiie: $scope.esquemaHeader.tiie,
        };

        esquemaFactory.updEsquema(params).then(function(result) {
            swal('Guardado', 'Esquema guardado con exito', 'success');
            if($scope.esquemaHeader.tieneReduccion==1)
            {
                var resultado='';
                for (var i=0; i<$scope.esquemaHeader.lstreduccion.length; i++) { 
                    resultado=resultado+'|'+$scope.esquemaHeader.lstreduccion[i].dia+','+$scope.esquemaHeader.lstreduccion[i].porcentaje
                  }
                 
                  if(resultado.length>0)
                  {
                    resultado=resultado.substring(1,resultado.length-1);
                    var params2 = {
                        lista: resultado,
                        esquemaID: $scope.currentEsquema
                    };
                    esquemaFactory.guardarListaReduccion(params2).then(function(result) {
                        console.log(result.data);
                    });
                  }
            }
            $scope.getSchemas($scope.currentFinancialID);
            $scope.backToPrincipal();
        });
    };

    $scope.validateSchemaDetailsEdit = function() {
        var esquemaFormControls = esquemaFactory.setDetailsValues($scope.esquemaDetalle, regularExpression);
        var isValid = esquemaFactory.formIsvalid(esquemaFormControls);
        if (isValid === true) $scope.updSchemaDetails();
    };
    $scope.cancelDetailEdit = function() {
        $scope.esquemaDetalle = esquemaFactory.initSchemaDetail();
        $scope.editAddTitle = "Agregar detalle esquema: " + $scope.currentFinancialName;
        $scope.showEditBtn = false;
    };
    $scope.setCalendarStyle = function() {
        setTimeout(function() {
            staticFactory.setCalendarStyle();
        }, 500);
    };
    $scope.dateOverlap = function(initDate, endDate, listObj) {
        var isOk = false;

        for (var i = 0; i < listObj.length; i++) {
            isOk = staticFactory.dateExist(initDate, endDate, listObj[i].fechaInicio, listObj[i].fechaFin);
            if (isOk) break;
        }

        return isOk;
    };
});