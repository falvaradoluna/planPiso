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
    res.json({ message: 'Test Traspaso api' });
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

module.exports = router;