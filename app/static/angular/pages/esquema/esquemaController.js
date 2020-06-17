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
        //$scope.esquemaHeader.tiie = objSchema.tiie;
        $scope.esquemaHeader.selectedOption = _.where($scope.lstTiie, { tipoTiieId: result.data[0].tipoTiieCID })[0];
        $scope.esquemaHeader.selectedtipoColateral = _.where($scope.lstTipoColateral, { idtipoColateral: result.data[0].tipoColateralID })[0];
    });
}
    $scope.setCurrentFinancial = function(financialObj) {
        $scope.showAddBtn = true;
        $scope.currentPanel = "pnlFinanciera";
        $scope.currentFinancialName = financialObj.nombre;
        $scope.currentFinancialID = financialObj.financieraID;
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