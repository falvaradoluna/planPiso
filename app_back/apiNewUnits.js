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
    res.json({ message: 'Test Unidaddes nuevas api' });
});


router.get('/getNewUnits', function(req, res) {

    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);

        request.input('empresaID', sql.Int, req.query.empresaID);

        request.execute('uspGetUnidadesNuevas').then(function(result) {
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



router.get('/getNewUnitsBySucursal', function(req, res) {

    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);

        request.input('empresaID', sql.Int, req.query.empresaID);
        request.input('sucursalID', sql.Int, req.query.sucursalID);

        request.execute('uspGetUnidadesNuevas').then(function(result) {
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

router.post('/setUnitSchema', function(req, res) {

    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);

        request.input('CCP_IDDOCTO', sql.VarChar, req.body.CCP_IDDOCTO);
        request.input('userID', sql.Int, req.body.userID);
        request.input('esquemaID', sql.Int, req.body.esquemaID);
        request.input('fechaCalculo', sql.Date, req.body.fechaCalculo);
        request.input('saldoInicial', sql.Decimal, req.body.saldoInicial);
        request.input('InteresInicial', sql.Decimal, req.body.interes);

        request.execute('uspSetUnidadSchema').then(function(result) {
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


router.get('/dos', function(req, res) {
    res.json({ message: 'api dos' });
});


module.exports = router;