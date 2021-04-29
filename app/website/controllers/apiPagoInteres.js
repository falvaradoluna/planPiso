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

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }];

    self.model.query('usp_get_documentosPagoInteres', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

PagoInteres.prototype.post_guardaIdIntereses = function(req, res, next) {

    var self = this;

    var params = [];

    self.model.query('ins_idPagoInteres', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

PagoInteres.prototype.post_insInteres = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idmovimiento', value: req.body.idmovimiento, type: self.model.types.INT },
        { name: 'idfinanciera', value: req.body.idfinanciera, type: self.model.types.INT },
        { name: 'idesquema', value: req.body.idesquema, type: self.model.types.INT },
        { name: 'saldo', value: req.body.saldo, type: self.model.types.DECIMAL },
        { name: 'puntos', value: req.body.puntos, type: self.model.types.DECIMAL },
        { name: 'tiie', value: req.body.tiie, type: self.model.types.DECIMAL },
        { name: 'penetracion', value: req.body.penetracion, type: self.model.types.DECIMAL },
        { name: 'plazo', value: req.body.plazo, type: self.model.types.INT },
        { name: 'fechatiie', value: req.body.fechatiie, type: self.model.types.STRING },
        { name: 'fechainicio', value: req.body.fechainicio, type: self.model.types.STRING },
        { name: 'fechafin', value: req.body.fechafin, type: self.model.types.STRING },
        { name: 'Interes', value: req.body.Interes, type: self.model.types.DECIMAL },
        { name: 'dias', value: req.body.dias, type: self.model.types.INT },
        { name: 'totalInteres', value: req.body.totalInteres, type: self.model.types.DECIMAL },
        { name: 'tipo', value: req.body.tipo, type: self.model.types.STRING },
        { name: 'idpagoInteres', value: req.body.idpagoInteres, type: self.model.types.INT },
        { name: 'tasa', value: req.body.tasa, type: self.model.types.DECIMAL }
    ];
    console.log(params)
    self.model.query('INS_pagoInteres', params, function(error, result) {
        console.log(result)
        console.log(error)
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
PagoInteres.prototype.post_updInteresLote = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idLote', value: req.body.idLote, type: self.model.types.INT },
        { name: 'idPagoInteres', value: req.body.idPagoInteres, type: self.model.types.INT }];

    self.model.query('upd_loteInteres', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

PagoInteres.prototype.post_polizaInteres = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idpagoInteres', value: req.body.idPagoInteres, type: self.model.types.INT },
    { name: 'idUsuario', value: req.body.idUsuario, type: self.model.types.INT },
    { name: 'idproveedor', value: req.body.idProveedor, type: self.model.types.INT }
    ];

    self.model.query('ins_poliza_intereses', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = PagoInteres;