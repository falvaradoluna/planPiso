var express     = require('express');
var router      = express.Router();
var sql         = require("mssql");
var appConfig   = require('../appConfig');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    next();
});

// define the home page route
router.get('/', function(req, res) {
    res.json({ message: 'Test TIIE' });
});

router.get('/getEsquemaExpiration', function(req, res) {
    var resultados = [];
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);
        request.input('idEmpresa', sql.Int, req.query.idEmpresa);

        request.execute('ESQUEMAEXPIRATION_SP').then(function(result) {
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