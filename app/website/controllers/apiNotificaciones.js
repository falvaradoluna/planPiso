var ApiNotificacionesView = require('../views/reference'),
    ApiNotificacionesModel = require('../models/dataAccess'),
    NodeCron = require('node-cron'),
    request = require('request')

var ApiNotificaciones = function(conf) {
    this.conf = conf || {};

    this.view = new ApiNotificacionesView();
    this.model = new ApiNotificacionesModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};

ApiNotificaciones.prototype.get_reporteReduccion = function(req, res, next) {
    var self = this;
    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT }];
    self.model.query('usp_get_notificacionesReduccion', params, function(error, result) {

        var contenidoReporte = {
            "detalle": result
        };
        var urlReport = self.conf.parameters.jsReport;
        // console.log('CONTEDIDO REPORTE', JSON.stringify(contenidoReporte));
        
        var data = {
            template: { 'name': 'reporteNotificacionesPP' },
            data: contenidoReporte
        }
        var options = {
            uri: urlReport,
            method: 'post',
            json: data
        }
        request(options).pipe(res);
    });
};


module.exports = ApiNotificaciones;