var express = require('express');
var router = express.Router();
var sql = require("mssql");
var appConfig = require('../appConfig');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    next();
});
// define the home page route
router.get('/', function(req, res) {
    res.json({ message: 'Test interes api' });
});

// define the about route
router.get('/getInterestUnits', function(req, res) {
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);
        request.input('empresaID', sql.Int, req.query.empresaID);
        request.input('sucursalID', sql.Int, req.query.sucursalID);
        request.input('financieraID', sql.Int, req.query.financieraID);
        request.execute('uspGetUnidadesInteres').then(function(result) {
            dbCnx.close();
            res.json(result.recordsets[0]);
        }).catch(function(err) {
            res.json(err);
            dbCnx.close();
        });
    }).catch(function(err) {
        res.json(err);
        dbCnx.close();
    });
});

router.get('/getDetailUnits', function(req, res) {
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);

        request.input('unidadID', sql.Int, req.query.unidadID);

        request.execute('uspGetUnidadesDetalle').then(function(result) {
            dbCnx.close();
            res.json(result.recordsets[0]);
        }).catch(function(err) {
            res.json(err);
            dbCnx.close();
        });
    }).catch(function(err) {
        res.json(err);
        dbCnx.close();
    });
});

router.get('/insLotePago', function(req, res) {
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);

        request.execute('uspInsLoteInteres').then(function(result) {
            dbCnx.close();
            res.json(result.recordsets[0]);
        }).catch(function(err) {
            res.json(err);
            dbCnx.close();
        });

    }).catch(function(err) {
        res.json(err);
        dbCnx.close();
    });
});

router.get('/insLotePagoDetalle', function(req, res) {
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);
        request.input('loteID', sql.Int, req.query.loteID);
        request.input('unidadID', sql.Int, req.query.unidadID);
        request.input('interesCalculado', sql.Int, req.query.interesCalculado);

        request.execute('uspInsLoteInteresDetalle').then(function(result) {
            dbCnx.close();
            res.json(result.recordsets[0]);
        }).catch(function(err) {
            res.json(err);
            dbCnx.close();
        });

    }).catch(function(err) {
        res.json(err);
        dbCnx.close();
    });
});

router.get('/setChangeSchema', function(req, res) {
    var dateFormat = require('moment');
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);

        request.input('CCP_IDDOCTO', sql.VarChar, req.query.CCP_IDDOCTO);
        request.input('usuarioID', sql.Int, req.query.usuarioID);
        request.input('empresaID', sql.Int, req.query.empresaID);
        request.input('sucursalID', sql.Int, req.query.sucursalID);
        request.input('financieraID', sql.Int, req.query.financieraID);
        request.input('esquemaID', sql.Int, req.query.esquemaID);
        request.input('tipoMovimientoId', sql.Int, req.query.tipoMovimientoId);

        request.execute('Usp_Esquema_UPD').then(function(result) {
            dbCnx.close();
            res.json(result.recordsets[0]);
        }).catch(function(err) {
            res.json(err);
            dbCnx.close();
        });

    }).catch(function(err) {
        res.json(err);
        dbCnx.close();
    });
});

router.get('/guardaProvision', function(req, res) {
    var dateFormat = require('moment');
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);

        request.input('idEmpresa', sql.Int, req.query.idEmpresa);
        request.input('idSucursal', sql.Int, req.query.idSucursal);
        request.input('idFinanciera', sql.Int, req.query.idFinanciera);
        request.input('CCP_IDDOCTO', sql.VarChar, req.query.CCP_IDDOCTO);
        request.input('consecutivo', sql.Int, req.query.consecutivo);
        request.input('saldoDocumento', sql.VarChar, req.query.saldoDocumento);
        request.input('interesCalculado', sql.VarChar, req.query.interesCalculado);
        request.input('interesAplicar', sql.VarChar, req.query.interesAplicar);
        request.input('aplica', sql.Int, req.query.aplica);

        request.execute('GUARDAPROVISION_SP').then(function(result) {
            res.json(result.recordsets);
            dbCnx.close();
        }).catch(function(err) {
            res.json(err);
            dbCnx.close();
        });

    }).catch(function(err) {
        res.json(err);
        dbCnx.close();
    });
});
router.get('/procesaProvision', function(req, res) {
    var dateFormat = require('moment');
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);

        request.input('conse', sql.Int, req.query.consecutivo);
        request.execute('PROCESAPROVISIO_SP').then(function(result) {
            res.json(result.recordsets);
            dbCnx.close();
        }).catch(function(err) {
            res.json(err);
            dbCnx.close();
        });

    }).catch(function(err) {
        res.json(err);
        dbCnx.close();
    });
});
router.get('/getSchemaMovements', function(req, res) {
    var dateFormat = require('moment');
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);

        request.input('CCP_IDDOCTO', sql.VarChar, req.query.CCP_IDDOCTO);
        request.execute('Usp_EsquemaMovimientos_GET').then(function(result) {
            res.json(result.recordsets);
            dbCnx.close();
        }).catch(function(err) {
            res.json(err);
            dbCnx.close();
        });

    }).catch(function(err) {
        res.json(err);
        dbCnx.close();
    });
});
router.get('/getProvisionToday', function(req, res) {
    var dateFormat = require('moment');
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);

        request.input('CCP_IDDOCTO', sql.VarChar, req.query.CCP_IDDOCTO);
        request.input('empresaID', sql.VarChar, req.query.empresaID);
        request.input('sucursalID', sql.VarChar, req.query.sucursalID);
        request.execute('Usp_ProvisionToday_GET').then(function(result) {
            res.json(result.recordsets);
            dbCnx.close();
        }).catch(function(err) {
            res.json(err);
            dbCnx.close();
        });

    }).catch(function(err) {
        res.json(err);
        dbCnx.close();
    });
});

