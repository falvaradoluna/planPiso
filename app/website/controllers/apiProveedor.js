var ApiproveedorView = require('../views/reference'),
    ApiproveedorModel = require('../models/dataAccess')


var Apiproveedor = function(conf) {
    this.conf = conf || {};

    this.view = new ApiproveedorView();
    this.model = new ApiproveedorModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


Apiproveedor.prototype.get_Lote = function(req, res, next) {

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

Apiproveedor.prototype.get_LoteDetail = function(req, res, next) {

    var self = this;

    var params = [{ name: 'planpisoID', value: req.query.planpisoID, type: self.model.types.INT }];

    self.model.query('uspGetLoteInteresDetalle', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
Apiproveedor.prototype.get_proveedorType = function(req, res, next) {

    var self = this;

    var params = [];

    self.model.query('USP_TipoProceso_GET', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
module.exports = Apiproveedor;
