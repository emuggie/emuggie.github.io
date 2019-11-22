class LangSelect {
    constructor(domId){
        this.cssDOM = this.getStyleSheet(domId);
        if(!this.cssDOM){
            this.cssDOM = document.createElement("style");
            this.cssDOM.id = domId ||'langSelect';
            document.body.appendChild(this.cssDOM);
            this.cssDOM = this.getStyleSheet(domId);
        }
        console.log(this.cssDOM)

        var lang = navigator.language || navigator.userLanguage;
        try{
           lang = lang.substring(0,2);
        }catch(e){
           lang = "en";
        }
        this.lang = lang;
    }
    getStyleSheet(domId){
        for(var i =0;i < document.styleSheets.length;i++){
            var css = document.styleSheets[i];
            if(!css.ownerNode || css.ownerNode.id !== domId){
                continue;
            }
            return css;
        }
        return null;
    }

    get lang(){
        return this._lang;
    }

    set lang(value){
        // Clear all previous styles
        for(var i =this.cssDOM.cssRules.length -1; i > -1 ; i--){
            this.cssDOM.deleteRule(i);
        }
        this.cssDOM.insertRule(this.cssRule(value));
        this._lang = value;
    }

    // Default selector
    cssRule(lang){
        return `body [lang]:not([lang|="${lang}"]):not([lang=""]){
            display : none;
        }`;
    }
}