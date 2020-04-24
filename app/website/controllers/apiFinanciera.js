var ApiFinancieraView = require('../views/reference'),
    ApiFinancieraModel = require('../models/dataAccess')


var ApiFinanciera = function(conf) {
    this.conf = conf || {};

    this.view = new ApiFinancieraView();
    this.model = new ApiFinancieraModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


ApiFinanciera.prototype.get_Financiera = function(req, res, next) {

    var self = this;

    var params = [{ name: 'financieraID', value: req.query.financieraID, type: self.model.types.INT },
    { name: 'financieraDetalleID', value: req.query.financieraDetalleID, type: self.model.types.INT }];

    self.model.query('uspGetFinancieraDetalle', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiFinanciera.prototype.get_CatalogosTipo = function(req, res, next) {

    var self = this;

    var params = [];
    self.model.query('Usp_CatalogosTipo_GET', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiFinanciera.prototype.get_updFinanciera = function(req, res, next) {

    var self = this;

    var params = [{ name: 'financieraID', value: req.query.financieraID, type: self.model.types.INT },
    { name: 'tipoCobroInteresID', value: req.query.tipoCobroInteresID, type: self.model.types.INT },
    { name: 'tipoPagoMensualID', value: req.query.tipoPagoMensualID, type: self.model.types.INT },
    { name: 'tipoPagoInteresID', value: req.query.tipoPagoInteresID, type: self.model.types.STRING },
    { name: 'tipoSOFOMID', value: req.query.tipoSOFOMID, type: self.model.types.STRING },
    { name: 'tipoCompensacionID', value: req.query.tipoCompensacionID, type: self.model.types.STRING },
    { name: 'usuarioID', value: req.query.usuarioID, type: self.model.types.INT }];

    self.model.query('Usp_Financiera_UPD', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiFinanciera.prototype.get_updFinanciera = function(req, res, next) {

    var self = this;

    var params = [{ name: 'financieraID', value: req.query.financieraID, type: self.model.types.INT },
    { name: 'diasGracia', value: req.query.diasGracia, type: self.model.types.INT },
    { name: 'plazo', value: req.query.plazo, type: self.model.types.INT },
    { name: 'financieraID', value: req.query.financieraID, type: self.model.types.INT },
    { name: 'nombre', value: req.query.nombre, type: self.model.types.STRING },
    { name: 'descripcion', value: req.query.descripcion, type: self.model.types.STRING },
    { name: 'interesMoratorio', value: req.query.interesMoratorio, type: self.model.types.INT },
    { name: 'tasaInteres', value: req.query.tasaInteres, type: self.model.types.INT },
    { name: 'fechaInicio', value: req.query.fechaInicio, type: self.model.types.STRING },
    { name: 'fechaFin', value: req.query.fechaFin, type: self.model.types.STRING },
    { name: 'porcentajePenetracion', value: req.query.porcentajePenetracion, type: self.model.types.INT },
    { name: 'tipoTiieCID', value: req.query.tipoTiieCID, type: self.model.types.INT },
    { name: 'tiie', value: req.query.tiie, type: self.model.types.INT },
    { name: 'usuarioID', value: req.query.usuarioID, type: self.model.types.INT }];

    self.model.query('uspSetFinanciera', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiFinanciera.prototype.get_delFinanciera = function(req, res, next) {

    var self = this;

    var params = [{ name: 'financieraID', value: req.query.financieraID, type: self.model.types.INT }];

    self.model.query('uspDelFinanciera', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = ApiFinanciera;