router.get('/insPago', function(req, res) {
    var dateFormat = require('moment');
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);

        request.input('CCP_IDDOCTO', sql.VarChar, req.query.CCP_IDDOCTO);
        request.input('idempresa', sql.Int, req.query.empresaID);
        request.input('idsucursal', sql.Int, req.query.sucursalID);
        request.input('tipoPagoInteresID', sql.Int, req.query.tipoPagoInteresID);
        request.input('tipoPagoMensualID', sql.Int, req.query.tipoPagoMensualID);
        request.input('tipoSOFOMID', sql.Int, req.query.tipoSOFOMID);
        request.input('tipoCobroInteresID', sql.Int, req.query.tipoCobroInteresID);
        request.input('interesMes', sql.Decimal, req.query.InteresMes);
        request.input('saldo', sql.Decimal, req.query.saldo);
        request.input('totalMes', sql.Decimal, req.query.TotalMes);
        request.input('fechaPromesa', sql.NVarChar, req.query.FechaPromesa);

        request.input('usuarioID', sql.Int, req.query.usuarioID);

        request.execute('Usp_CreaPago_INS').then(function(result) {
            dbCnx.close();
            res.json(result.recordsets[0]);
        }).catch(function(err) {
            res.json(err);
            dbCnx.close();
        });

    }).catch(function(err) {
        res.json(err);
        dbCnx.close();
    });
});
router.get('/validaPago', function(req, res) {
    var dateFormat = require('moment');
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);

        request.input('CCP_IDDOCTO', sql.VarChar, req.query.CCP_IDDOCTO);

        request.execute('Usp_ValidaPago_GET').then(function(result) {
            dbCnx.close();
            res.json(result.recordsets[0]);
        }).catch(function(err) {
            res.json(err);
            dbCnx.close();
        });

    }).catch(function(err) {
        res.json(err);
        dbCnx.close();
    });
});
router.get('/GetCompensacion', function(req, res) {
    var dateFormat = require('moment');
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);

        request.input('CCP_IDDOCTO', sql.VarChar, req.query.CCP_IDDOCTO);

        request.execute('Usp_Compensacion_GET').then(function(result) {
            dbCnx.close();
            res.json(result.recordsets[0]);
        }).catch(function(err) {
            res.json(err);
            dbCnx.close();
        });

    }).catch(function(err) {
        res.json(err);
        dbCnx.close();
    });
});
router.get('/insCompensacion', function(req, res) {
    var dateFormat = require('moment');
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);

        request.input('CCP_IDDOCTO', sql.VarChar, req.query.CCP_IDDOCTO);
        request.input('idempresa', sql.Int, req.query.empresaID);
        request.input('idsucursal', sql.Int, req.query.sucursalID);
        request.input('saldo', sql.Decimal, req.query.saldo);
        request.input('usuarioID', sql.Int, req.query.usuarioID);

        request.execute('Usp_CreaCompensacion_INS').then(function(result) {
            dbCnx.close();
            res.json(result.recordsets[0]);
        }).catch(function(err) {
            res.json(err);
            dbCnx.close();
        });

    }).catch(function(err) {
        res.json(err);
        dbCnx.close();
    });
});

module.exports = router;