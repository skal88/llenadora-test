var Llenadora = function(){
	this.offsetIniXp = 0; // Distancia inicial hasta la primera botella fila par (eje X)
	this.offsetIniXi = 0; // Distancia inicial hasta la primera botella fila inpar (eje X)
	this.offsetIniY  = 0; // Distancia inicial hasta la primera botella (eje Y)

	this.offsetXp = 0; // Distancia entre botellas fila par (eje X)
	this.offsetXi = 0; // Distancia entre botellas fila inp (eje X)
	this.offsetY  = 0; // Distancia entre botellas (eje Y)

	this.lastXp = 0; // Distancia de la ultima botella fila par (eje X)
	this.lastXi = 0; // Distancia de la ultima botella fila inpar (eje X)
	this.lastY = 0; // Distancia de la ultima botella (eje Y);

	this.cantBotellasP = 1; // Cantidad de botellas en las filas pares
	this.cantBotellasI = 1; // Cantidad de botellas en las filas inpares
	this.cantBotellasF = 1; // Cantidad de filas de botellas

	this.configStatus = 0; // Estado de la configuracion. 0 = "Sin configurar"; 1 = "Configurando"; 2 = "Configurada";
	this.configStatusPoint = 0; // Punto en el que se encuentra de la configuración

	this.stepsLog = [];
	this.actualStep = 0;

	this.motorX = new Motor();
	this.motorY = new Motor();
}

Llenadora.prototype.init = function(){
	if(this.configStatus == 2){ // Si la maquina está configurada
		this.offsetXp = (this.lastXp - this.offsetIniXp) / this.cantBotellasP - 1;
		this.offsetXi = (this.lastXi - this.offsetIniXi) / this.cantBotellasI - 1;
		this.offsetY  = (this.lastY  - this.offsetIniY ) / this.cantBotellasF - 1;


		// Encendemos los motores 
		this.motorX.enable = 1;
		this.motorY.enable = 1;

		// Generamos todas las posiciones
		this.createPositionsLog();

		return { message: "Maquina inicializada correctamente", code: 200 };
	} else{
		return { message: "Debes configurar la maquina antes", code: 300 };
	}
}

Llenadora.prototype.createPositionsLog = function(){
	var _X = this.offsetIniXp;
	var _Y  = this.offsetIniY;
	var filaPI = 0; // 0 = par; 1 = inpar;

	for( var y=0; y<this.cantBotellasF; y++){ // Recorremos las filas

		var cantPorFila = y%2 == 0 ? this.cantBotellasP : this.cantBotellasI;
		for( var x=0; x<cantPorFila; x++ ){
			var posBotella = {x : _X, y: _Y };
			this.stepsLog.push(posBotella);
			_X += y%2 == 0 ? this.offsetXp : this.offsetXi;
		}
		_Y += this.offsetY;
		_X = y+1 % 2 == 0 ? this.offsetIniXp : this.offsetIniXi;
		
	}
}

Llenadora.prototype.move = function(){
	this.motorX.move();
	this.motorY.move();
	if(this.stepsLog.length > 0 && this.configStatus == 2){
		var newPos = this.stepsLog[this.actualStep];
		this.moveTo( newPos.x, newPos.y ); // Vamos a la posicion de inicio
	}
	if(this.isMoving()){
		if(this.moving && typeof this.moving === "function") this.moving();
	} else{
		if(this.stopped && typeof this.stopped === "function") this.stopped();
	}
}

Llenadora.prototype.isMoving = function(){
	if(this.motorX.posAct != this.motorX.posDes || this.motorY.posAct != this.motorY.posDes){
		return true;
	} else{
		return false;
	}
}

Llenadora.prototype.moveTo = function( x, y){
	this.motorX.posDes = x;
	this.motorY.posDes = y;
}

Llenadora.prototype.nextStep = function(){
	if( this.actualStep >= 0 && this.actualStep < this.stepsLog.length -1 ){
		this.actualStep++;
	} else{
		this.actualStep = 0;
	}
}

Llenadora.prototype.resetMotors = function(){
	this.motorX.reset();
	this.motorY.reset();
}