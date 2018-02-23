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
    res.json({ message: 'Test Financiera api' });
});


// define the about route
router.get('/getFinanciera', function(req, res) {

    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);
        request.input('financieraID', sql.Int, req.query.financieraID);
        request.input('financieraDetalleID', sql.Int, req.query.financieraDetalleID);

        request.execute('uspGetFinancieraDetalle').then(function(result) {
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

router.get('/getCatalogosTipo', function(req, res) {

    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);


        request.execute('Usp_CatalogosTipo_GET').then(function(result) {
            dbCnx.close();
            res.json(result.recordsets);
        }).catch(function(err) {
            res.json(err);
            dbCnx.close();
        });

    }).catch(function(err) {
        res.json(err);
        dbCnx.close();
    });


});

router.get('/updFinanciera', function(req, res) {


    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);
        request.input('financieraID', sql.Int, req.query.financieraID);
        request.input('tipoCobroInteresID', sql.Int, req.query.tipoCobroInteresID);
        request.input('tipoPagoMensualID', sql.Int, req.query.tipoPagoMensualID);
        request.input('tipoPagoInteresID', sql.NVarChar, req.query.tipoPagoInteresID);
        request.input('tipoSOFOMID', sql.NVarChar, req.query.tipoSOFOMID);
        request.input('usuarioID', sql.Int, req.query.usuarioID);


        request.execute('Usp_Financiera_UPD').then(function(result) {
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

router.get('/updFinanciera', function(req, res) {

    var dateFormat = require('moment');
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);

        request.input('financieraID', sql.Int, req.query.financieraID);
        request.input('diasGracia', sql.Int, req.query.diasGracia);
        request.input('plazo', sql.Int, req.query.plazo);
        request.input('financieraID', sql.Int, req.query.financieraID);
        request.input('nombre', sql.NVarChar, req.query.nombre);
        request.input('descripcion', sql.NVarChar, req.query.descripcion);
        request.input('interesMoratorio', sql.Int, req.query.interesMoratorio);
        request.input('tasaInteres', sql.Decimal, req.query.tasaInteres);
        request.input('fechaInicio', sql.NVarChar, req.query.fechaInicio);
        request.input('fechaFin', sql.NVarChar, req.query.fechaFin);
        request.input('porcentajePenetracion', sql.Decimal, req.query.porcentajePenetracion);
        request.input('tipoTiieCID', sql.Int, req.query.tipoTiieCID);
        request.input('tiie', sql.Decimal, req.query.tiie);

        request.input('usuarioID', sql.Int, req.query.usuarioID);


        request.execute('uspSetFinanciera').then(function(result) {
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

router.get('/delFinanciera', function(req, res) {

    var dateFormat = require('moment');
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);

        request.input('financieraID', sql.Int, req.query.financieraID);

        request.execute('uspDelFinanciera').then(function(result) {
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