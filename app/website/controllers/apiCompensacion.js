var ApiCompensacionView = require('../views/reference'),
    ApiCompensacionModel = require('../models/dataAccess')


var ApiCompensacion = function(conf) {
    this.conf = conf || {};

    this.view = new ApiCompensacionView();
    this.model = new ApiCompensacionModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


ApiCompensacion.prototype.get_Lote = function(req, res, next) {

    var self = this;

    var params = [{ name: 'estatusCID', value: req.query.estatusCID, type: self.model.types.INT },
    { name: 'idtipoproceso', value: req.query.idtipoproceso, type: self.model.types.STRING }];

    self.model.query('uspGetLoteInteres', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiCompensacion.prototype.get_LoteDetail = function(req, res, next) {

    var self = this;

    var params = [{ name: 'LoteDetail', value: req.query.LoteDetail, type: self.model.types.INT }];

    self.model.query('uspGetLoteInteresDetalle', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = ApiCompensacion;
