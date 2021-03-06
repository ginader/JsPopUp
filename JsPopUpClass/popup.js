/*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
* JsPopUp 1.6
* Opening Browser-Windows the unobtrusive way
* Dirk Ginader
* blog.ginader.de
* dirk@ginader.de
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
* degrades nicely, unobtrusive
* succesfully testet in:
* Windows
* * Firefox 2.0
* * Firefox 1.5
* * IE 7
* * IE 6
* * IE 5.5
* * IE 5.01
* * Opera 8.02
* MAC OS X
* * Firefox 1.5
* * Safari 2.03
* * IE 5.02 MAC 
* Linux (Ubuntu)
* * Firefox 1.07
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
* USAGE in the Head of an HTML-Page: 
<script language="JavaScript" type="text/javascript" src="JsPopUpClass/popup.js"></script>
<script type="text/javascript">
window.onload = function(){ // Better use use a modern onDomReady-Event instead
	if(document.getElementById && document.getElementsByTagName){ // Check DOM
		popup = new PopUp(); // create new PopUp-Instance
		popup.addType({ // add a additional type with custom Properties
			name: "pdf",
			width: 1024,
			height: 706,
			location:true
		});
		popup.apply(); // Apply Popup-Behavior to all Links using the Class "popup"		
		//popup.open("http://www.webkrauts.de"); // call open Method onload to open popup directly
		//popup.open("http://www.webkrauts.de","pdf"); // 2nd Param optional to define a special type
	}
}
</script>
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
* USAGE in the Body of an HTML-Page:
<p><a class="popup" href="http://www.ginader.de">Ich</a> bin nur ein Link mit der Klasse "popup"</p>
<p>Ich <a class="popup pdf" href="http://www.webkrauts.de">bin</a> nur ein Link mit der Klasse"popup" und der Klasse "pdf" </p>
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
* License:
* This file is entirely BSD licensed.

* More information:
* http://blog.ginader.de/dev/popup.html
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
* CHANGELOG:
1.6 New Feature:
	* default classname "jspopup" is now changeable as 2nd param to the constructor (thanks to Sven Rhinow for the hint)
1.5 New Features:
	* Position Window to left right top bottom center (combineable! i.e: "top left" except center (just like css backgroundposition syntax)) (overwrites defaults: center, top, left)
	  (Thanks to Henning http://www.webkrauts.de/2006/12/19/unaufdringliche-neue-browserfenster/#comment-12068)
	* Focus already opened Window instead of reopening it
	  (Thanks to nos http://www.webkrauts.de/2006/12/19/unaufdringliche-neue-browserfenster/#comment-10619)
	* Add the class "jspopup" to the Bodytag after applying the Functionality to allow different styles
	* New Method to completely remove the Popup Behavior by the User
	* New option "multiple" that prevents opening windows of the same type in the same window
	Bug Fixes: 
	* fixed the Bug in Ticket #12 that prevented reopening a closed persistent window
	
1.0 Initial Version
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
*/
PopUp = function(autoapply,baseclass){
	this.baseclass = baseclass || "popup";
	this.types = [];
	this.persistantWindows = [];
	this.popuplinks = [];
	this.docbody = null;
	this.removeReApplyConfig = null;
	this.defaults = {
		width:800,
		height:600,
		top:0,
		left:0,
		location:false,
		resizable:false,
		scrollbars:false,
		status:false,
		toolbar:false,
		menubar:false,
		multiple:false,
		position:"center",
		title:"Dieser Link wir in einem neuen Fenster ge&ouml;ffnet",
		persist:false
	};
	this.addType({
		name:"standard",
		location:true,
		resizable:true,
		scrollbars:true,
		status:true,
		toolbar:true,
		menubar:true
	});
	if(autoapply) this.apply();
};
o = PopUp.prototype;

