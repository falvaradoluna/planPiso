var ApiTiieView = require('../views/reference'),
    ApiTiieModel = require('../models/dataAccess')


var ApiTiie = function(conf) {
    this.conf = conf || {};

    this.view = new ApiTiieView();
    this.model = new ApiTiieModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

ApiTiie.prototype.get_Tiie = function(req, res, next) {

    var self = this;

    var params = [];

    self.model.query('uspGetTiie', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiTiie.prototype.get_TiieDateExist = function(req, res, next) {

    var self = this;

    var params = [{ name: 'fecha', value: req.query.fecha, type: self.model.types.STRING }];

    self.model.query('uspGetTiieDateExist', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiTiie.prototype.get_insertTiie = function(req, res, next) {

    var self = this;

    var params = [{ name: 'fecha', value: req.query.fecha, type: self.model.types.STRING },
    { name: 'porcentaje', value: req.query.porcentaje, type: self.model.types.INT },
    { name: 'userID', value: req.query.userID, type: self.model.types.INT }];

    self.model.query('uspInsTiie', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiTiie.prototype.get_actualizaTiie = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idTIIE', value: req.query.idTIIE, type: self.model.types.STRING },
    { name: 'porcentaje', value: req.query.porcentaje, type: self.model.types.INT }];

    self.model.query('ACTUALIZATIIE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
module.exports = ApiTiie;
