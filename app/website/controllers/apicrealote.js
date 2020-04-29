var ApicrealoteView = require('../views/reference'),
    ApicrealoteModel = require('../models/dataAccess')


var Apicrealote = function(conf) {
    this.conf = conf || {};

    this.view = new ApicrealoteView();
    this.model = new ApicrealoteModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


Apicrealote.prototype.get_crealoteFinanciera = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
    { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
    { name: 'idFinancieraDestino', value: req.query.idFinancieraDestino, type: self.model.types.INT },
    { name: 'idFinancieraOrigen', value: req.query.idFinancieraOrigen, type: self.model.types.INT }];

    self.model.query('TRAS_NUEVO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Apicrealote.prototype.get_crealoteFinancieraDetalle = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idcrealoteFinanciera', value: req.query.idcrealoteFinanciera, type: self.model.types.INT },
    { name: 'idEsquemaOrigen', value: req.query.idEsquemaOrigen, type: self.model.types.INT },
    { name: 'idEsquemaDestino', value: req.query.idEsquemaDestino, type: self.model.types.INT },
    { name: 'CCP_IDDOCTO', value: req.query.CCP_IDDOCTO, type: self.model.types.STRING },
    { name: 'fechaPromesaPago', value: req.query.fechaPromesaPago, type: self.model.types.STRING }];

    self.model.query('TRAS_NUEVODETALLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_setChangeSchema = function(req, res, next) {

    var self = this;

    var params = [{ name: 'CCP_IDDOCTO', value: req.query.CCP_IDDOCTO, type: self.model.types.STRING },
    { name: 'usuarioID', value: req.query.usuarioID, type: self.model.types.INT },
    { name: 'financieraID', value: req.query.financieraID, type: self.model.types.INT },
    { name: 'esquemaID', value: req.query.esquemaID, type: self.model.types.INT }];

    self.model.query('Usp_Esquema_UPD', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

Apicrealote.prototype.get_procesacrealote = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idcrealoteFinanciera', value: req.query.idcrealoteFinanciera, type: self.model.types.INT }];

    self.model.query('TRAS_PROCESAcrealote_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_crealoteFlujo = function(req, res, next) {

    var self = this;

    var params = [{ name: 'financieraDestino', value: req.query.financieraDestino, type: self.model.types.INT },
    { name: 'financieraOrigen', value: req.query.financieraOrigen, type: self.model.types.INT }];

    self.model.query('TRAS_FJUJO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_crealoteFinancieraFlujo = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
    { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
    { name: 'idFinancieraDestino', value: req.query.idFinancieraDestino, type: self.model.types.INT },
    { name: 'idFinancieraOrigen', value: req.query.idFinancieraOrigen, type: self.model.types.INT },
    { name: 'flujo', value: req.query.flujo, type: self.model.types.INT }];

    self.model.query('TRAS_NUEVOCONFLUJO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_crealoteDetalleAutoriza = function(req, res, next) {

    var self = this;

    var params = [{ name: 'token', value: req.query.token, type: self.model.types.STRING }];

    self.model.query('TRAS_DETALLEAUTORIZA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_ActualizaFechaPP = function(req, res, next) {

    var self = this;

    var params = [{ name: 'fecha', value: req.query.fecha, type: self.model.types.STRING },
    { name: 'idcrealote', value: req.query.idcrealote, type: self.model.types.INT }];

    self.model.query('TRAS_UPDATEFECHAPP_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_CambioFECHPROMPAGBPRO = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idcrealote', value: req.query.idcrealote, type: self.model.types.INT }];

    self.model.query('TRAS_CAMBIOFECHPROMPAGBPRO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_cancelacrealoteConFlujo = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idcrealote', value: req.query.idcrealote, type: self.model.types.INT }];

    self.model.query('TRAS_CANCELAcrealoteCONFLUJO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_obtieneTodos = function(req, res, next) {

    var self = this;

    var params = [];

    self.model.query('TRAS_GETALLPENDIENTES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apicrealote.prototype.get_Detalle = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idcrealoteFinanciera', value: req.query.idcrealoteFinanciera, type: self.model.types.INT }];

    self.model.query('TRAS_SEL_GETDETALLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
module.exports = Apicrealote;
