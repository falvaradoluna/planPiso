var ApisacarunidadView = require('../views/reference'),
    ApisacarunidadModel = require('../models/dataAccess')
var soap = require('soap');
var parseString = require('xml2js').parseString;

var Apisacarunidad = function(conf) {
    this.conf = conf || {};

    this.view = new ApisacarunidadView();
    this.model = new ApisacarunidadModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

Apisacarunidad.prototype.get_documentos = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }];

    self.model.query('UspGetDocumentosSacarUnidad', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

module.exports = Apisacarunidad;