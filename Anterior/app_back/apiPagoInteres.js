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
    res.json({ message: 'Test Empresa pago' });
});

router.get('/getLote', function(req, res) {

    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);

        request.input('estatusCID', sql.Int, req.query.estatusCID);
        request.input('idtipoproceso', sql.VarChar, req.query.idtipoproceso);
        request.execute('uspGetLoteInteres').then(function(result) {
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




router.get('/getLoteDetail', function(req, res) {

    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);

        request.input('planpisoID', sql.Int, req.query.loteID);

        request.execute('uspGetLoteInteresDetalle').then(function(result) {
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