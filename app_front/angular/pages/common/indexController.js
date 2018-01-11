appModule.controller("indexController", function($scope) {

    $scope.userLog = "";
    $scope.userPass = "";

    var localvar = localStorage.getItem("userData");
    console.log(localvar);
    
    $scope.setConstValues = function() {
        var welcomeName = document.getElementById("welcomeName");
        var nameUsr = sessionStorage.getItem("lastname");
        var usrName = document.getElementById("usrName");
        welcomeName.innerHTML = "Bienvenido " + nameUsr;
        usrName.innerHTML = nameUsr;
    };
    

    if (sessionStorage.getItem("lastname") == null) {
        window.location = "#pnlLogin";
    } else {
        $scope.setConstValues();
    }

    $scope.login = function() {
        sessionStorage.setItem("lastname", "Juan Perez");
        window.location = "#";
        $scope.setConstValues();
    };

    if (sessionStorage.getItem("sessionFactory") == null && window.location.pathname != '/empresa') {
        window.location = "/empresa";
    }


});