var ApiTraspasoView = require('../views/reference'),
    ApiTraspasoModel = require('../models/dataAccess')


var ApiTraspaso = function(conf) {
    this.conf = conf || {};

    this.view = new ApiTraspasoView();
    this.model = new ApiTraspasoModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


ApiTraspaso.prototype.get_TraspasoFinanciera = function(req, res, next) {

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

ApiTraspaso.prototype.get_TraspasoFinancieraDetalle = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idTraspasoFinanciera', value: req.query.idTraspasoFinanciera, type: self.model.types.INT },
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
ApiTraspaso.prototype.get_setChangeSchema = function(req, res, next) {

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

ApiTraspaso.prototype.get_procesaTraspaso = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idTraspasoFinanciera', value: req.query.idTraspasoFinanciera, type: self.model.types.INT }];

    self.model.query('TRAS_PROCESATRASPASO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiTraspaso.prototype.get_traspasoFlujo = function(req, res, next) {

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
ApiTraspaso.prototype.get_traspasoFinancieraFlujo = function(req, res, next) {

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
ApiTraspaso.prototype.get_TraspasoDetalleAutoriza = function(req, res, next) {

    var self = this;

    var params = [{ name: 'token', value: req.query.token, type: self.model.types.STRING }];

    self.model.query('TRAS_DETALLEAUTORIZA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiTraspaso.prototype.get_ActualizaFechaPP = function(req, res, next) {

    var self = this;

    var params = [{ name: 'fecha', value: req.query.fecha, type: self.model.types.STRING },
    { name: 'idTraspaso', value: req.query.idTraspaso, type: self.model.types.INT }];

    self.model.query('TRAS_UPDATEFECHAPP_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiTraspaso.prototype.get_CambioFECHPROMPAGBPRO = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idTraspaso', value: req.query.idTraspaso, type: self.model.types.INT }];

    self.model.query('TRAS_CAMBIOFECHPROMPAGBPRO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiTraspaso.prototype.get_cancelaTraspasoConFlujo = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idTraspaso', value: req.query.idTraspaso, type: self.model.types.INT }];

    self.model.query('TRAS_CANCELATRASPASOCONFLUJO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiTraspaso.prototype.get_obtieneTodos = function(req, res, next) {

    var self = this;

    var params = [];

    self.model.query('TRAS_GETALLPENDIENTES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiTraspaso.prototype.get_Detalle = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idTraspasoFinanciera', value: req.query.idTraspasoFinanciera, type: self.model.types.INT }];

    self.model.query('TRAS_SEL_GETDETALLE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
module.exports = ApiTraspaso;
