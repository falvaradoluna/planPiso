appModule.controller('tiieController', function($scope, $rootScope, $location, commonFactory, staticFactory, tiieFactory) {


    $scope.topBarNav = staticFactory.tiieBar();
    var today = staticFactory.todayDate();
    $scope.currentPanel = 'pnlTiie';
    $scope.tiieFields = { date: null, percent: 0 };
    $scope.lstTiie = [];


    tiieFactory.getTiie().then(function(result) {
        $scope.lstTiie = result.data;
    });



    $scope.checkTiie = function() {
        var date = staticFactory.toISODate($scope.tiieFields.date);

        tiieFactory.getTiieDateExist(date).then(function(result) {
            var exist = result.data[0].result;
            if (exist == 1) {
                swal('Aviso', 'La fecha para esta TIIE ya existe.', 'warning');
            } else {
                $scope.insertTiie(date);
            }
        });
    };

    $scope.insertTiie = function(date) {
        var params = {
            fecha: date,
            porcentaje: $scope.tiieFields.percent,
            userID: 0
        };

        tiieFactory.insertTiie(params).then(function(result) {
            swal('Aviso', 'Tiie Agregada con exito', 'success');
        });

    };



    $scope.setTableStyle = function(tableID) {
        staticFactory.setTableStyleOne(tableID);
        $scope.setStyle();
    };

    

    $scope.setStyle = function() {
        staticFactory.setCalendarStyle();
        //$scope.tiieFields.date = today;
        console.log("done");
    };





});