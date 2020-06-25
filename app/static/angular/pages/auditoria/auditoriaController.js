appModule.controller('auditoriaController', function($scope, $rootScope, $location, auditoriaFactory,  commonFactory, staticFactory, utils ) {
    $scope.idUsuario            = parseInt( localStorage.getItem( "idUsuario" ) )
    $scope.session  = JSON.parse( sessionStorage.getItem( "sessionFactory" ) );

    $scope.currentFinancialName = "Seleccionar Financiera";
    $scope.lbl_btn_descheck     = "Desmarcar Unidades";
    $scope.currentPanel         = 'pnlCargaArchivo';

    $scope.titleDocumentos        = '';
    $scope.titleDocumentosDetalle = '';
    $scope.tipoauditoria=0;
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
    $scope.estSolAutorizacion   = 0;

    $scope.currentMonth         = 0;
    $scope.currentYear          = 0;
    
    $scope.flagAjusteCaseTree   = true;
    $scope.ajusteManual         = false;
    
    $scope.lstMonth             = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    $scope.cierreMes            = [];
    $scope.lstConceal           = [];
    $scope.lstFinancial         = [];
    $scope.lstPendiente         = [];
    $scope.lstauditoria      = [];
    $scope.autDetalle           = [];
    $scope.lstConciliaDetalle   = [];
    
    $scope.currentFinancial     = {};
    $scope.currentauditoria  = {};
    $scope.ctrl  = {};
    $scope.total                = { sistema: 0, archivo: 0 };
    $scope.frmauditoria      = { lblMes: 0, idFinanciera: 0, loadLayout:false}
    $scope.situacion            = { ok:0, financiera:0, gpoAndrade: 0 };
    $scope.diferencias          = { iguales:0, diferentes: 0 };

   

    var increment   = 0;
    var contador    = 0;

         
    
    // Este es como funciona desde Branch Auditoria
    commonFactory.getFinancial(  $scope.session.empresaID ).then(function(result) {
        $scope.lstFinancial = result.data;
    });
    $scope.nexStep = function() {
        if( $scope.frmauditoria.idFinanciera == 0){
            swal("Auditoria","No se ha especificado la financiera.");   
        }
       
        else{
            $scope.insertAuditoria();
        }
        $("#modalNuevaAuditoria").modal('hide');
       
    };
    $scope.insertAuditoria = function() {
        try{
            var parametros = {
                idEmpresa: $scope.session.empresaID,
                idFinanciera: $scope.frmauditoria.idFinanciera,
            }
            auditoriaFactory.insertaAuditoria(parametros).then(function(result) {
               var id= result.data[0].id;
               if(id != undefined)
               {
                $scope.getauditoria(id);

               }
              
            })
                 
        }
        catch( e ){
            console.log( "Error", e );
            swal("Auditoria","El archivo que porporciona no contiene el formato que se espera, asegurese de cargar el layout esperado.");
        }
    }
    $scope.getauditoria = function(id) {

        auditoriaFactory.getAuditoria(id).then(function(result) {
            $scope.ctrl.lblNum = result.data[0][0].idAuditoria;
            $scope.ctrl.lblFecha = result.data[0][0].fecha;
            $scope.ctrl.numveh = result.data[0][0].numveh;
            $scope.ctrl.lblFinanciera = result.data[0][0].financiera;
            $scope.ctrl.idestatus = result.data[0][0].idestatus;
            $scope.lstAuditoriaNormales = result.data[1];
            $scope.lstAuditoriaFS = result.data[2];
            $scope.currentPanel = 'pnlAuditoriaUnidades';
           
        }, function(error) {
            console.log("Error", error);
        });
    };
    $scope.getauditorias = function() {
        var parametros = {
            idEmpresa: $scope.session.empresaID
        }
        auditoriaFactory.getAuditorias(parametros).then(function(result) {
            if(result.data[0].length>0)
           $scope.lstAuditorias = result.data[0];
        }, function(error) {
            console.log("Error", error);
        });
    };
   
  

    $scope.muestraAuditoriaPendiente = function( idauditoria ){
        $scope.idauditoria=idauditoria.idAuditoria;
        // $scope.estatusauditoria=idauditoria.estatus;
        // $scope.frmauditoria.lbltipoauditoria=idauditoria.idTipo;
                                    

        $scope.getauditoria(  $scope.idauditoria) ;
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
        staticFactory.setTableStyleOne(tblID);
    };

    $scope.editDetail = function(valor) {
        var item=valor;
        $rootScope.documento=valor.documento;
        $rootScope.vin=valor.vin;
        $rootScope.observaciones=valor.observaciones;
        $rootScope.idAuditoriaDetalle=valor.idAuditoriaDetalle;
        $rootScope.idAuditoria=valor.idAuditoria;
        $rootScope.tipo=valor.idtipoDetalleAuditoria;
        $('#selectObservaciones').modal('show');
    };
    $scope.GuardarDetail= function(observaciones,idAuditoriaDetalle)
    {
        $rootScope.observaciones=observaciones;
        $rootScope.idAuditoriaDetalle=idAuditoriaDetalle;
        var data = {
            idAuditoriadetalle: $rootScope.idAuditoriaDetalle,
            observaciones:$rootScope.observaciones,
        };
        auditoriaFactory.guardarObservaciones(data).then(function(resultSchema) {
           if( $rootScope.tipo==1)
           {
            for(var i =0;i<$scope.lstAuditoriaNormales.length;i++)
            {
                if($scope.lstAuditoriaNormales[i].idAuditoriaDetalle==$rootScope.idAuditoriaDetalle)
                {
                    $scope.lstAuditoriaNormales[i].observaciones=$rootScope.observaciones;

                }
            }
           }else
           {
            for(var i=0;i<$scope.lstAuditoriaFS.length;i++)
            {
                if($scope.lstAuditoriaFS[i].idAuditoriaDetalle==$rootScope.idAuditoriaDetalle)
                {
                    $scope.lstAuditoriaFS[i].observaciones=$rootScope.observaciones;

                }
            }
           }
           $scope.apply;
                $('#selectObservaciones').modal('hide');
                swal("Ok", "Se guardo con exito", "success");
            
        });
    }
    $scope.guardaAuditoria= function ()
    {
        $('#modalCargarArchivo').modal('show');
       //     $('#selectGuardarPDF').modal('show');
            $scope.Dropzone();
            
        
    }

    var myDropzone;
    $scope.Dropzone = function() {
        $("#templateDropzone").html( '' )

        var html = `<form action="/file-upload" class="dropzone" id="idDropzone">
                        <div class="fallback">
                            <input name="file" type="file" accept=".pdf" />
                        </div>
                    </form>`;

        $("#templateDropzone").html( html );
        myDropzone = new Dropzone("#idDropzone", {
            url: "api/apiAuditoria/upload",
            uploadMultiple: 0,
            maxFiles: 1,
            autoProcessQueue: false,
            acceptedFiles: "application/pdf",
            webkitRelativePath:"/uploads"
        });

        myDropzone.on("success", function(req, xhr) {
            var _this = this;

            var filename = xhr + '.pdf';
            $scope.loadingPanel = true;
            $('#mdlLoading').modal('show');
            $scope.TerminarGuardar(filename);

            $scope.limpiarDropzone = function(){
                _this.removeAllFiles();
                myDropzone.enable()
                $scope.frmauditoria.loadLayout = true;
            }
        });

        myDropzone.on("addedfile", function() {
            $scope.frmauditoria.loadLayout = true;
        });
    };
 
    $scope.readLayout = function(filename,idAuditoria) {
        myDropzone.processQueue();
       
    };
$scope.TerminarGuardar=function(filename)
{
    auditoriaFactory.savePdf(filename, $scope.idauditoria).then(function(result) {
        var res = result;
        $('#mdlLoading').modal('hide');
        $('#modalCargarArchivo').modal('hide');
        $scope.loadingPanel=false;
        swal("Ok", "Se guardo con exito el archivo", "success");
      }, function(error) {
          console.log("Error", error);
      });
}
  
$scope.VerArchivoPdf=function(item){

    var folioEmpresaSucursal = item;
    var arregloBytes = [];
    $rootScope.pdf = undefined;
    auditoriaFactory.getreadPdf(item.ruta).then(function(result) {
        arregloBytes = result.data;

        if (arregloBytes.length == 0) {
            $rootScope.NohayPdf = 1;
            $rootScope.pdf = [];
        } else {

            $rootScope.NohayPdf = undefined;
            $rootScope.pdf = URL.createObjectURL(utils.b64toBlob(arregloBytes, "application/pdf"));

            $('#polizaCancelada').modal('show');
        }

        setTimeout(function() {
            $("#pdfArchivo").html('');
            $("<object class='filesInvoce' data='" + $scope.pdf + "' width='100%' height='500px' >").appendTo('#pdfArchivo');

        }, 100);
        $('#loading').modal('hide');
        console.log($scope.pdf, 'Soy el arreglo ')
    }, function(error) {
        console.log("Error", error);
    });
        

   
}
 
});