var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var apiTiie = require('./app_back/apiTiie');
var apiCommon = require('./app_back/apiCommon');
var apiEmpresa = require('./app_back/apiEmpresa');
var apiEsquema = require('./app_back/apiEsquema');
var apiInteres = require('./app_back/apiInteres');
var apiNewUnits = require('./app_back/apiNewUnits');
var apiPagoInteres = require('./app_back/apiPagoInteres');
var apiConciliacion = require('./app_back/apiConciliacion');
var apiDashboard = require('./app_back/apiDashboard');

var app = express();
var staticPath = path.join(__dirname, '/app_front');

app.use(express.static(staticPath));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/apiTiie', apiTiie);
app.use('/apiCommon', apiCommon);
app.use('/apiEmpresa', apiEmpresa);
app.use('/apiEsquema', apiEsquema);
app.use('/apiInteres', apiInteres);
app.use('/apiNewUnits', apiNewUnits);
app.use('/apiConciliacion', apiConciliacion);
app.use('/apiPagoInteres', apiPagoInteres);
app.use('/apiDashboard', apiDashboard);


app.post('/', function(req, res) {
    res.sendFile(__dirname + '/app_front/index.html');
});

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/app_front/index.html'); /* <= Where my ng-view is located */
});

http.createServer(app).listen(4300, function() {
    console.log('Listen on port 4300 imgServer');
});