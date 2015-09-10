var Motor = function(){
	this.enable = 0; // 0 = Desactivado; 1 = Activado;
	this.posAct = 0;
	this.posDes = 0;
	this.dir = 1; // 1 = Adelante; -1 = Atras;
}

Motor.prototype.move = function(){
	if( this.posAct != this.posDes && this.enable == 1 ){
		if( this.posDes > this.posAct ){ this.setDirection("FORWARD"); }
		else if( this.posDes < this.posAct ){ this.setDirection("BACKWARD"); }

		this.posAct += this.dir;
	}
}

Motor.prototype.setDirection = function(dir){
	if(dir == 1 || dir == "FORWARD"){ this.dir = 1; }
	else if(dir == -1 || dir == "BACKWARD"){ this.dir = -1; }
	else if(dir == 0  || dir == "STOP"){ this.dir = 0; }
}

Motor.prototype.reset = function(){
	this.posDes = 0;
}