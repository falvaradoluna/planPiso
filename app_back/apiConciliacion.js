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
    try{
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
                    res.json(false);
                    dbCnx.close();
                });
        }).catch(function(err) {
            console.log( "Error B", err );
            res.json(err);
            dbCnx.close();
        });        
    }
    catch( e ){
        res.json(false);
    }
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
    try{
        var self = this;
        var parseXlsx = require('excel');
        parseXlsx( __dirname + '\\uploaded\\' + req.query.LayoutName, function(err, data) {
            if (err) {
                return res.end("Error uploading file.");
            } else {
                setTimeout(function() {
                    var fs = require("fs");
                    // console.log( __dirname + '\\uploaded\\' + req.query.LayoutName );
                    fs.unlink( __dirname + '\\uploaded\\' + req.query.LayoutName, function(err) {
                        if (err) {
                            return res.end(err);
                        } else {
                            return res.json(data);
                        }
                    });
                }, 5000);
            }
        })
    }
    catch( e ){
        console.log( "Error", e );
        res.json(false);
    }
});

router.get('/validaExistencia', function(req, res) {
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);

        request.input( 'idEmpresa', sql.Int, req.query.idEmpresa );
        request.input( 'idFinanciera', sql.Int, req.query.idFinanciera );
        request.input( 'periodo', sql.Int, req.query.periodo );
        request.input( 'anio', sql.Int, req.query.anio );

        request.execute('CONC_VALIDAEXISTENCIA_SP').then(function(result) {
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

router.get('/getConciliacion', function(req, res) {
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);
        request.input( 'consecutivo', sql.Int, req.query.consecutivo );
        request.input( 'periodo', sql.Int, ( parseInt(req.query.periodo) + 1) );
        request.input( 'financiera', sql.Int, req.query.financiera );

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

router.get('/getAutorizacionDetalle', function(req, res) {
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);
        request.input( 'consecutivo', sql.Int, req.query.consecutivo );

        request.execute('CONC_AUTORIZACIONDETALLE_SP').then(function(result) {
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

router.get('/getCierreMes', function(req, res) {
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);
        request.input( 'periodo', sql.Int, ( parseInt(req.query.periodo) + 1) );

        request.execute('GETCIERREDEMES_SP').then(function(result) {
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

router.get('/creaConciliacion', function(req, res) {
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);
        
        request.input( 'idEmpresa',     sql.Int, req.query.idEmpresa);
        request.input( 'idFinanciera',  sql.Int, req.query.idFinanciera);
        request.input( 'periodo',       sql.Int, req.query.periodo);
        request.input( 'periodoAnio',   sql.Int, req.query.periodoAnio);
        request.input( 'idUsuario',     sql.Int, req.query.idUsuario);

        request.execute('CREACONCILIACION_SP').then(function(result) {
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

router.get('/creaConciliacionDetalle', function(req, res) {
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);
        
        request.input( 'idConciliacion',        sql.Int, req.query.idConciliacion);
        request.input( 'CCP_IDDOCTO',           sql.VarChar, req.query.CCP_IDDOCTO);
        request.input( 'VIN',                   sql.VarChar, req.query.VIN);
        request.input( 'interesGrupoAndrade',   sql.Numeric(18, 4), req.query.interesGrupoAndrade);
        request.input( 'interesFinanciera',     sql.Numeric(18, 4), req.query.interesFinanciera);
        request.input( 'interesAjuste',         sql.Numeric(18, 4), req.query.interesAjuste);
        request.input( 'situacion',             sql.Int, req.query.situacion);

        request.execute('CREACONCILIACIONDETALLE_SP').then(function(result) {
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

router.get('/solicitaAutorizacion', function(req, res) {
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);
        
        request.input( 'consecutivo',       sql.Int, req.query.consecutivo);
        request.input( 'estatus',           sql.Int, req.query.estatus);
        request.input( 'idUsuario',         sql.Int, req.query.idUsuario);
        request.input( 'idFinanciera',      sql.Int, req.query.idFinanciera);
        request.input( 'periodoContable',   sql.Int, req.query.periodoContable);
        request.input( 'anioContable',      sql.Int, req.query.anioContable);

        request.execute('CONC_SOLICITAAUTORIZA_SP').then(function(result) {
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

router.get('/porAutorizar', function(req, res) {
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);

        request.execute('CONC_PORAUTORIZAR_SP').then(function(result) {
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

router.get('/generaConciliacion', function(req, res) {
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);
        
        request.input( 'periodo',   sql.Int, req.query.periodo);
        request.input( 'anio',      sql.Int, req.query.anio);
        request.input( 'financiera',      sql.Int, req.query.financiera);

        request.execute('CONC_ORQUESTACONCILIACION_SP').then(function(result) {
            dbCnx.close();
            console.log( result.recordsets[0] );
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

router.get('/obtieneConciliacion', function(req, res) {
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);
        request.execute('CONC_OBTIENETODAS_SP').then(function(result) {
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

router.get('/conciliaDetalle', function(req, res) {
    var dbCnx = new sql.ConnectionPool(appConfig.connectionString);
    dbCnx.connect().then(function() {
        var request = new sql.Request(dbCnx);
        
        request.input( 'idConciliacion',   sql.Int, req.query.idConciliacion);

        request.execute('CONC_DETALLE_SP').then(function(result) {
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