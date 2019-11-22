---
layout : default
indexed : true
title_en : Simple multi language support
title_ko : 단순 다국어 지원
desc_en : Implementation of simple mutlilanguage support for Github pages.
desc_ko : 깃허브 페이지를 위한 단순 다국어 지원 구현
categories : [ jekyll ]
---

# Simple multi language support
{: lang="en"}
# 단순 다국어 지원
{: lang="ko"}

## Motivation
{: lang="en"}
## 개발 동기
{: lang="ko"}

There are lots of ways to implement multi language support. You may have experienced  some or many of Server , UI frameworks, or even through properties.  
However, what about simple pages like this?  
For me, it was quite a pain to translate and to cross check paragraphs which resides in separated files.  
So with my crude skills of javascript, CSS and HTML, I have implemented one by myself.
{: lang="en"}

다국어 지원을 구현할 수 있는 방법은 많습니다.  
많은 서버, UI 프레임워크, 혹은 프로퍼티 파일을 이용해 구현할 수 도 있겠지요.  
하지만 지금과 같은 단순 페이지는 어떻게 해야 할까요?  
다른 파일을 보며 번역과 비교 대조 하는 작업은 제게 꽤 귀찮은 작업이었습니다.  
그래서, 자바스크립트, CSS, HTML로 조잡하게나마 만들어 보았습니다.  
{: lang="ko"}

## Requirements 
{: lang="en"}
## 요구사항
{: lang="ko"}
Requirements are simple. Contents should be in single file.  
Each paragraph of diffrent language should be read, written on adjacent location.  
It would be nice to contents to be easily switched by a button click.  
{: lang="en"}

요구사항은 실로 간단합니다. 내용들이 한 파일에 있으면 됩니다.  
다른 언어로 구성된 각 번역 문단이 이웃하게 위치하면 됩니다.  
각 문단이 버튼으로 쉽게 변경되면 더 멋질 겁니다.
{: lang="ko"}

## Impelementation
{: lang="en"}
## 구현
{: lang="ko"}
Since HTML DOM elements has global attribute 'lang', I have classified elements with three types.
{: lang="en"}
- DOM elements which don't have 'lang' attribute : Should always be displayed.
- DOM elements which  have 'lang' attribute of selected language : Should be displayed when certain language has chosen.
- DOM elements which  have 'lang' attribute of other languages : Should be hidden when certain language has not chosen.
{: lang="en"}

모든 HTML DOM 객체는 전역 속성인 'lang'을 갖고 있으므로, 저는 다음과 같이 세가지로 구분지었습니다.
{: lang="ko"}
- 'lang' 속성이 없는 DOM 객체 :  항상 표시되어야 함
- 'lang' 속성이 선택된 언어인 DOM 객체 :  해당 언어 선택 시 보여야 함
- 'lang' 속성이 선택된 속성이 아닌 DOM 객체 : 보여지지 않아야 함
{: lang="ko"}

When content should be visible in English, css style would be like...  
{: lang="en"}
내용이 영어로 보여야 한다면 , CSS 스타일은 아래와 같을 것입니다.
{: lang="ko"}
```html
<style id="langStyle">
    body [lang]:not([lang|="en"]):not([lang=""]){	
        display : none;	
    }
</style>
```

First 'body' selector is to exclude HTML document itself.(Encountered problem of dissaspearing document on first attempt.)  
Next ``:not([lang|="en"])`` means elements which attribute value is not start with "en".  
Finally, ``:not([lang|""])`` is to exclude Elements which don't have value should be hidden.  
{: lang="en"}
우선 'body' CSS selector는 HTML 문서 자체를 제외하기 위해서입니다.(첫 시도 때 문서 전체가 사라지는 문제를 경험)  
다음 ``:not([lang|="en"])`` 는 언어 속성이 "en"으로 시작하지 않는 대상을 의미합니다.  
마지막으로 ``:not([lang|""])`` 는 언어 속성이 공백이나 지정되지 않는 대상을 제외합니다.
{: lang="ko"}

If browser language is korean, changing css selector 'lang|="en"' to 'lang|="ko"' will do.
In order for viewers to choose language, UI component is required for input. HTML code would be ...
{: lang="en"}
만약 브라우저가 한글이라면 선택자를 'lang|="en"' 에서 'lang|="ko"' 로 변경하면 될 것입니다.
사용자가 언어를 선택하려면, 입력을 받을 UI 컴포넌트가 필요할 것입니다. 그래서 다음과 같이 작성합니다.
{: lang="ko"}
```html
<style>
    #curLangCombo {
        position: fixed;
        top: 0px;
        right: 0px;
        height: 2em;
    }
</style>

<select id="curLangCombo">
	<option value="en" >English</option>
	<option value="ko">한국어</option>
</select>
```
Since there should be only one UI component needed to interact, I put select box to right top corner.
Following code is javascript class for dynamic stylesheet management.
{: lang="en"}
언어 선택 입력자는 1개 만 있어야 하므로 오른쪽 상단에 고정했습니다.
다음은 동적으로 스타일을 제어하는 자바스크립트 클래스입니다.
{: lang="ko"}
```javascript
class LangSelect {
    constructor(domId){
        this.cssDOM = this.getStyleSheet(domId);
        if(!this.cssDOM){
            this.cssDOM = document.createElement("style");
            this.cssDOM.id = domId ||'langSelect';
            document.body.appendChild(this.cssDOM);
            this.cssDOM = this.getStyleSheet(domId);
        }

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

    // Default cssRule
    cssRule(lang){
        return `body [lang]:not([lang|="${lang}"]):not([lang=""]){
            display : none;
        }`;
    }
}

var langSelect = new LangSelect("langStyle");
var combo = document.getElementById("curLangCombo");
combo.value = langSelect.lang;
combo.onchange = event => {
    langSelect.lang = event.target.value;
};
```
This crude class's functionally is to refresh css rule of certain stylesheet when user changes language.  
CSS rules can be overwritten in case of modification.  
And finally, to add 'lang' attribute to each paragraph,
{: lang="en"}
이 허접한 클래스의 역할은  사용자가 언어를 변경하였을 때  동적으로 CSS 규칙을 변경하는 것입니다.  
CSS 규칙은 추가로 변경하고 싶을 경우를 대비해 수정 가능합니다.  
그리고 마지막으로, 각 구문에 'lang' 속성을 추가하려면,
{: lang="ko"}
```
# Title in English
{: lang="en"}
# Title in Korean
{: lang="ko"}

Content in English....
....
{: lang="en"}

Content in Korean....
...
{: lang="ko"}
```

``{: lang="ko"}`` is kramdown syntax for inline Attributes which adds 'lang' attribute to block level elements.
{: lang="en"}
``{: lang="ko"}`` 는 block 단위의 요소에 대하여 'lang' 속성을 추가하는 kramdown 구문입니다.
{: lang="ko"}

## Reference

[https://kramdown.gettalong.org/quickref.html](https://kramdown.gettalong.org/quickref.html)

## Etc
{: lang="en"}
## 기타
{: lang="ko"}

- Implementation : me
- Translation : me

Thank you for reading this.