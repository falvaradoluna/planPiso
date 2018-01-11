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
    res.json({ message: 'Test TIIE' });
});

router.get('/getTiie', function(req, res) {

    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);

        request.execute('uspGetTiie').then(function(result) {
            dbCnx.close();
            res.json(result.recordsets[0]);
        }).catch(function(err) {
            console.log(err);
            dbCnx.close();
        });

    }).catch(function(err) {
        console.log(err);
        dbCnx.close();
    });

});

router.get('/getTiieDateExist', function(req, res) {

    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        console.log(req.query.fecha);

        var request = new sql.Request(dbCnx);
        request.input('fecha', sql.Date, req.query.fecha);

        request.execute('uspGetTiieDateExist').then(function(result) {
            dbCnx.close();
            res.json(result.recordsets[0]);
        }).catch(function(err) {
            console.log(err);
            dbCnx.close();
        });

    }).catch(function(err) {
        console.log(err);
        dbCnx.close();
    });

});




router.get('/insertTiie', function(req, res) {

    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);
        request.input('fecha', sql.Date, req.query.fecha);
        request.input('porcentaje', sql.Int, req.query.porcentaje);
        request.input('userID', sql.Int, req.query.userID);

        request.execute('uspInsTiie').then(function(result) {
            dbCnx.close();
            res.json(result.recordsets[0]);
        }).catch(function(err) {
            console.log(err);
            dbCnx.close();
        });

    }).catch(function(err) {
        console.log(err);
        dbCnx.close();
    });

});

module.exports = router;