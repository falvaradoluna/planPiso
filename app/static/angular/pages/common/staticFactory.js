appModule.factory('staticFactory', function($http) {
    return {

        esquemaBar: function() {
            return [
                { name: 'Home', url: 'home', isActive: false },
                { name: 'Esquemas', url: '#', isActive: true }
            ];
        },
        financieraBar: function() {
            return [
                { name: 'Home', url: 'home', isActive: false },
                { name: 'Financieras', url: '#', isActive: true }
            ];
        },
        tiieBar: function() {
            return [
                { name: 'Home', url: 'home', isActive: false },
                { name: 'TIIE', url: '#', isActive: true }
            ];
        },
        tiieBar: function() {
            return [
                { name: 'Home', url: 'home', isActive: false },
                { name: 'Reducción', url: '#', isActive: true }
            ];
        },
        interesBar: function() {
            return [
                { name: 'Home', url: 'home', isActive: false },
                { name: 'Interes', url: '#', isActive: true }
            ];
        },
        pagoBar: function() {
            return [
                { name: 'Home', url: 'home', isActive: false },
                { name: 'Pago', url: '#', isActive: true }
            ];
        },
        provisionBar: function() {
            return [
                { name: 'Home', url: 'home', isActive: false },
                { name: 'Provisión', url: '#', isActive: true }
            ];
        },
        compensacionBar: function() {
            return [
                { name: 'Home', url: 'home', isActive: false },
                { name: 'Compensación', url: '#', isActive: true }
            ];
        },
        conciliacionBar: function() {
            return [
                { name: 'Home', url: 'home', isActive: false },
                { name: 'Conciliación', url: '#', isActive: true }
            ];
        },
        message: function() {
            alert("Hello");
        },
        toISODate: function(value) {
            var isoDate = value.substring(6, 10) + '-' +
                value.substring(3, 5) + '-' +
                value.substring(0, 2);
            return isoDate;
        },
        todayDate: function() {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!

            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            var today = dd + '/' + mm + '/' + yyyy;

            return today;
        },
        setCalendarStyle: function() {
            $('.date').datepicker({
                todayBtn: "linked",
                keyboardNavigation: true,
                forceParse: false,
                calendarWeeks: true,
                autoclose: true,
                todayHighlight: true,
                format: "dd/mm/yyyy"
            });
        },
        getRegExp: function() {
            return {
                todo: '.',
                entero: '^\\d+$',
                entero1: '^\\d{1,3}$',
                decimal: '^-?[0-9]+([,\\.][0-9]*)?$',
                decimal1: '^\\d{1,2}(\\.\\d{1,4})?$'

            };
        },
        dateExist: function(newIniDate, newEndDate, oldIniDate, oldEndDate) {

            var splitDateA = newIniDate.split('/');
            var splitDateB = newEndDate.split('/');
            var splitDateC = [];
            var splitDateD = [];


            var day = 0;
            var month = 1;
            var year = 2;


            var dateA = new Date(splitDateA[year], splitDateA[month] - 1, splitDateA[day]);
            var dateB = new Date(splitDateB[year], splitDateB[month] - 1, splitDateB[day]);
            var dateC = null;
            var dateD = null;

            if (oldIniDate.indexOf('/') > -1) {

                splitDateC = oldIniDate.split('/');
                splitDateD = oldEndDate.split('/');
                dateC = new Date(splitDateC[year], splitDateC[month] - 1, splitDateC[day]);
                dateD = new Date(splitDateD[year], splitDateD[month] - 1, splitDateD[day]);


            } else {
                var subC = oldIniDate.substring(0, 10);
                var subD = oldEndDate.substring(0, 10);

                splitDateC = subC.split('-');
                splitDateD = subD.split('-');
                dateC = new Date(splitDateC[0], splitDateC[1] - 1, splitDateC[2]);
                dateD = new Date(splitDateD[0], splitDateD[1] - 1, splitDateD[2]);
            }


            if (!(dateB <= dateC || dateA >= dateD))
                return true; // fecha traslapada
            else
                return false; //feha Ok        

        },
        setTableStyleOne: function(tblID) {
            console.log('Hola setTableStyleOne');
            $(tblID).DataTable().destroy()
            setTimeout(function() {
                $(tblID).DataTable({
                    dom: '<"html5buttons"B>lTfgitp',
                    //iDisplayLength: 5,
                    searching: true,
                    order: [
                        [0, "desc"]
                    ],
                    buttons: [{
                        extend: 'copy'
                    }, {
                        extend: 'csv'
                    }, {
                        extend: 'excel',
                        title: 'unidadesNuevas'
                    }, {
                        extend: 'pdf',
                        title: 'unidadesNuevas'
                    }, {
                        extend: 'print',
                        customize: function(win) {
                            $(win.document.body).addClass('white-bg');
                            $(win.document.body).css('font-size', '10px');
                            $(win.document.body).find('table')
                                .addClass('compact')
                                .css('font-size', 'inherit');
                        }
                    }]
                });
            }, 1)
        },
        filtrosTabla: function(dataTable, title, displayLength) {
            $('.' + dataTable).DataTable().destroy()
            $('.' + dataTable + ' thead th').each(function() {
                var titulo = $(this).text()
                $(this).html(titulo + '<br><input type="text" class="filtro-tabla"/>')
            })
            setTimeout(function() {
                var table = $('.' + dataTable).DataTable({
                    dom: '<"html5buttons"B>lTfgitp',
                    'iDisplayLength': displayLength,
                    buttons: [{
                        extend: 'excel',
                        exportOptions: {
                            columns: ':visible'
                        },
                        title: title
                    }, {
                        extend: 'print',
                        exportOptions: {
                            columns: ':visible'
                        },
                        customize: function(win) {
                            $(win.document.body).addClass('white-bg')
                            $(win.document.body).css('font-size', '10px')

                            $(win.document.body).find('table')
                                .addClass('compact')
                                .css('font-size', 'inherit')
                        }
                    }]
                })
                table.columns().every(function() {
                    var that = this

                    $('input', this.header()).on('keyup change', function() {
                        if (that.search() !== this.value) {
                            that
                                .search(this.value)
                                .draw()
                        }
                    })
                })
            }, 100)
        },
        setTableStyleTwo: function(tblID) {
            console.log('Hola setTableStyleOne');
            $(tblID).DataTable().destroy()
            setTimeout(function() {
                $(tblID).DataTable({
                    dom: '<"html5buttons"B>lTfgitp',
                    //iDisplayLength: 5,
                    order: [
                        [0, "desc"]
                    ],
                    buttons: [{
                        extend: 'copy'
                    }, {
                        extend: 'csv'
                    }, {
                        extend: 'excel',
                        title: 'unidadesNuevas'
                    }, {
                        extend: 'pdf',
                        title: 'unidadesNuevas'
                    }, {
                        extend: 'print',
                        customize: function(win) {
                            $(win.document.body).addClass('white-bg');
                            $(win.document.body).css('font-size', '10px');
                            $(win.document.body).find('table')
                                .addClass('compact')
                                .css('font-size', 'inherit');
                        }
                    }]
                });
            }, 100)
        }

    };

});