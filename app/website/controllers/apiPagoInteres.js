var PagoInteresView = require('../views/reference'),
    PagoInteresModel = require('../models/dataAccess')


var PagoInteres = function(conf) {
    this.conf = conf || {};

    this.view = new PagoInteresView();
    this.model = new PagoInteresModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

PagoInteres.prototype.get_readFile = function(req, res, next) {

    var self = this;
    var binaryData = fs.readFileSync('./files/LayoutPagoInteres.xlsx');
    var base64String = new Buffer(binaryData).toString("base64");
    var error = undefined;
    self.view.expositor(res, {
        error: error,
        result: base64String
    });
};

PagoInteres.prototype.get_documentosPagos = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }
    ];

    self.model.query('usp_get_documentosPagoInteres ', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};


module.exports = PagoInteres;