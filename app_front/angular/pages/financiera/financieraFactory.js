appModule.factory('financieraFactory', function($http) {
    return {

        initSchemaHeader: function() {
            return {
                nombre: null,
                descripcion: null,
                diasGracia: null,
                plazo: null,
                interesMoratorio: null,
                tasaInteres: null,
                porcentajePenetracion: null,
                fechaInicio: null,
                fechaFin: null,
                tiie: null,
                selectedOption: null
            };
        },

        initSchemaDetail: function() {
            return {

            };
        },
        getCatalogosTipo: function(params) {
            return $http({
                url: 'apiFinanciera/getCatalogosTipo',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });
        },
        putScheme: function(params) {
            return $http({
                url: 'apiFinanciera/putFinanciera',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        updFinanciera: function(params) {
            return $http({
                url: 'apiFinanciera/updFinanciera',
                method: "GET",
                params: params,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        deleteScheme: function(params) {
            return $http({
                url: 'apiFinanciera/delFinanciera',
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

        setHeaderValues: function(control, expresion) {

            var formControls = [
                { value: control.tipoCobroInteresID, name: 'Tipo Cobro Interes', regExp: expresion.entero1 },
                { value: control.tipoPagoInteresID, name: 'Tipo Pago Interes', regExp: expresion.entero1 },
                { value: control.tipoPagoMensualID, name: 'Tipo Pago Mensual', regExp: expresion.entero1 },
                { value: control.tipoSOFOMID, name: 'Tipo SOFOM', regExp: expresion.entero1 },

            ];
            return formControls;
        }



    };

});