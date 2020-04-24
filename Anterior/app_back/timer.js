var inicio = 0;
var interval;

var start = function(){
	interval = setInterval( function(){
		inicio++;
		console.log("Contador", inicio);
		if( (inicio % 10) == 0 ){
			console.log('Ejecuta la función');
			clearInterval(interval);

			setTimeout( function(){
				start();
			},10000 );
		}
	}, 1000 );	
}


// start();