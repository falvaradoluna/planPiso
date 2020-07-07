var ApiAuditoriaView = require('../views/reference'),
    ApiAuditoriaModel = require('../models/dataAccess'),
    XLSX = require('xlsx'),
    multer = require('multer'),
    fs=require('fs'),
    PDFParser=require('pdf2json');




var ApiAuditoria = function(conf) {
    this.conf = conf || {};

    this.view = new ApiAuditoriaView();
    this.model = new ApiAuditoriaModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


ApiAuditoria.prototype.get_insertaAuditoria = function(req, res, next) {

    var self = this;
    var params = [ { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
    { name: 'idFinanciera', value: req.query.idFinanciera, type: self.model.types.INT }
];

    self.model.query('INS_Auditoria_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiAuditoria.prototype.get_Auditoria = function(req, res, next) {

    var self = this;
    var params = [{ name: 'idAuditoria', value: req.query.idAuditoria, type: self.model.types.INT }
          ];

    self.model.queryAllRecordSet('Get_Auditoria_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiAuditoria.prototype.get_guardarObservaciones = function(req, res, next) {

    var self = this;
    var params = [{ name: 'idAuditoriadetalle', value: req.query.idAuditoriadetalle, type: self.model.types.INT },
    { name: 'observaciones', value: req.query.observaciones, type: self.model.types.STRING }
          ];

    self.model.queryAllRecordSet('UPD_Observaciones_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiAuditoria.prototype.get_Auditorias = function(req, res, next) {

    var self = this;
    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }
          ];

    self.model.queryAllRecordSet('Get_Auditorias_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiAuditoria.prototype.post_upload = function(req, res, next) {
    var filename = String(new Date().getTime());
  
    var storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, './uploads/');
        },
        filename: function(req, file, callback) {

            callback(null, filename + '.pdf');
        }
    });

    var upload = multer({ storage: storage }).any();

    upload(req, res, function(err) {
        if (err) {
            return res.end("Error uploading file.");
        } else {
            return res.end(filename);
        }
    });
};
ApiAuditoria.prototype.get_savePdf = function(req, res, next) {
    var self = this;
    var params = [{ name: 'idAuditoria', value: req.query.idAuditoria, type: self.model.types.INT },
    { name: 'ruta', value: './uploads/'+ req.query.LayoutName, type: self.model.types.STRING }
          ];
 console.log( './uploads/'+ req.query.LayoutName );
    self.model.queryAllRecordSet('UPD_guardarPDF_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiAuditoria.prototype.get_readPdf = function(req, res, next) {
    var self = this;
  var binaryData = fs.readFileSync(req.query.ruta);
  var base64String = new Buffer(binaryData).toString("base64");
  var error=undefined;
        self.view.expositor(res, {
            error: error,
            result: base64String
        });
};
ApiAuditoria.prototype.get_cambiarEncontrada = function(req, res, next) {

    var self = this;
    var params = [{ name: 'idAuditoriadetalle', value: req.query.idAuditoriaDetalle, type: self.model.types.INT },
    { name: 'encontrada', value: req.query.encontrada, type: self.model.types.INT }
          ];

    self.model.queryAllRecordSet('UPD_cambiarEncontrada_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiAuditoria.prototype.get_guardarObservacionesGeneral = function(req, res, next) {

    var self = this;
    var params = [{ name: 'idAuditoriadetalle', value: req.query.idAuditoriadetalle, type: self.model.types.STRING },
    { name: 'observaciones', value: req.query.observaciones, type: self.model.types.STRING }
          ];

    self.model.queryAllRecordSet('UPD_ObservacionesGenerales_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
module.exports = ApiAuditoria;