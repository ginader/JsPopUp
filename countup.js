window.onload = function(){
	duration.init();
}
duration = {
	init:function(){
		this.d = -1;
		this.el = document.getElementById("duration");
		this.set();
	},
	set:function(){
		this.d++;
		this.el.innerHTML = this.d;
		window.setTimeout("duration.set()",1000);
	}
}