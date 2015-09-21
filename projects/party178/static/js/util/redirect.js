define([], function() {
    return function (dom) {
        dom.onclick=function(){
        		if(this.dataset.href){
	        		window.location=this.dataset.href;
        		}
        }
    }
});