var ApipolizasView = require('../views/reference'),
    ApipolizasModel = require('../models/dataAccess')


var Apipolizas = function(conf) {
    this.conf = conf || {};

    this.view = new ApipolizasView();
    this.model = new ApipolizasModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


Apipolizas.prototype.get_Lote = function(req, res, next) {

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

Apipolizas.prototype.get_LoteDetail = function(req, res, next) {

    var self = this;

    var params = [{ name: 'planpisoID', value: req.query.planpisoID, type: self.model.types.INT }];

    self.model.query('uspGetLoteInteresDetalle', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = Apipolizas;
