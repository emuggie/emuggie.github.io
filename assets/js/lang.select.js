var currentLang = currentLang = navigator.language || navigator.userLanguage;
			
try{
	currentLang = currentLang.substring(0,2);
}catch(e){
	currentLang = "en";
}

function switchLang(val){
	Array.prototype.forEach.call(document.styleSheets, function(css){
		if(css.title != "langStyle"){
			return;
		}
		
		for(var i=0; i < css.cssRules.length; i++)
			css.deleteRule(0);
		
		css.insertRule('*[lang]:not([lang="'+val+'"]){	display : none;	}',0);
	});
	currentLang = val;
}
