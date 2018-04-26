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
    res.json({ message: 'Test Traspaso api 2' });
});

router.get('/TraspasoFinanciera', function(req, res) {
    var dateFormat = require('moment');
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);

        request.input('idUsuario', sql.Int, req.query.idUsuario);
        request.input('idEmpresa', sql.Int, req.query.idEmpresa);
        request.input('idFinancieraDestino', sql.Int, req.query.idFinancieraDestino);
        request.input('idFinancieraOrigen', sql.Int, req.query.idFinancieraOrigen);

        request.execute('TRAS_NUEVO_SP').then(function(result) {
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

router.get('/TraspasoFinancieraDetalle', function(req, res) {
    var dateFormat = require('moment');
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);

        request.input('idTraspasoFinanciera', sql.Int, req.query.idTraspasoFinanciera);
        request.input('idEsquemaOrigen', sql.Int, req.query.idEsquemaOrigen);
        request.input('idEsquemaDestino', sql.Int, req.query.idEsquemaDestino);
        request.input('CCP_IDDOCTO', sql.VarChar, req.query.CCP_IDDOCTO);
        request.input('fechaPromesaPago', sql.VarChar, req.query.fechaPromesaPago);

        request.execute('TRAS_NUEVODETALLE_SP').then(function(result) {
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
        request.input('financieraID', sql.Int, req.query.financieraID);
        request.input('esquemaID', sql.Int, req.query.esquemaID);

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

router.get('/procesaTraspaso', function(req, res) {
    var dateFormat = require('moment');
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);
        request.input('idTraspasoFinanciera', sql.Int, req.query.idTraspasoFinanciera);

        request.execute('TRAS_PROCESATRASPASO_SP').then(function(result) {
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

router.get('/traspasoFlujo', function(req, res) {
    var dateFormat = require('moment');
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);
        request.input('financieraDestino', sql.Int, req.query.financieraDestino);
        request.input('financieraOrigen', sql.Int, req.query.financieraOrigen);

        request.execute('TRAS_FJUJO_SP').then(function(result) {
            dbCnx.close();
            res.json(result.recordsets[0][0]);
        }).catch(function(err) {
            res.json(err);
            dbCnx.close();
        });

    }).catch(function(err) {
        res.json(err);
        dbCnx.close();
    });
});

router.get('/traspasoFlujoFinanciera', function(req, res) {
    console.log( req.query );
    // var dateFormat = require('moment');
    // var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    // dbCnx.connect().then(function() {
    //     var request = new sql.Request(dbCnx);
    //     request.input('financieraDestino', sql.Int, req.query.financieraDestino);
    //     request.input('financieraOrigen', sql.Int, req.query.financieraOrigen);

    //     request.execute('TRAS_NUEVOCONFLUJO_SP').then(function(result) {
    //         dbCnx.close();
    //         res.json(result.recordsets[0][0]);
    //     }).catch(function(err) {
    //         res.json(err);
    //         dbCnx.close();
    //     });

    // }).catch(function(err) {
    //     res.json(err);
    //     dbCnx.close();
    // });
});

router.get('/traspasoFinancieraFlujo', function(req, res) {
    console.log("TraspasoFinancieraFlujo", req.query);
    var dateFormat = require('moment');
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);

        request.input('idUsuario', sql.Int, req.query.idUsuario);
        request.input('idEmpresa', sql.Int, req.query.idEmpresa);
        request.input('idFinancieraDestino', sql.Int, req.query.idFinancieraDestino);
        request.input('idFinancieraOrigen', sql.Int, req.query.idFinancieraOrigen);
        // request.input('fechaPromesaPago', sql.VarChar, req.query.fechaPromesaPago);
        request.input('flujo', sql.Int, req.query.flujo);

        console.log(request.input);
        request.execute('TRAS_NUEVOCONFLUJO_SP').then(function(result) {
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