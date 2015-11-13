define(["zepto.js", "common/msg.js"], function($, msg) {
    //拨打电话
    return function(dom){
        var $dom = $(dom);
        var call = $dom.attr("data-tele"),
            exp = /\//g,
            calls = call.split(exp);
        var phoneOptions = [];
        for(var i = 0; i < calls.length; i++){
            phoneOptions.push({
                text: calls[i],
                url: 'tel:'+calls[i]
            });
        }
        $dom.on("click", function () {        
            msg.option("拨打电话", phoneOptions);
        });
    }
});