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
    res.json({ message: 'Test conciliación api' });
});

// define the about route
router.get('/insExcelData', function(req, res) {
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);
            var itemObject = JSON.parse( req.query.lstUnidades );
            request.input('numeroSerie', sql.VarChar,        itemObject.dato1);
            request.input('valor',       sql.Numeric(18, 4), itemObject.dato2);
            request.input('interes',     sql.Numeric(18, 4), itemObject.dato3);
            request.input('consecutivo', sql.Int,            itemObject.consecutivo);

            request.execute('TEMPORALLAYOUT_SP').then(function(result) {
                res.json(result.recordsets[0]);
                dbCnx.close();
            }).catch(function(err) {
                console.log( "Error A", err );
                res.json(err);
                dbCnx.close();
            });
    }).catch(function(err) {
        console.log( "Error B", err );
        res.json(err);
        dbCnx.close();
    });
});

router.post('/upload', function(req, res, next) {
    var filename = String(new Date().getTime());
    var multer = require('multer');
    var storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, 'app_back/uploaded/');
        },
        filename: function(req, file, callback) {

            callback(null, filename + '.xlsx');
        }
    });

    var upload = multer({ storage: storage }).any();

    upload(req, res, function(err) {
        if (err) {
            return res.end("Error uploading file.");
        } else {
            return res.end(filename);
        }
    });
});

router.get('/readLayout', function(req, res, next) {
    var self = this;
    var parseXlsx = require('excel');

    parseXlsx('C:\\Users\\WINDOWS\\Documents\\GrijalvaApp\\planPiso\\app_back\\uploaded\\' + req.query.LayoutName, function(err, data) {
        if (err) {
            return res.end("Error uploading file.");
        } else {
            setTimeout(function() {
                var fs = require("fs");
                fs.unlink('C:\\Users\\WINDOWS\\Documents\\GrijalvaApp\\planPiso\\app_back\\uploaded\\' + req.query.LayoutName, function(err) {
                    if (err) {
                        return res.end(err);
                    } else {
                        return res.json(data);
                    }
                });
            }, 5000);
        }
    });
});

router.get('/getConciliacion', function(req, res) {
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {

        var request = new sql.Request(dbCnx);
        request.input('financieraID', sql.Int, req.query.financieraID);

        request.execute('uspGetConciliacion').then(function(result) {
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