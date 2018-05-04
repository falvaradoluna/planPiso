var appModule = angular.module("planPisoApp", ["ngRoute"]);
appModule.config(function($routeProvider, $locationProvider) {


    $routeProvider.when('/', {
        templateUrl: 'angular/pages/empresa/empresa.html',
        controller: 'empresaController'
    })

    .when('/empresa', {
        templateUrl: 'angular/pages/empresa/empresa.html',
        controller: 'empresaController'
    })

    .when('/unuevas', {
        templateUrl: 'angular/pages/unuevas/unuevas.html',
        controller: 'unuevasController'
    })

    .when('/esquema', {
        templateUrl: 'angular/pages/esquema/esquema.html',
        controller: 'esquemaController'
    })

    .when('/financiera', {
        templateUrl: 'angular/pages/financiera/financiera.html',
        controller: 'financieraController'
    })

    .when('/interes', {
        templateUrl: 'angular/pages/interes/interes.html',
        controller: 'interesController'
    }).when('/pagoInteres', {
        templateUrl: 'angular/pages/pagoInteres/pagoInteres.html',
        controller: 'pagoInteresController'
  
    })
      .when('/provision', {
        templateUrl: 'angular/pages/provision/provision.html',
        controller: 'provisionController'
    })
      .when('/dashboard', {
        templateUrl: 'angular/pages/dashboard/dashboard.html',
        controller: 'dashboardController'
    })

    .when('/tiie', {
        templateUrl: 'angular/pages/tiie/tiie.html',
        controller: 'tiieController'
    })

    .when('/reprogramacion', {
        templateUrl: 'angular/pages/reduccion/templetes/reduccion.html',
        controller: 'reduccionController'
    })

    .when('/conciliacion', {
        templateUrl: 'angular/pages/conciliacion/conciliacion.html',
        controller: 'conciliacionController'
    })

    .when('/autoriza', {
        templateUrl: 'angular/pages/autoriza/autoriza.html',
        controller: 'autorizaController'
    })

    .when('/traspasos', {
        templateUrl: 'angular/pages/traspasos/traspasos.html',
        controller: 'traspasosController'
    });

    $routeProvider.otherwise({ requireBasedirectTo: '/' });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

});