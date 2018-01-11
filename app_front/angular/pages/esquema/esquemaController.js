appModule.controller('esquemaController', function($scope, $rootScope, $location, commonFactory, staticFactory, esquemaFactory) {

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
    $scope.esquemaDetalle = esquemaFactory.initSchemaDetail();

    $scope.topBarNav = staticFactory.esquemaBar();

    commonFactory.getFinancial().then(function(result) {
        $scope.lstFinancial = result.data;
    });

    commonFactory.getCatalog(10).then(function(result) {
        $scope.lstTiie = result.data;
    });


    $scope.validateSchemaHeader = function() {
        var esquemaFormControls = esquemaFactory.setHeaderValues($scope.esquemaHeader, regularExpression);
        var isValid = esquemaFactory.formIsvalid(esquemaFormControls);
        if (isValid === true) $scope.insertSchemaHeader();
    };

    $scope.insertSchemaHeader = function() {

        var params = {
            usuarioID: $scope.usuarioID,
            financieraID: $scope.currentFinancialID,
            diasGracia: $scope.esquemaHeader.diasGracia,
            plazo: $scope.esquemaHeader.plazo,
            nombre: $scope.esquemaHeader.nombre,
            descripcion: $scope.esquemaHeader.descripcion,
            interesMoratorio: $scope.esquemaHeader.interesMoratorio

        };

        esquemaFactory.putScheme(params).then(function(result) {

            swal({
                    title: "Esquema creado",
                    text: "¿Desea agregar detalles?",
                    type: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#21B9BB",
                    confirmButtonText: "Agregar Detalles",
                    cancelButtonText: "Más tarde",
                    closeOnConfirm: true,
                    closeOnCancel: true
                },
                function(isConfirm) {
                    if (isConfirm) {
                        var objSchema = { esquemaID: result.data[0].result };
                        $scope.showSchemaDetail(objSchema);
                    } else {
                        $scope.getSchemas($scope.currentFinancialID);
                        $scope.backToPrincipal();
                        $scope.$apply();
                    }
                });

        });
    };

    $scope.getSchemaDetail = function(schemaID) {
        esquemaFactory.getSchemeDetail(schemaID).then(function(result) {
            $scope.lstSchemeDetail = result.data;
        });
    };


    $scope.validateSchemaDetails = function() {
        var esquemaFormControls = esquemaFactory.setDetailsValues($scope.esquemaDetalle, regularExpression);
        var isValid = esquemaFactory.formIsvalid(esquemaFormControls);
        if (isValid === true) $scope.insertSchemaDetails();
    };

    $scope.insertSchemaDetails = function() {

        var overlap = $scope.dateOverlap($scope.esquemaDetalle.fechaInicio, $scope.esquemaDetalle.fechaFin, $scope.lstSchemeDetail);

        if (overlap === true) {
            swal('Aviso', 'El rango de fechas ya esta contenido en otro detalle.', 'warning');
        } else {

            var params = {
                usuarioID: $scope.usuarioID,
                esquemaID: $scope.currentEsquema,
                tasaInteres: $scope.esquemaDetalle.tasaInteres,
                fechaInicio: $scope.esquemaDetalle.fechaInicio,
                fechaFin: $scope.esquemaDetalle.fechaFin,
                porcentajePenetracion: $scope.esquemaDetalle.porcentajePenetracion,
                tipoTiieCID: $scope.esquemaDetalle.selectedOption.valor,
                tiie: $scope.esquemaDetalle.tiie,
            };

            esquemaFactory.putSchemeDetail(params).then(function(result) {
                console.log(result.data);
                $scope.esquemaDetalle = esquemaFactory.initSchemaDetail();
                var objSchema = { esquemaID: $scope.currentEsquema };
                $scope.showSchemaDetail(objSchema);
                swal('Guardado', 'Detalle guardado con exito', 'success');
            });
        }


    };

    $scope.setCurrentFinancial = function(financialObj) {
        $scope.showAddBtn = true;
        $scope.currentPanel = "pnlFinanciera";
        $scope.currentFinancialName = financialObj.nombre;
        $scope.currentFinancialID = financialObj.financieraID;
        $scope.getSchemas($scope.currentFinancialID);
    };

    $scope.getSchemas = function(financialId) {
        $('#mdlLoading').modal('show');
        commonFactory.getSchemas(financialId).then(function(result) {
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
    };


    $scope.showSchemaDetail = function(objSchema) {

        $scope.currentEsquema = objSchema.esquemaID;
        $scope.isAddMode = true;
        $scope.showAddBtn = false;
        $scope.currentPanel = "pnlAgregarEsquemaDetalle";
        $scope.editAddTitle = "Agregar detalle esquema: " + $scope.currentFinancialName;
        $scope.getSchemaDetail(objSchema.esquemaID);
        $scope.esquemaDetalle = esquemaFactory.initSchemaDetail();
        $scope.setCalendarStyle();
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
        $scope.esquemaHeader.descripcion = objSchema.descripcion;
        $scope.esquemaHeader.diasGracia = objSchema.diasGracia;
        $scope.esquemaHeader.plazo = objSchema.plazo;
        $scope.esquemaHeader.interesMoratorio = objSchema.interesMoratorio;
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
            financieraID: $scope.currentFinancialID,
            diasGracia: $scope.esquemaHeader.diasGracia,
            plazo: $scope.esquemaHeader.plazo,
            nombre: $scope.esquemaHeader.nombre,
            descripcion: $scope.esquemaHeader.descripcion,
            interesMoratorio: $scope.esquemaHeader.interesMoratorio
        };

        esquemaFactory.updEsquema(params).then(function(result) {
            swal('Guardado', 'Detalle guardado con exito', 'success');
            $scope.getSchemas($scope.currentFinancialID);
            $scope.backToPrincipal();
        });
    };



    $scope.editDetail = function(itemDetail) {
        $scope.editAddTitle = "Editando detalle esquema: " + $scope.currentFinancialName;
        $scope.showEditBtn = true;
        $scope.currentEsquemaDetail = itemDetail.esquemaDetalleID;
        $scope.esquemaDetalle.tasaInteres = itemDetail.tasaInteres;
        $scope.esquemaDetalle.porcentajePenetracion = itemDetail.porcentajePenetracion;
        $scope.esquemaDetalle.fechaInicio = itemDetail.fechaInicio;
        $scope.esquemaDetalle.fechaFin = itemDetail.fechaFin;
        $scope.esquemaDetalle.tiie = itemDetail.tiie;
        $scope.esquemaDetalle.selectedOption = $scope.lstTiie[itemDetail.tipoTiieCID - 1];
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



    $scope.updSchemaDetails = function() {

        //var overlap = $scope.dateOverlap($scope.esquemaDetalle.fechaInicio, $scope.esquemaDetalle.fechaFin, $scope.lstSchemeDetail);
        var overlap = false;

        if (overlap === true) {
            swal('Aviso', 'El rango de fechas ya esta contenido en otro detalle.', 'warning');
        } else {

            var params = {
                usuarioID: $scope.usuarioID,
                esquemaDetalleID: $scope.currentEsquemaDetail,
                tasaInteres: $scope.esquemaDetalle.tasaInteres,
                fechaInicio: $scope.esquemaDetalle.fechaInicio,
                fechaFin: $scope.esquemaDetalle.fechaFin,
                porcentajePenetracion: $scope.esquemaDetalle.porcentajePenetracion,
                tipoTiieCID: $scope.esquemaDetalle.selectedOption.valor,
                tiie: $scope.esquemaDetalle.tiie,
            };

            esquemaFactory.updSchemeDetail(params).then(function(result) {
                $scope.esquemaDetalle = esquemaFactory.initSchemaDetail();
                var objSchema = { esquemaID: $scope.currentEsquema };
                $scope.showSchemaDetail(objSchema);
                $scope.cancelDetailEdit();
                swal('Actualizado', 'Detalle actualizado con exito', 'success');
            });
        }


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