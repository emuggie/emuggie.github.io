var currentLang = currentLang = navigator.language || navigator.userLanguage;
			
try{
	currentLang = currentLang.substring(0,2);
}catch(e){
	currentLang = "en";
}

function switchLang(val){
	Array.prototype.forEach.call(document.getElementsByTagName('*'),function(el){
		if(!el.lang){
			return;
		}
		
		if(val.startsWith(el.lang)){
			el.style.display = null;
		}else{
			el.style.display  = "none";
		}
	});
	currentLang = val;
}
