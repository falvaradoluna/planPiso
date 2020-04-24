var ApiNewUnitsView = require('../views/reference'),
    ApiNewUnitsModel = require('../models/dataAccess')


var ApiNewUnits = function(conf) {
    this.conf = conf || {};

    this.view = new ApiNewUnitsView();
    this.model = new ApiNewUnitsModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


ApiNewUnits.prototype.get_NewUnits = function(req, res, next) {

    var self = this;

    var params = [{ name: 'empresaID', value: req.query.empresaID, type: self.model.types.INT }];

    self.model.query('uspGetUnidadesNuevas', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiNewUnits.prototype.get_NewUnitsBySucursal = function(req, res, next) {

    var self = this;

    var params = [{ name: 'empresaID', value: req.query.empresaID, type: self.model.types.INT },
    { name: 'sucursalID', value: req.query.sucursalID, type: self.model.types.INT }];

    self.model.query('uspGetUnidadesNuevas', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiNewUnits.prototype.post_setUnitSchema = function(req, res, next) {

    var self = this;
    var fecha = req.body.fechaCalculo.replace('-', '').replace('-', '');
    var params = [{ name: 'CCP_IDDOCTO', value: req.body.CCP_IDDOCTO, type: self.model.types.INT },
    { name: 'userID', value: req.body.userID, type: self.model.types.INT },
    { name: 'empresaID', value: req.body.empresaID, type: self.model.types.INT },
    { name: 'fecha_Calculo', value: fecha, type: self.model.types.INT },
    { name: 'saldoInicial', value: req.body.saldoInicial, type: self.model.types.INT },
    { name: 'InteresInicial', value: req.body.InteresInicial, type: self.model.types.INT }];

    self.model.query('uspSetUnidadSchema', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = ApiNewUnits;
