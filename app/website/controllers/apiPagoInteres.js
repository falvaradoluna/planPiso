var ApiPagoInteresView = require('../views/reference'),
    ApiPagoInteresModel = require('../models/dataAccess')


var ApiPagoInteres = function(conf) {
    this.conf = conf || {};

    this.view = new ApiPagoInteresView();
    this.model = new ApiPagoInteresModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


ApiPagoInteres.prototype.get_Lote = function(req, res, next) {

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

ApiPagoInteres.prototype.get_LoteDetail = function(req, res, next) {

    var self = this;

    var params = [{ name: 'planpisoID', value: req.query.planpisoID, type: self.model.types.INT }];

    self.model.query('uspGetLoteInteresDetalle', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = ApiPagoInteres;
