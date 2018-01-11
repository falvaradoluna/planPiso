appModule.factory('esquemaFactory', function($http) {
    return {

        initSchemaHeader: function() {
            return {
                nombre: null,
                descripcion: null,
                diasGracia: null,
                plazo: null,
                interesMoratorio: null
            };
        },

        initSchemaDetail: function() {
            return {
                tasaInteres: null,
                porcentajePenetracion: null,
                fechaInicio: null,
                fechaFin: null,
                tiie: null,
                selectedOption: null
            };
        },

        getSchemeDetail: function(esquemaID, esquemaDetalleID) {
            return $http({
                url: 'apiEsquema/getEsquemaDetalle',
                method: "GET",
                params: { esquemaID: esquemaID, esquemaDetalleID: esquemaDetalleID },
                headers: { 'Content-Type': 'application/json' }
            });
        },


        putScheme: function(params) {
            return $http({
                url: 'apiEsquema/putEsquema',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },

        updEsquema: function(params) {
            return $http({
                url: 'apiEsquema/updEsquema',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },


        putSchemeDetail: function(params) {
            return $http({
                url: 'apiEsquema/putEsquemaDetalle',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },

        updSchemeDetail: function(params) {
            return $http({
                url: 'apiEsquema/updEsquemaDetalle',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },

        formIsvalid: function(controls) {
            var esValido = false;

            for (i = 0; i < controls.length; i++) {

                if (controls[i].value === null || controls[i].value === '') {
                    swal('Verifique', controls[i].name + ' es requerido', 'warning');
                    esValido = false;
                    break;
                }

                var pattern = new RegExp(controls[i].regExp);

                if (pattern.test(controls[i].value) === false) {
                    swal('Verifique', controls[i].name + ' formato incorrecto', 'warning');
                    esValido = false;
                    break;
                }

                esValido = true;
            }

            return esValido;
        },
        setDetailsValues: function(control, expresion) {

            var formControls = [
                { value: control.tasaInteres, name: 'Tasa interes', regExp: expresion.decimal1 },
                { value: control.porcentajePenetracion, name: 'Porcentaje penetración', regExp: expresion.decimal1 },
                { value: control.fechaInicio, name: 'Fecha inicio', regExp: expresion.todo },
                { value: control.fechaFin, name: 'Fecha fin', regExp: expresion.todo },
                { value: control.tiie, name: 'TIIE', regExp: expresion.decimal1 },
                { value: control.selectedOption === null ? null : control.selectedOption.valor, name: 'Tipo TIIE ', regExp: expresion.entero1 }
            ];
            return formControls;
        },
        setHeaderValues: function(control, expresion) {

            var formControls = [
                { value: control.nombre, name: 'Nombre', regExp: expresion.todo },
                { value: control.descripcion, name: 'Descripción', regExp: expresion.todo },
                { value: control.diasGracia, name: 'Dias Gracia', regExp: expresion.entero1 },
                { value: control.plazo, name: 'Plazo', regExp: expresion.entero1 },
                { value: control.interesMoratorio, name: 'Interes Moratorio', regExp: expresion.decimal1 }
            ];
            return formControls;
        }



    };

});