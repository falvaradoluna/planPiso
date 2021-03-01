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
    res.json({ message: 'Test Esquema api' });
});


// define the about route
router.get('/getEsquemaDetalle', function(req, res) {

    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);
        request.input('esquemaID', sql.Int, req.query.esquemaID);
        request.input('esquemaDetalleID', sql.Int, req.query.esquemaDetalleID);

        request.execute('uspGetEsquemaDetalle').then(function(result) {
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



router.get('/putEsquema', function(req, res) {


    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);
        request.input('diasGracia', sql.Int, req.query.diasGracia);
        request.input('plazo', sql.Int, req.query.plazo);
        request.input('financieraID', sql.Int, req.query.financieraID);
        request.input('nombre', sql.NVarChar, req.query.nombre);
        request.input('descripcion', sql.NVarChar, req.query.descripcion);
        request.input('interesMoratorio', sql.Int, req.query.interesMoratorio);
        request.input('tasaInteres', sql.Numeric, req.query.tasaInteres);
        request.input('fechaInicio', sql.NVarChar, req.query.fechaInicio);
        request.input('fechaFin', sql.NVarChar, req.query.fechaFin);
        request.input('porcentajePenetracion', sql.Decimal, req.query.porcentajePenetracion);
        request.input('tipoTiieCID', sql.Int, req.query.tipoTiieCID);
        request.input('tiie', sql.Numeric, req.query.tiie);
        request.input('usuarioID', sql.Int, req.query.usuarioID);


        request.execute('uspInsEsquema').then(function(result) {
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

router.get('/updEsquema', function(req, res) {

    var dateFormat = require('moment');
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);

        request.input('esquemaID', sql.Int, req.query.esquemaID);
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


        request.execute('uspSetEsquema').then(function(result) {
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

router.get('/delEsquema', function(req, res) {

    var dateFormat = require('moment');
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);

        request.input('esquemaID', sql.Int, req.query.esquemaID);

        request.execute('uspDelEsquema').then(function(result) {
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