var ApiInteresView = require('../views/reference'),
    ApiInteresModel = require('../models/dataAccess')


var ApiInteres = function(conf) {
    this.conf = conf || {};

    this.view = new ApiInteresView();
    this.model = new ApiInteresModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    };
};


ApiInteres.prototype.get_InterestUnits = function(req, res, next) {

    var self = this;

    var params = [{ name: 'empresaID', value: req.query.empresaID, type: self.model.types.INT },
        { name: 'sucursalID', value: req.query.sucursalID, type: self.model.types.INT },
        { name: 'financieraID', value: req.query.financieraID, type: self.model.types.INT }
    ];

    self.model.query('uspGetUnidadesInteres', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiInteres.prototype.get_DetailUnits = function(req, res, next) {

    var self = this;

    var params = [{ name: 'unidadID', value: req.query.unidadID, type: self.model.types.INT }];

    self.model.query('uspGetUnidadesDetalle', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiInteres.prototype.get_insLotePago = function(req, res, next) {

    var self = this;

    var params = [];

    self.model.query('uspInsLoteInteres', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiInteres.prototype.get_insLotePagoDetalle = function(req, res, next) {

    var self = this;

    var params = [{ name: 'loteID', value: req.query.loteID, type: self.model.types.INT },
        { name: 'unidadID', value: req.query.unidadID, type: self.model.types.INT },
        { name: 'interesCalculado', value: req.query.interesCalculado, type: self.model.types.INT }
    ];

    self.model.query('uspInsLoteInteresDetalle', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiInteres.prototype.get_guardaProvision = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'idFinanciera', value: req.query.idFinanciera, type: self.model.types.INT },
        { name: 'CCP_IDDOCTO', value: req.query.CCP_IDDOCTO, type: self.model.types.STRING },
        { name: 'consecutivo', value: req.query.consecutivo, type: self.model.types.INT },
        { name: 'saldoDocumento', value: req.query.saldoDocumento, type: self.model.types.STRING },
        { name: 'interesCalculado', value: req.query.interesCalculado, type: self.model.types.STRING },
        { name: 'interesAplicar', value: req.query.interesAplicar, type: self.model.types.STRING },
        { name: 'aplica', value: req.query.aplica, type: self.model.types.INT }
    ];

    self.model.query('GUARDAPROVISION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiInteres.prototype.get_procesaProvision = function(req, res, next) {

    var self = this;

    var params = [{ name: 'conse', value: req.query.consecutivo, type: self.model.types.INT }];

    self.model.query('PROCESAPROVISIO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiInteres.prototype.get_SchemaMovements = function(req, res, next) {

    var self = this;

    var params = [{ name: 'CCP_IDDOCTO', value: req.query.CCP_IDDOCTO, type: self.model.types.STRING }];

    self.model.queryAllRecordSet('Usp_EsquemaMovimientos_GET', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiInteres.prototype.get_ProvisionToday = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idtipopoliza', value: req.query.idtipopoliza, type: self.model.types.INT }
    ];

    self.model.query('Pol_Cabecera_INS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiInteres.prototype.get_ProvisionFinancieraDetalle = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idpoliza', value: req.query.idpoliza, type: self.model.types.INT },
        { name: 'idmovimiento', value: req.query.idmovimiento, type: self.model.types.INT },
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'saldo', value: req.query.saldo, type: self.model.types.DECIMAL }
    ];

    self.model.query('Pol_Poliza7Detalle_INS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiInteres.prototype.get_insPago = function(req, res, next) {

    var self = this;

    var params = [{ name: 'CCP_IDDOCTO', value: req.query.CCP_IDDOCTO, type: self.model.types.INT },
        { name: 'idempresa', value: req.query.idempresa, type: self.model.types.INT },
        { name: 'idsucursal', value: req.query.idsucursal, type: self.model.types.INT },
        { name: 'tipoPagoInteresID', value: req.query.tipoPagoInteresID, type: self.model.types.STRING },
        { name: 'tipoPagoMensualID', value: req.query.tipoPagoMensualID, type: self.model.types.INT },
        { name: 'tipoSOFOMID', value: req.query.tipoSOFOMID, type: self.model.types.STRING },
        { name: 'tipoCobroInteresID', value: req.query.tipoCobroInteresID, type: self.model.types.STRING },
        { name: 'interesMes', value: req.query.interesMes, type: self.model.types.STRING },
        { name: 'saldo', value: req.query.saldo, type: self.model.types.INT },
        { name: 'totalMes', value: req.query.totalMes, type: self.model.types.STRING },
        { name: 'fechaPromesa', value: req.query.fechaPromesa, type: self.model.types.INT },
        { name: 'usuarioID', value: req.query.usuarioID, type: self.model.types.INT }
    ];

    self.model.query('Usp_CreaPago_INS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiInteres.prototype.get_validaPago = function(req, res, next) {

    var self = this;

    var params = [{ name: 'CCP_IDDOCTO', value: req.query.CCP_IDDOCTO, type: self.model.types.STRING }];

    self.model.query('Usp_ValidaPago_GET', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiInteres.prototype.get_Compensacion = function(req, res, next) {

    var self = this;

    var params = [{ name: 'CCP_IDDOCTO', value: req.query.CCP_IDDOCTO, type: self.model.types.STRING }];

    self.model.query('Usp_Compensacion_GET', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiInteres.prototype.get_insCompensacion = function(req, res, next) {

    var self = this;

    var params = [{ name: 'CCP_IDDOCTO', value: req.query.CCP_IDDOCTO, type: self.model.types.STRING },
        { name: 'idempresa', value: req.query.idempresa, type: self.model.types.INT },
        { name: 'idsucursal', value: req.query.idsucursal, type: self.model.types.INT },
        { name: 'saldo', value: req.query.saldo, type: self.model.types.INT },
        { name: 'usuarioID', value: req.query.usuarioID, type: self.model.types.INT }
    ];

    self.model.query('Usp_CreaCompensacion_INS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiInteres.prototype.get_ReduccionFinanciera = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idtipopoliza', value: req.query.idtipopoliza, type: self.model.types.INT }
    ];

    self.model.query('Pol_Cabecera_INS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

ApiInteres.prototype.get_ReduccionFinancieraDetalle = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idpoliza', value: req.query.idpoliza, type: self.model.types.INT },
        { name: 'idmovimiento', value: req.query.idmovimiento, type: self.model.types.INT },
        { name: 'idUsuario', value: req.query.idUsuario, type: self.model.types.INT },
        { name: 'saldo', value: req.query.saldo, type: self.model.types.DECIMAL }
    ];

    self.model.query('Pol_PolizaReduccionDetalle_INS', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiInteres.prototype.get_interestUnitsNews = function(req, res, next) {

    var self = this;

    var params = [{ name: 'empresaID', value: req.query.empresaID, type: self.model.types.INT },
        { name: 'sucursalID', value: req.query.sucursalID, type: self.model.types.INT },
        { name: 'financieraID', value: req.query.financieraID, type: self.model.types.INT }
    ];

    self.model.query('uspGetUnidadesInteresNuevas', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiInteres.prototype.get_interestUnitsPreOwned = function(req, res, next) {

    var self = this;

    var params = [{ name: 'empresaID', value: req.query.empresaID, type: self.model.types.INT },
        { name: 'sucursalID', value: req.query.sucursalID, type: self.model.types.INT },
        { name: 'financieraID', value: req.query.financieraID, type: self.model.types.INT }
    ];

    self.model.query('uspGetUnidadesInteresSeminuevas', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiInteres.prototype.post_insertaDocumentosLote = function(req, res, next) {

    var self = this;
    console.log(req.body);
    var table = '[PlanPiso].[dbo].[documentosLote]'
    var values = req.body;
    self.model.queryInsertDocumentosLote(table, values, function(error, result) {
        console.log(error, 'SOY EL ERROR')
        console.log(result, 'SOY EL RESULTADO')
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
    // var params = [{ name: 'empresaID', value: req.query.empresaID, type: self.model.types.INT },
    // { name: 'sucursalID', value: req.query.sucursalID, type: self.model.types.INT },
    // { name: 'financieraID', value: req.query.financieraID, type: self.model.types.INT }];

    // self.model.query('uspGetUnidadesInteresSeminuevas', params, function(error, result) {
    //     self.view.expositor(res, {
    //         error: error,
    //         result: result
    //     });
    // });    
};
ApiInteres.prototype.get_facturaUnidad = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'documento', value: req.query.documento, type: self.model.types.STRING }
    ];

    self.model.query('usp_get_facturaUnidad', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiInteres.prototype.get_facturaTramites = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'documento', value: req.query.documento, type: self.model.types.STRING }
    ];

    self.model.query('usp_get_facturaTramites', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiInteres.prototype.get_facturaServicios = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'documento', value: req.query.documento, type: self.model.types.STRING }
    ];

    self.model.query('usp_get_facturaServicio', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiInteres.prototype.get_facturaOT = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'documento', value: req.query.documento, type: self.model.types.STRING }
    ];

    self.model.query('usp_get_facturaOT', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
ApiInteres.prototype.get_facturaAccesorios = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
        { name: 'idSucursal', value: req.query.idSucursal, type: self.model.types.INT },
        { name: 'documento', value: req.query.documento, type: self.model.types.STRING }
    ];

    self.model.query('usp_get_facturaAccerosio', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};
module.exports = ApiInteres;