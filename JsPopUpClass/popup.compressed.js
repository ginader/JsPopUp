PopUp=function(_1){this.types=[];this.persistantWindows=[];this.defaults={width:800,height:600,top:0,left:0,location:false,resizable:false,scrollbars:false,status:false,toolbar:false,menubar:false,position:"center",title:"Dieser Link wir in einem neuen Fenster ge&ouml;ffnet",persist:false};this.addType({name:"standard",location:true,resizable:true,scrollbars:true,status:true,toolbar:true,menubar:true});if(_1){this.apply();}};o=PopUp.prototype;o.getClassesNamesOf=function(l){return l.className.split(" ");};o.hasClassName=function(el,_4){var _5=this.getClassesNamesOf(el);for(var i=0,l=_5.length;i<l;i++){if(_5[i]==_4){return true;}}return false;};o.addClassName=function(el,_8){var _9=this.getClassesNamesOf(el);_9[_9.length]=_8;el.className=_9.join(" ");};o.removeClassName=function(el,_b){var _c=this.getClassesNamesOf(el);for(var i=0,l=_c.length;i<l;i++){if(_c[i]==_b){_c[i]="";}}el.className=_c.join(" ");};o.apply=function(){var _e=document.getElementsByTagName("a");if(!_e){return;}for(var i=0;i<_e.length;i++){var l=_e[i];if(this.hasClassName(l,"popup")){this.attachBehavior(l,this.getType(l));}}var b=document.getElementsByTagName("body")[0];this.addClassName(b,"jspopup");};o.addType=function(_12){for(var _13 in this.defaults){if(_12[_13]==undefined){_12[_13]=this.defaults[_13];}}this.types[_12.name]=_12;};o.getType=function(l){for(var _15 in this.types){if(this.hasClassName(l,_15)){return _15;}}return "standard";};o.attachBehavior=function(l,_17){var t=this.types[_17];l.title=t.title;l.popupProperties={type:_17,ref:this};l.onclick=function(){this.popupProperties.ref.open(this.href,this.popupProperties.type);return false;};};o.booleanToWord=function(_19){if(_19){return "yes";}return "no";};o.getTopLeftCentered=function(_1a){var t=_1a;var r={left:t.left,top:t.top};var sh=screen.availHeight-20;var sw=screen.availWidth-10;if(!sh||!sw){return r;}r.left=(sw/2)-(t.width/2);r.top=(sh/2)-(t.height/2);return r;};o.getParamsOfType=function(_1f){var t=_1f;var c=this.booleanToWord;if(t.position.indexOf("center")!=-1||t.center){var tc=this.getTopLeftCentered(_1f);t.left=tc.left;t.top=tc.top;}else{var pos=t.position.split(" ");for(var i=0;i<pos.length;i++){switch(pos[i]){case "left":t.left=0;break;case "right":t.left=screen.availWidth-t.width-10;break;case "top":t.top=0;break;case "bottom":t.top=screen.availHeight-t.height-20;break;default:break;}}}var p="width="+t.width;p+=",height="+t.height;p+=",left="+t.left;p+=",top="+t.top;p+=",location="+c(t.location);p+=",resizable="+c(t.resizable);p+=",scrollbars="+c(t.scrollbars);p+=",status="+c(t.status);p+=",toolbar="+c(t.toolbar);p+=",menubar="+c(t.menubar);return p;};o.open=function(url,_27){if(!_27){_27="standard";}var t=this.types[_27];var p=this.getParamsOfType(t);if(t.persist&&this.persistantWindows[t.name]){var w=this.persistantWindows[t.name];}else{var w=window.open(url,t.name,p);if(t.persist){this.persistantWindows[t.name]=w;}}if(w){w.focus();}return false;};