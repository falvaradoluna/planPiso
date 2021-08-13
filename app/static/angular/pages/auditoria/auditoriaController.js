appModule.controller('auditoriaController', function($scope, $rootScope, $location, auditoriaFactory, commonFactory, staticFactory, $window) {
    $scope.idUsuario = parseInt(localStorage.getItem("idUsuario"))
    $scope.session = JSON.parse(sessionStorage.getItem("sessionFactory"));
    $scope.lstPermisoBoton = JSON.parse(sessionStorage.getItem("PermisoUsuario"));
    $scope.currentEmpresa = $scope.session.nombre;
    $scope.topBarNav = staticFactory.auditoriaBar();
    console.log($scope.session)
    $scope.currentFinancialName = "Seleccionar Financiera";
    $scope.lbl_btn_descheck = "Desmarcar Unidades";
    $scope.currentPanel = 'pnlCargaArchivo';
    $scope.frmConciliacion = { lblMes: 0, idFinanciera: 0, loadLayout: false }

    $scope.titleDocumentos = '';
    $scope.titleDocumentosDetalle = '';
    $scope.tipoauditoria = 0;
    $scope.MuestranuevaAuditoria = false;
    $scope.Muestraeditar = false;
    $scope.MuestraguardarAuditoria = false;
    $scope.MuestracancelarAuditoria = false;
    /* =========================== 
        [ estSolAutorizacion ]
    Valida la aplicación de la conci
    liacion mediante autorización de
    usuarios mediante notificaciones

    0 => No aplica; 
    1 => Puede Solicitar;
    2 => Solicitó y esta en espera;
    3 => Aprobada;
    4 => Rechazada;
    ============================== */
    $scope.estSolAutorizacion = 0;

    $scope.currentMonth = 0;
    $scope.currentYear = 0;

    $scope.flagAjusteCaseTree = true;
    $scope.ajusteManual = false;

    $scope.lstMonth = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    $scope.cierreMes = [];
    $scope.lstConceal = [];
    $scope.lstFinancial = [];
    $scope.lstPendiente = [];
    $scope.lstauditoria = [];
    $scope.autDetalle = [];
    $scope.lstConciliaDetalle = [];

    $scope.currentFinancial = {};
    $scope.currentauditoria = {};
    $scope.ctrl = {};
    $scope.total = { sistema: 0, archivo: 0 };
    $scope.frmauditoria = { lblMes: 0, idFinanciera: 0, loadLayout: false }
    $scope.situacion = { ok: 0, financiera: 0, gpoAndrade: 0 };
    $scope.diferencias = { iguales: 0, diferentes: 0 };



    var increment = 0;
    var contador = 0;
    $scope.init = function() {
        var valor = _.where($scope.lstPermisoBoton, { idModulo: 10, Boton: "nuevaAuditoria" })[0];
        $scope.MuestranuevaAuditoria = valor != undefined;
        valor = _.where($scope.lstPermisoBoton, { idModulo: 10, Boton: "editar" })[0];
        $scope.Muestraeditar = valor != undefined;
        valor = _.where($scope.lstPermisoBoton, { idModulo: 10, Boton: "guardarAuditoria" })[0];
        $scope.MuestraguardarAuditoria = valor != undefined;
        valor = _.where($scope.lstPermisoBoton, { idModulo: 10, Boton: "cancelarAuditoria" })[0];
        $scope.MuestracancelarAuditoria = valor != undefined;
        valor = _.where($scope.lstPermisoBoton, { idModulo: 10, Boton: "unidadEstrella" })[0];
        $scope.MuestraEstrella = valor != undefined;
    }
    $scope.init();
    $scope.openModalAuditoria = function() {
        $("#modalNuevaAuditoria").modal('show');
    }

    // Este es como funciona desde Branch Auditoria
    commonFactory.getFinancial($scope.session.empresaID).then(function(result) {
        $scope.lstFinancial = result.data;
        var tem = {
            financieraID: 1000,
            nombre: 'Todas'
        };
        $scope.lstFinancial.push(tem);
    });
    auditoriaFactory.getTipoUbicacion($scope.session.empresaID).then(function(result) {
        $scope.lsttipoUbicacion = result.data;
      
    });
    auditoriaFactory.getTiposAuditoria().then(function(result) {
        $scope.lstTipoAuditoria = result.data;
    }, function(error) {
        console.log("Error", error);
    });
    $scope.SelFinanciera = function(item) {
        auditoriaFactory.getTiposColateral($scope.frmauditoria.idFinanciera).then(function(result) {
            $scope.lstTipoColateral = result.data;
        }, function(error) {
            console.log("Error", error);
        });

    }
    $scope.nexStep = function() {
        if ($scope.frmauditoria.idFinanciera == 0) {
            swal("Auditoria", "No se ha especificado la financiera.");
        } else if ($scope.frmauditoria.idtipoColateral == 0) {
            swal("Auditoria", "No se ha especificado el Colateral.");
        } else {
            $scope.insertAuditoria();
        }
        $("#modalNuevaAuditoria").modal('hide');

    };
    $scope.insertAuditoria = function() {
        try {
            var parametros = {
                idEmpresa: $scope.session.empresaID,
                idFinanciera: $scope.frmauditoria.idFinanciera,
                idtipoAuditoria: $scope.frmauditoria.idtipoauditoria,
                idtipoColateral: $scope.frmauditoria.idtipoColateral
            }
            auditoriaFactory.insertaAuditoria(parametros).then(function(result) {
                var id = result.data[0].id;
                if (id != undefined) {
                    $scope.getauditoria(id);

                }

            })

        } catch (e) {
            console.log("Error", e);
            swal("Auditoria", "El archivo que porporciona no contiene el formato que se espera, asegurese de cargar el layout esperado.");
        }
    }
    $scope.getauditoria = function(id) {

        auditoriaFactory.getAuditoria(id).then(function(result) {
            $scope.setResetTable('tblNormales', 'Auditoria', 20);
            $scope.ctrl.lblNum = result.data[0][0].idAuditoria;
            $scope.ctrl.lblFecha = result.data[0][0].fecha;
        
            $scope.ctrl.lblFinanciera = result.data[0][0].financiera;
            $scope.ctrl.idestatus = result.data[0][0].idestatus;
            $scope.ctrl.idtipoAuditoria = result.data[0][0].idtipoAuditoria;
            var lista = result.data[1];
            for (var i = 0; i < lista.length; i++) {
                if (lista[i].idtipoubicacionreal !== undefined) {
                    lista[i].seltipoubicacionreal =_.where($scope.lsttipoUbicacion, { idubicacionreal:lista[i].idtipoubicacionreal })[0];
                }
                if (lista[i].encontrada) {
                    lista[i].unidadencontrada ='SI';
                }
                else
                {
                    lista[i].unidadencontrada ='NO';
                }
                if( lista[i].veh_fechasalida  =='1900-01-01T00:00:00.000Z')
                {
                    lista[i].veh_fechasalida= '';
                }
              
            }
            $scope.lstAuditoria = lista
            $scope.currentPanel = 'pnlAuditoriaUnidades';
            $scope.lstAuditoriaTotal = 0;

            for (var i = 0; i < $scope.lstAuditoria.length; i++) {
                $scope.lstAuditoriaTotal += $scope.lstAuditoria[i].saldo;
            }
            $scope.Cuenta();
        }, function(error) {
            console.log("Error", error);
        });
    };
    $scope.getauditorias = function() {
        var parametros = {
            idEmpresa: $scope.session.empresaID
        }
        auditoriaFactory.getAuditorias(parametros).then(function(result) {
            if (result.data[0].length > 0)
                $scope.lstAuditorias = result.data[0];
        }, function(error) {
            console.log("Error", error);
        });
    };
    $scope.Encontrada = function(dato) {
        var parametros = {
            idAuditoriaDetalle: dato.idAuditoriaDetalle,
            encontrada: dato.encontrada ? 1 : 0
        }
        auditoriaFactory.cambiarEncontrada(parametros).then(function(result) {
            var solo = result;
            for (var i = 0; i <  $scope.lstAuditoria.length; i++) {
               
                if ( $scope.lstAuditoria[i].encontrada) {
                    $scope.lstAuditoria[i].unidadencontrada ='SI';
                }
                else
                {
                    $scope.lstAuditoria[i].unidadencontrada ='NO';
                }
              
            }
        }, function(error) {
            console.log("Error", error);
        });
        $scope.Cuenta();
    };
    $scope.Cuenta = function() {
        $scope.ctrl.numveh =0;
        $scope.ctrl.numvehenc = 0;
        $scope.ctrl.numvehnoenc = 0;
        $scope.ctrl.numvehaud = 0;
        $scope.ctrl.numvehestre = 0;
        $scope.ctrl.numvehedoblestre = 0;
        for (var i = 0; i < $scope.lstAuditoria.length; i++) {
            if ($scope.lstAuditoria[i].encontrada == 1) {
                $scope.ctrl.numvehenc++;
            }
            if ($scope.lstAuditoria[i].porauditar == 'SI') {
                $scope.ctrl.numvehaud++;
            }
            if ($scope.lstAuditoria[i].estrella == '*') {
                $scope.ctrl.numvehestre++;
            }
            if ($scope.lstAuditoria[i].dobleEstrella == '**') {
                $scope.ctrl.numvehedoblestre++;
            }
            $scope.ctrl.numveh++;
        }
        $scope.ctrl.numvehnoenc = $scope.ctrl.numveh - $scope.ctrl.numvehenc;
    }


    $scope.muestraAuditoriaPendiente = function(idauditoria) {
        $scope.idauditoria = idauditoria.idAuditoria;
        // $scope.estatusauditoria=idauditoria.estatus;
        // $scope.frmauditoria.lbltipoauditoria=idauditoria.idTipo;


        $scope.getauditoria($scope.idauditoria);
    }


    $scope.setCurrentFinancial = function(financialObj) {
        $scope.currentFinancial = financialObj;
        $scope.currentFinancialName = financialObj.nombre;
    };



    $scope.prevStep = function() {
        location.reload();
        $scope.currentPanel = 'pnlCargaArchivo';
    };

    $scope.setTableStyle = function(tblID) {
        staticFactory.setTableStyleFooter(tblID, 5);
    };
    $scope.setResetTable = function(tblID, display, length) {
        staticFactory.setTableStyleClass('.' + tblID, display, length)
    };
    $scope.editDetail = function(valor) {
        var item = valor;
        $rootScope.documento = valor.documento;
        $rootScope.vin = valor.vin;
        $rootScope.observaciones = valor.observaciones;
        $rootScope.idAuditoriaDetalle = valor.idAuditoriaDetalle;
        $rootScope.idAuditoria = valor.idAuditoria;
        $rootScope.tipo = valor.idtipoDetalleAuditoria;
        $('#selectObservaciones').modal('show');
    };
    $scope.editDetailGeneral = function() {

        $rootScope.observaciones = '';
        $('#selectObservacionesGeneral').modal('show');
    };
    $scope.Buscarunidad = function() {

        $rootScope.observaciones = '';
        $('#selectBuscarUnidad').modal('show');
    };
    $scope.GuardarDetail = function(observaciones, idAuditoriaDetalle) {
        $rootScope.observaciones = observaciones;
        $rootScope.idAuditoriaDetalle = idAuditoriaDetalle;
        var data = {
            idAuditoriadetalle: $rootScope.idAuditoriaDetalle,
            observaciones: $rootScope.observaciones,
        };
        auditoriaFactory.guardarObservaciones(data).then(function(resultSchema) {
            
                for (var i = 0; i < $scope.lstAuditoria.length; i++) {
                    if ($scope.lstAuditoria[i].idAuditoriaDetalle == $rootScope.idAuditoriaDetalle) {
                        $scope.lstAuditoria[i].observaciones = $rootScope.observaciones;

                    }
            $scope.apply;
            $('#selectObservaciones').modal('hide');
            swal("Ok", "Se guardo con exito", "success");
                }
        });
    }
    $scope.GuardarDetailGeneral = function(observaciones) {
        $rootScope.observaciones = observaciones;
        $scope.iddetalle = '';
        for (var i = 0; i < $scope.lstAuditoria.length; i++) {
            if ($scope.lstAuditoria[i].isChecked) {
                $scope.iddetalle = $scope.iddetalle + $scope.lstAuditoria[i].idAuditoriaDetalle + ','

            }
        }
      

        var ids = $scope.iddetalle.substring(0, $scope.iddetalle.length - 1);
        var data = {
            idAuditoriadetalle: ids,
            observaciones: $rootScope.observaciones,
        };
        auditoriaFactory.guardarObservacionesGeneral(data).then(function(resultSchema) {

            for (var i = 0; i < $scope.lstAuditoria.length; i++) {
                if ($scope.lstAuditoria[i].isChecked) {
                    $scope.lstAuditoria[i].observaciones = $rootScope.observaciones;

                }
            }
            $scope.apply;
            $('#selectObservacionesGeneral').modal('hide');
            swal("Ok", "Se guardo con exito", "success");

        });
    }
    $scope.guardaAuditoria = function() {
        $('#modalCargarArchivo').modal('show');
        //     $('#selectGuardarPDF').modal('show');
        $scope.Dropzone();


    }

    var myDropzone;
    $scope.Dropzone = function() {
        $("#templateDropzone").html('')

        var html = `<form action="/file-upload" class="dropzone" id="idDropzone">
                        <div class="fallback">
                            <input name="file" type="file" accept=".zip" />
                        </div>
                    </form>`;

        $("#templateDropzone").html(html);
        myDropzone = new Dropzone("#idDropzone", {
            url: "api/apiAuditoria/uploadpdf",
            uploadMultiple: 0,
            maxFiles: 1,
            autoProcessQueue: false,
            acceptedFiles: "application/x-zip-compressed",
            webkitRelativePath: "/uploads"
        });

        myDropzone.on("success", function(req, xhr) {
            var _this = this;

            var filename = xhr + '.zip';
            $scope.loadingPanel = true;
            $('#mdlLoading').modal('show');
            $scope.TerminarGuardar(filename);

            $scope.limpiarDropzone = function() {
                _this.removeAllFiles();
                myDropzone.enable()
                $scope.frmauditoria.loadLayout = true;
            }
        });

        myDropzone.on("addedfile", function() {
            $scope.frmauditoria.loadLayout = true;
        });
    };

    $scope.readLayoutauditoria = function(filename, idAuditoria) {
        myDropzone.processQueue();

    };
    $scope.TerminarGuardar = function(filename) {
        auditoriaFactory.savePdf(filename, $scope.idauditoria).then(function(result) {
            var res = result;
            $('#mdlLoading').modal('hide');
            $('#modalCargarArchivo').modal('hide');
            $scope.loadingPanel = false;
            swal("Ok", "Se guardo con exito el archivo", "success");
            setTimeout(function() {
                location.reload();
            }, 3000);
        }, function(error) {
            console.log("Error", error);
        });
    }
    var config = { responseType: 'blob' };
    $scope.VerArchivoPdf = function(item) {

        $rootScope.archivozip = item;
        //var arregloBytes = [];
        $rootScope.pdf = undefined;
       // item.ruta='../../uploads/1627662117079.zip'
        //uploads/1627662117079.zip
        auditoriaFactory.getreadPdf(item.ruta).then(function(result) {
       
           var nombrearrelo=  $rootScope.archivozip.ruta.split('/');
           var filename=nombrearrelo[nombrearrelo.length-1];
            var blob = b64toBlob(result.data, 'application/zip');
            const url = window.URL.createObjectURL(blob,{ type: "application/zip" });
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download',filename); 
      document.body.appendChild(link);
      link.click();
 
           
            $("#mdlLoading").modal('hide');
            $('#loading').modal('hide');
            console.log($scope.pdf, 'Soy el arreglo ')
        }, function(error) {
            console.log("Error", error);
        });



    }
    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512; // sliceSize represent the bytes to be process in each batch(loop), 512 bytes seems to be the ideal slice size for the performance wise 

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }
    // -----------------------------------------
    // --Reporte Excel desde jsreport
    // -----------------------------------------
    $scope.generaReporte = function() {
        $("#mdlLoading").modal('show');
        // console.log($scope.lstAuditoriaNormales, $scope.lstAuditoriaDPP, $scope.lstAuditoriaFS);
        // console.log($scope.lstAuditoriaNormalesTotal, $scope.lstAuditoriaDPPTotal, $scope.lstAuditoriaFSTotal)
        var estrellaReporte;
        angular.forEach($scope.lstAuditoria, function(value, key) {
            value.encontrada = value.encontrada == true ? 'Si' : 'No';
            value.idCliente = value.idCliente == null ? '' : value.idCliente;
            if ($scope.MuestraEstrella) {
                value.muestraEstrella = true;
            } else {
                value.muestraEstrella = false;
            }
            if( value.veh_fechasalida  !='')
                {
                   
                        value.veh_fechasalida= formatDate(value.veh_fechasalida);
                        if( value.veh_fechasalida  =='31/12/1969')
                        {
                            value.veh_fechasalida ='';
                        }else   if( value.veh_fechasalida  =='aN/aN/NaN')
                        {
                            value.veh_fechasalida ='';
                        }
                }
        });
        if ($scope.MuestraEstrella) {
            estrellaReporte = true;
        } else {
            estrellaReporte = false;
        }
        $scope.contenidoReporte = {
            "detalle": [{
                "titulo": "Unidades Plan Piso",
                "muestraEstrella": estrellaReporte,
                "detalle": $scope.lstAuditoria,
                "total": $scope.lstAuditoriaTotal
            }]

        };
        // angular.forEach($scope.lstAuditoriaNormales, function(value, key) {
        //     value.encontrada = value.encontrada == true ? 'Si' : 'No';
        // });
        // angular.forEach($scope.lstAuditoriaDPP, function(value, key) {
        //     value.encontrada = value.encontrada == true ? 'Si' : 'No';
        // });
        // angular.forEach($scope.lstAuditoriaFS, function(value, key) {
        //     value.encontrada = value.encontrada == true ? 'Si' : 'No';
        // });
        // $scope.contenidoReporte = {
        //     "detalle": [{
        //         "titulo": "Unidades Plan Piso Normales",
        //         "detalle": $scope.lstAuditoriaNormales,
        //         "total": $scope.lstAuditoriaNormalesTotal
        //     }, {
        //         "titulo": "Unidades Plan Piso DPP",
        //         "detalle": $scope.lstAuditoriaDPP,
        //         "total": $scope.lstAuditoriaDPPTotal
        //     }, {
        //         "titulo": "Unidades Plan Piso Fecha de Salida con saldo",
        //         "detalle": $scope.lstAuditoriaFS,
        //         "total": $scope.lstAuditoriaFSTotal
        //     }]

        // };
        console.log('CONTEDIDO REPORTE', JSON.stringify($scope.contenidoReporte));
//////////////////////////////////////////////////////////
        auditoriaFactory.reporteAuditoria($scope.contenidoReporte).then(function success(res) {
            var file = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            var a = document.createElement("a");
            a.href = URL.createObjectURL(file);
            a.download = 'Reporte Auditoria - ' + $scope.session.nombre.replace('.','');
            a.click();
            $("#mdlLoading").modal('hide');
        }, function error(err) {
            error(err);
        });

    };
    function formatDate(data){        
        var d = new Date(data),
            dformat = [ padLeft(d.getDate())+'/'+ padLeft(d.getMonth()+1)+'/'+d.getFullYear()
                        ].join(' ');
         return dformat
      }
      function padLeft(n){
        return ("00" + n).slice(-2);
      }
    // -----------------------------------------
    // --Reporte Excel desde jsreport
    // -----------------------------------------
    $scope.generaReportePdf = function() {
        $("#mdlLoading").modal('show');
        // console.log($scope.lstAuditoriaNormales, $scope.lstAuditoriaDPP, $scope.lstAuditoriaFS);
        // console.log($scope.lstAuditoriaNormalesTotal, $scope.lstAuditoriaDPPTotal, $scope.lstAuditoriaFSTotal)
        var estrellaReporte;
        angular.forEach($scope.lstAuditoria, function(value, key) {
            value.encontrada = value.encontrada == true ? 'Si' : 'No';
            value.idCliente = value.idCliente == null ? '' : value.idCliente;
            if ($scope.MuestraEstrella) {
                value.muestraEstrella = true;
            } else {
                value.muestraEstrella = false;
            }
        });
        if ($scope.MuestraEstrella) {
            estrellaReporte = true;
        } else {
            estrellaReporte = false;
        }
        $scope.contenidoReporte = {
            "detalle": [{
                "titulo": "Unidades Plan Piso",
                "muestraEstrella": estrellaReporte,
                "detalle": $scope.lstAuditoria,
                "total": $scope.lstAuditoriaTotal
            }]

        };
        // angular.forEach($scope.lstAuditoriaNormales, function(value, key) {
        //     value.encontrada = value.encontrada == true ? 'Si' : 'No';
        // });
        // angular.forEach($scope.lstAuditoriaDPP, function(value, key) {
        //     value.encontrada = value.encontrada == true ? 'Si' : 'No';
        // });
        // angular.forEach($scope.lstAuditoriaFS, function(value, key) {
        //     value.encontrada = value.encontrada == true ? 'Si' : 'No';
        // });
        // $scope.contenidoReporte = {
        //     "detalle": [{
        //         "titulo": "Unidades Plan Piso Normales",
        //         "detalle": $scope.lstAuditoriaNormales,
        //         "total": $scope.lstAuditoriaNormalesTotal
        //     }, {
        //         "titulo": "Unidades Plan Piso DPP",
        //         "detalle": $scope.lstAuditoriaDPP,
        //         "total": $scope.lstAuditoriaDPPTotal
        //     }, {
        //         "titulo": "Unidades Plan Piso Fecha de Salida con saldo",
        //         "detalle": $scope.lstAuditoriaFS,
        //         "total": $scope.lstAuditoriaFSTotal
        //     }]

        // };
        console.log('CONTEDIDO REPORTE', JSON.stringify($scope.contenidoReporte));

        auditoriaFactory.reporteAuditoriaPdf($scope.contenidoReporte).then(function success(res) {
            // var file = new Blob([result.data], { type: 'application/pdf' });
            // var fileURL = URL.createObjectURL(file);
            var fileName = "file_name.pdf";
            var a = document.createElement("a");
            var file = new Blob([res.data], { type: 'application/pdf' });
            var fileURL = window.URL.createObjectURL(file);
            a.href = fileURL;
            a.download = fileName;
            a.click();
            $("#mdlLoading").modal('hide');
        }, function error(err) {
            error(err);
        });

    };

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    var myDropzone2;
    $scope.Dropzone2 = function() {
        $("#templeteDropzone2").html('')

        var html = `<form action="/file-upload" class="dropzone" id="idDropzone">
                        <div class="fallback">
                            <input name="file" type="file" accept="text/csv, .csv" />
                        </div>
                    </form>`;

        $("#templeteDropzone2").html(html);
        myDropzone2 = new Dropzone("#idDropzone", {
            url: "api/apiAuditoria/upload",
            uploadMultiple: 0,
            maxFiles: 1,
            autoProcessQueue: false,
            acceptedFiles: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            webkitRelativePath: "/uploads"
        });

        myDropzone2.on("success", function(req, xhr) {
            var _this = this;

            var filename = xhr + '.xlsx';
            $scope.loadingPanel = true;
            $('#mdlLoading').modal('show');
            $scope.readLayout(filename);

            $scope.limpiarDropzone = function() {
                _this.removeAllFiles();
                myDropzone2.enable()
                $scope.frmConciliacion.loadLayout = true;
            }
        });

        myDropzone2.on("addedfile", function() {
            $scope.frmConciliacion.loadLayout = true;
        });
    };
    var execelFields = [];

    $scope.readLayout = function(filename) {
        auditoriaFactory.readLayout(filename).then(function(result) {
            var LayoutFile = result.data;
            var aux = [];
            for (var i = 1; i < LayoutFile.length; i++) {
                aux.push(LayoutFile[i]);
            }

            execelFields = $scope.arrayToObject(aux);
            $scope.insertData();
        }, function(error) {
            console.log("Error", error);
        });
    };

    $scope.insertData = function() {
        try {
            execelFields[increment]['consecutivo'] = contador;
            auditoriaFactory.insExcelData(execelFields[increment]).then(function(result) {
                    if (!result.data) {
                        swal("Auditoria", "El archivo que porporciona no contiene el formato que se espera, asegurese de cargar el layout esperado.");
                        $('#mdlLoading').modal('hide');
                        $scope.loadingPanel = false;
                    } else {
                        if (result.data[0].success == 1) {
                            contador = parseInt(result.data[0].consecutivo);

                            if (increment >= (execelFields.length - 1)) {
                                // $scope.nexStep();
                                $scope.frmConciliacion.loadLayout = true;
                                $scope.loadingPanel = false;
                                $('#mdlLoading').modal('hide');
                                // if($scope.frmConciliacion.lbltipoconciliacion== 1)
                                //     $scope.currentPanel = 'pnlConciliar';
                                // else
                                //     $scope.currentPanel = 'pnlConciliarUnidades';
                                $scope.conceal();
                                $("#modalNuevaConciliacion").modal('hide');
                            } else {
                                increment++;
                                $scope.insertData();
                            }
                        }
                    }
                })
                .catch(function(e) {
                    console.log("got an error in initial processing", e);
                    throw e;
                }).then(function(res) {});
        } catch (e) {
            console.log("Error", e);
            swal("Auditoria", "El archivo que porporciona no contiene el formato que se espera, asegurese de cargar el layout esperado.");
        }
    }
    $scope.conceal = function() {

        auditoriaFactory.getConciliacionAuditoria($scope.idauditoria).then(function(result) {
            swal("Auditoria", "Archivo cargado correctamente.");
            setTimeout(function() {
                location.reload();
            }, 5000);

        });
    };
    $scope.arrayToObject = function(array) {
        var lst = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i].__EMPTY_23 != undefined) {
                var obj = {
                    dato1: $scope.idauditoria,
                    dato2: array[i].__EMPTY_11,
                    dato3: array[i].__EMPTY_17,
                    dato4: array[i].__EMPTY_23,
                    dato5: array[i].__EMPTY_26,
                    dato6: array[i].__EMPTY_27,
                    dato7: array[i].__EMPTY_31,
                    dato8: array[i].__EMPTY_34,
                    dato9: array[i].__EMPTY_48
                };
                lst.push(obj);
            }
        }
        return lst;
    };
    $scope.CargarAuditoria = function() {

        $('#modalNuevaConciliacion').modal('show');
        $scope.Dropzone2();
    }
    $scope.nextStep2 = function() {
        myDropzone2.processQueue();
        $scope.frmConciliacion.loadLayout = true;

    };

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    $scope.BuscarDetailGeneral = function(dato) {
        var parametros = {
            vin: dato,
            idEmpresa: $scope.session.empresaID
        }
        auditoriaFactory.buscaVIN(parametros).then(function(result) {
            $scope.lstBuscar = result.data[0];
        }, function(error) {
            console.log("Error", error);
        });
    };
    var myDropzone3;
    $scope.Dropzone3 = function() {
        $("#templeteDropzone3").html( '' )

        var html = `<form action="/file-upload" class="dropzone" id="idDropzone">
                        <div class="fallback">
                            <input name="file" type="file" accept="text/csv, .csv" />
                        </div>
                    </form>`;

        $("#templeteDropzone3").html( html );
        myDropzone3 = new Dropzone("#idDropzone", {
            url: "api/apiAuditoria/upload",
            uploadMultiple: 0,
            maxFiles: 1,
            autoProcessQueue: false,
            acceptedFiles: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            webkitRelativePath:"/uploads"
        });

        myDropzone3.on("success", function(req, xhr) {
            var _this = this;

            var filename = xhr + '.xlsx';
            $scope.loadingPanel = true;
            $('#mdlLoading').modal('show');
            $scope.readLayout2(filename);
            $scope.cargandoPro=0;
            increment=0;
            $scope.limpiarDropzone2 = function(){
                _this.removeAllFiles();
                myDropzone3.enable()
                $scope.frmConciliacion.loadLayout = true;
            }
        });

        myDropzone3.on("addedfile", function() {
            $scope.frmConciliacion.loadLayout = true;
        });
    };
    var execelFields2 = [];
    $scope.readLayout2 = function(filename) {
        auditoriaFactory.readLayout(filename).then(function(result) {
            var LayoutFile = result.data;
            var aux = [];
            for (var i = 0; i < LayoutFile.length; i++) {
                aux.push(LayoutFile[i]);
            }

            execelFields2 = $scope.arrayToObject2(aux);
            $scope.maxPro = execelFields2.length;
            $scope.insertData2();
        }, function(error) {
            console.log("Error", error);
        });
    };

    $scope.insertData2 = function() {
        try{
            execelFields2[increment]['consecutivo'] = contador;
            auditoriaFactory.insExcelData2(execelFields2[increment]).then(function(result) {
                if( !result.data ){
                    swal("Pendiente de esquema","El archivo que porporciona no contiene el formato que se espera, asegurese de cargar el layout esperado.");
                    $('#mdlLoading').modal('hide');
                    $scope.loadingPanel = false;
                }
                else{
                    if( result.data[0].success == 1 ){
                        contador    = parseInt(result.data[0].consecutivo);

                        if (increment >= (execelFields2.length - 1)) {
                            // $scope.nexStep();
                           
                            $scope.loadingPanel = false;
                            $('#mdlLoading').modal('hide');
                            $scope.conceal2();
                            $("#modalNuevaLayoutExcel").modal('hide');
                           
                        }
                        else{
                            increment++;
                            $scope.cargandoPro++;
                            $scope.insertData2();
                        }
                    }                    
                }
            })
            .catch(function(e){
               console.log("got an error in initial processing",e);
               throw e;
            }).then(function(res){
            });            
        }
        catch( e ){
            console.log( "Error", e );
            swal("Conciliación","El archivo que porporciona no contiene el formato que se espera, asegurese de cargar el layout esperado.");
        }
    }