o.setRemoveReApplyLink = function(config){
	this.removeReApplyConfig = config;
	var containerObj = document.getElementById(config.containerId);
	if(!containerObj)return;
	containerObj.innerHTML = "<a href=\"#\">"+config.removeText+"</a>";
	var linkObj = containerObj.getElementsByTagName("a")[0];
	if(!linkObj)return;
	linkObj.ref = this;
	linkObj.onclick = function(){
		if(this.ref.active){
			this.ref.deactivate();
			this.innerHTML = this.ref.removeReApplyConfig.reApplyText;
		}else{
			this.ref.reactivate();	
			this.innerHTML = this.ref.removeReApplyConfig.removeText;	
		}
	};
};
o.deactivate = function(){
	this.active = false;
	this.removeClassName(this.docbody,"jspopup");
	this.setLinkTitlesToActiveState();
};
o.reactivate = function(){
	this.active = true;
	this.setLinkTitlesToActiveState();
	this.addClassName(this.docbody,"jspopup");
};
o.setLinkTitlesToActiveState = function(){
	for(var i=0,l=this.popuplinks.length;i<l;i++){
		var a = this.popuplinks[i];
		if(this.active){
			a.title = a.activetitle;
		}else{
			a.title = a.defaulttitle;
		}
	}
};
o.apply = function(){
	var links = document.getElementsByTagName("a");
	if(!links) return;
	this.docbody = document.getElementsByTagName("body")[0];
	if(!this.docbody) return;	
	for(var i=0;i<links.length;i++){
		var l = links[i];
		if(this.hasClassName(l,this.baseclass)){
			this.popuplinks[this.popuplinks.length] = l;
			this.attachBehavior(l,this.getType(l));
		};
	};
	this.addClassName(this.docbody,"jspopup");
	this.active = true;
};
o.addType = function(type){
	for(var prop in this.defaults){
		if(type[prop] == undefined) type[prop] = this.defaults[prop];
	};
	this.types[type.name] = type;
};
o.getType = function(l){
	for(var type in this.types){
		if(this.hasClassName(l,type)) return type;
	};
	return "standard";
};
o.attachBehavior = function(l,type){
	var t = this.types[type];
	l.defaulttitle = l.title;
	l.title = l.activetitle = t.title;
	l.popupProperties = {
		type: type,
		ref: this
	};
	l.onclick = function(){
		this.popupProperties.ref.open(this.href,this.popupProperties.type);
		return (!this.popupProperties.ref.active);
	};
};
o.booleanToWord = function(bool){
	if(bool) return "yes";
	return "no";
};
o.getTopLeftCentered = function(typeObj){
	var t = typeObj;
	var r = {left:t.left, top:t.top};
	var sh = screen.availHeight-20;
	var sw = screen.availWidth-10;
	if(!sh || !sw) return r;
	r.left = (sw/2)-(t.width/2);
	r.top = (sh/2)-(t.height/2);
	return r;
};
o.getParamsOfType = function(typeObj){
	var t = typeObj;
	var c = this.booleanToWord;
	if(t.position.indexOf("center") != -1|| t.center){
		var tc = this.getTopLeftCentered(typeObj);
		t.left = tc.left;
		t.top = tc.top;
	}else{
		var pos = t.position.split(" ");
		for(var i=0;i<pos.length;i++){
			switch (pos[i]) {
				case "left":t.left = 0;break;
				case "right":t.left = screen.availWidth-t.width-10;break;
				case "top":t.top = 0;break;
				case "bottom":t.top = screen.availHeight-t.height-20;break;
				default:break;
			};
		};
	};
	var p = "width="+t.width;
	p+=",height="+t.height;
	p+=",left="+t.left;
	p+=",top="+t.top;
	p+=",location="+c(t.location);
	p+=",resizable="+c(t.resizable);
	p+=",scrollbars="+c(t.scrollbars);
	p+=",status="+c(t.status);
	p+=",toolbar="+c(t.toolbar);
	p+=",menubar="+c(t.menubar);
	return p;
};
o.open = function(url,type){
	if(!this.active) return true;
	if(!type) type = "standard";
	var t = this.types[type];
	var p = this.getParamsOfType(t);
	if(t.multiple) t.name = "_blank";
	if(t.persist && this.persistantWindows[t.name] && !this.persistantWindows[t.name].closed){
		var w = this.persistantWindows[t.name];
	}else{
		var w = window.open(url,t.name,p);
		if(t.persist) this.persistantWindows[t.name] = w;
	};
	if(w) w.focus();
	return false;
};
//Classname Tools
o.getClassesNamesOf = function(l){
	return l.className.split(" ");
};
o.hasClassName = function(el,className){
	var classNames = this.getClassesNamesOf(el);
	for(var i=0,l=classNames.length;i<l;i++){
		if(classNames[i] == className) return true;
	}
	return false;
};
o.addClassName = function(el,className){
	var classNames = this.getClassesNamesOf(el);
	classNames[classNames.length] = className;
	el.className = classNames.join(" ");
};
o.removeClassName = function(el,className){
	var classNames = this.getClassesNamesOf(el);
	for(var i=0,l=classNames.length;i<l;i++){
		if(classNames[i] == className) classNames[i]="";
	};
	el.className = classNames.join(" ");
};