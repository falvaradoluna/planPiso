var ApiProvisionView = require('../views/reference'),
    ApiProvisionModel = require('../models/dataAccess')


var ApiProvision = function(conf) {
    this.conf = conf || {};

    this.view = new ApiProvisionView();
    this.model = new ApiProvisionModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


ApiProvision.prototype.get_Lote = function(req, res, next) {

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

ApiProvision.prototype.get_LoteDetail = function(req, res, next) {

    var self = this;

    var params = [{ name: 'planpisoID', value: req.query.planpisoID, type: self.model.types.INT }];

    self.model.query('uspGetLoteInteresDetalle', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiProvision.prototype.get_ProvisionType = function(req, res, next) {

    var self = this;

    var params = [];

    self.model.query('USP_TipoProceso_GET', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
module.exports = ApiProvision;