$scope.CargarAuditoriaExcel= function(){

    $('#modalNuevaLayoutExcel').modal('show');
    $scope.Dropzone3();
}

 $scope.nexStep3 = function() {
    if( !$scope.frmConciliacion.loadLayout ){
        swal("Unidades","No se ha cargado el Layout.");
    }
    else{
       
        myDropzone3.processQueue();
      
    }
};
$scope.arrayToObject2 = function(array) {
    var lst = [];
    for (var i = 1; i < array.length; i++) {

        if( array[i].__EMPTY_21.length>=0)
        {
        if(array[i].__EMPTY_8!= undefined && array[i].__EMPTY_8.length==0)
        {array[i].__EMPTY_8=undefined;}

        var obj = { dato1:$scope.idauditoria,dato2: array[i].__EMPTY, dato3: array[i].__EMPTY_21, dato4: array[i].__EMPTY_22 , dato5: array[i].__EMPTY_23, dato6: array[i].__EMPTY_8};
        lst.push(obj);
        }
    }
    return lst;
};

$scope.conceal2 = function() {
      
    auditoriaFactory.getConciliacionAuditoria($scope.idauditoria).then(function(result) {
        swal("Auditoria", "Archivo cargado correctamente.");
        setTimeout(function() {
            location.reload();
        }, 5000);

    });
};
$scope.SelUbicacion= function(item)
{
    var selitem=item.seltipoubicacionreal;

    var parametros = {
        idAuditoriaDetalle: item.idAuditoriaDetalle,
        idtipoubicacionreal: selitem.idubicacionreal
    }
    auditoriaFactory.cambiarUbicacion(parametros).then(function(result) {
        var solo = result;
    }, function(error) {
        console.log("Error", error);
    });

}
$scope.GuardarOtraUbicacion = function(otraUbicacion, idAuditoriaDetalle) {
    $rootScope.otraUbicacion = otraUbicacion;
    $rootScope.idAuditoriaDetalle = idAuditoriaDetalle;
    var data = {
        idAuditoriadetalle: $rootScope.idAuditoriaDetalle,
        observaciones: $rootScope.otraUbicacion,
    };
    auditoriaFactory.cambiarOtraUbicacion(data).then(function(resultSchema) {
        
            for (var i = 0; i < $scope.lstAuditoria.length; i++) {
                if ($scope.lstAuditoria[i].idAuditoriaDetalle == $rootScope.idAuditoriaDetalle) {
                    $scope.lstAuditoria[i].otraUbicacion = $rootScope.otraUbicacion;

                }
        $scope.apply;
        $('#selectObservaciones').modal('hide');
        swal("Ok", "Se guardo con exito", "success");
            }
    });
}
$scope.GuardarcambiarOtraUbicacionGenerales = function(observaciones) {
    $rootScope.otraUbicacion = observaciones;
    $scope.iddetalle = '';
    for (var i = 0; i < $scope.lstAuditoria.length; i++) {
        if ($scope.lstAuditoria[i].isChecked) {
            $scope.iddetalle = $scope.iddetalle + $scope.lstAuditoria[i].idAuditoriaDetalle + ','

        }
    }
  

    var ids = $scope.iddetalle.substring(0, $scope.iddetalle.length - 1);
    var data = {
        idAuditoriadetalle: ids,
        observaciones: $rootScope.otraUbicacion,
    };
    auditoriaFactory.cambiarOtraUbicacionGenerales(data).then(function(resultSchema) {

        for (var i = 0; i < $scope.lstAuditoria.length; i++) {
            if ($scope.lstAuditoria[i].isChecked) {
                $scope.lstAuditoria[i].otraUbicacion = $rootScope.otraUbicacion;

            }
        }
        $scope.apply;
        $('#selectObservacionesGeneral').modal('hide');
        swal("Ok", "Se guardo con exito", "success");

    });
}
$scope.mostrarcatalgoUbicaciones = function() {

    $('#mostrarcatalgoUbicaciones').modal('show');
    $scope.Dropzone2();
}
$scope.BorrarAuditoria= function(item)
{
    swal({
        title: "Borrar auditoría",
        text: "¿Desea borrar la auditoría?",
        showCancelButton: true,
        closeOnConfirm: true,
        showLoaderOnConfirm: true
    }, function () {
        
        var parametros = {
            idAuditoria: item.idAuditoria
            
        }
        auditoriaFactory.BorrarAuditoria(parametros).then(function(result) {
            var solo = result;
            swal("Ok", "Se borro con exito", "success");
            $scope.getauditorias();
        }, function(error) {
            console.log("Error", error);
        });
    });

  

}
});