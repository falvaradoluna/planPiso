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

        const table = new sql.Table('TmpExcelData');
        table.create = true;
        table.columns.add('numeroSerie', sql.VarChar(25), { nullable: true });
        table.columns.add('valor', sql.Numeric(18, 4), { nullable: true });
        table.columns.add('interes', sql.Numeric(18, 4), { nullable: true });


       // console.log(table);
       console.log(req.query.lstUnidades);

        req.query.lstUnidades.forEach(function(item) {
            var itemObject = JSON.parse(item);
            table.rows.add(itemObject.dato1, itemObject.dato2, itemObject.dato3);
        });

        const request = new sql.Request(dbCnx);
        request.bulk(table, (err, result) => {
            dbCnx.close();
            return res.json({ result: 'OK' });
        })


    }).catch(function(err) {
        res.json(err);
        dbCnx.close();
    });




});


router.post('/upload', function(req, res, next) {


    var filename = String(new Date().getTime());
    var multer = require('multer');
    var storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, 'uploaded/');
        },
        filename: function(req, file, callback) {

            callback(null, filename + '.xlsx');
        }
    });

    var upload = multer({ storage: storage }).any();

    upload(req, res, function(err) {
        if (err) {
            console.log(err);
            return res.end("Error uploading file.");
        } else {
            return res.end(filename);
        }

    });


});

//LayoutName

router.get('/readLayout', function(req, res, next) {
    var self = this;
    var parseXlsx = require('excel');

    parseXlsx('uploaded/' + req.query.LayoutName, function(err, data) {
        if (err) {
            console.log(err);
            return res.end("Error uploading file.");
        } else {

            setTimeout(function() {
                var fs = require("fs");
                fs.unlink('uploaded/' + req.query.LayoutName, function(err) {
                    if (err) {
                        console.log(err);
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