var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
// var ejs = require('ejs');
var swig = require('swig');

var apiTiie = require('./app_back/apiTiie');
var apiCommon = require('./app_back/apiCommon');
var apiEmpresa = require('./app_back/apiEmpresa');
var apiEsquema = require('./app_back/apiEsquema');
var apiFinanciera = require('./app_back/apiFinanciera');
var apiInteres = require('./app_back/apiInteres');
var apiTraspaso = require('./app_back/apiTraspaso');
var apiNewUnits = require('./app_back/apiNewUnits');
var apiPagoInteres = require('./app_back/apiPagoInteres');
var apiProvision = require('./app_back/apiProvision');
var apiCompensacion = require('./app_back/apiCompensacion');
var apiConciliacion = require('./app_back/apiConciliacion');
var apiDashboard = require('./app_back/apiDashboard');
var timer = require('./app_back/timer');
var apiReduccion = require('./app_back/apiReduccion');

var app = express();
var staticPath = path.join(__dirname, '/app_front');

app.use(express.static(staticPath));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/apiTiie', apiTiie);
app.use('/apiCommon', apiCommon);
app.use('/apiEmpresa', apiEmpresa);
app.use('/apiEsquema', apiEsquema);
app.use('/apiFinanciera', apiFinanciera);
app.use('/apiInteres', apiInteres);
app.use('/apiTraspaso', apiTraspaso);
app.use('/apiNewUnits', apiNewUnits);
app.use('/apiConciliacion', apiConciliacion);
app.use('/apiPagoInteres', apiPagoInteres);
app.use('/apiProvision', apiProvision);
app.use('/apiCompensacion', apiCompensacion);
app.use('/apiDashboard', apiDashboard);
app.use('/apiReduccion', apiReduccion);



// app.engine('.html', require('ejs').__express);
// app.set('view engine', 'ejs');

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
//this.expressServer.set('views', __dirname + '/website/views/templates');
app.set('views', __dirname + '/app_front');
swig.setDefaults({ varControls: ['[[', ']]'] });

// app.engine('html', ejs.renderFile);
// app.set('views', __dirname + '/app_front');
// app.set('view engine', 'html');
// console.log( ejs );
// ejs.setDefaults({varControls:['[[',']]']});


app.post('/', function(req, res) {
    var user = { idUsuario: req.body.idUsuario };
    // console.log( "idUsuario", user );
    res.render('index', { user });
});

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/app_front/index.html'); /* <= Where my ng-view is located */
});

http.createServer(app).listen(4900, function() {
    console.log('Listen on port 4900 imgServer');
});