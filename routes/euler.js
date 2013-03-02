exports.answers = function (request, response) {
	var b=0;
	for(i=1; i<1000;i++){
		if (i%3==0||i%5==0){
		  b=b+i;		 
		}
	} 
	response.send(b);	
}
