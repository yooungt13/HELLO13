define([],function() {
    var _body = document.body,
        _el = null,
        _isOpen = false,
/*
 .wxtips {
 text-align: left;
 position: fixed;
 top: 0;
 left: 0;
 width: 100%;
 z-index: 999;
 height: 100%;
 background: rgba(0, 0, 0, 0.5);
 }
 .wxtips-doc {
 background: #fff;
 border-radius: 0 0 6px 6px;
 margin: 0 10px;
 padding: 15px 30px;
 }
 .wxtips-doc h3 {
 font-size: 30px;
 margin-bottom: 10px;
 }
 .wxtips-doc i {
 display: inline-block;
 background: url("http://mc.meituan.net/touch/img/client/wx_tips.png") no-repeat;
 background-size: 61px auto;
 line-height: 300px;
 overflow: hidden;
 height: 27px;
 width: 48px;
 margin: 0 5px;
 vertical-align: middle;
 }
 .wxtips-doc ol {
 }
 .wxtips-doc ol li {
 margin: 12px 0 26px;
 line-height: 1.4em;
 }
 .wxtips-doc ol li:before {
 margin-left: -14px;
 }
 .wxtips-doc i.wxtips-top {
 position: fixed;
 top: 10px;
 right: 20px;
 width: 31px;
 height: 56px;
 background-position: 0 -175px;
 }
*/
    _css = '.wxtips{text-align:left;position:fixed;top:0;left:0;width:100%;z-index:999;height:100%;background:rgba(0,0,0,0.5);}.wxtips-doc{background:#fff;border-radius:0 0 6px 6px;margin:0 10px;padding: 15px 30px;}.wxtips-doc h3{font-size:30px;margin-bottom:10px;}.wxtips-doc i{display:inline-block;background:url("http://mc.meituan.net/touch/img/client/wx_tips.png") no-repeat;background-size:61px auto;line-height:300px;overflow:hidden;height:27px;width:48px;margin:0 5px;vertical-align:middle;}.wxtips-doc ol{}.wxtips-doc ol li{margin:12px 0 26px;line-height:1.4em;}.wxtips-doc ol li:before{margin-left:-14px;}.wxtips-doc i.wxtips-top{position:fixed;top:10px;right:20px;width:31px;height:56px;background-position:0 -175px;}';
    var show = function(type){

        var _cel = document.createElement('style');
            _cel.innerHTML = _css;
        document.head.appendChild(_cel);

        _el = document.createElement('div');
        _el.className = 'wxtips';
        _el.innerHTML = '<div class="wxtips-doc">'
            + '<h3>请用浏览器打开下载：</h3>'
            + '<ol>'
                + '<li>点击右上角的<i style="background-position: 0 -112px">...</i>或者<i style="background-position: 0 -143px">分享</i></li>'
                + (type!=='ios' ? '<li>选择在浏览器中打开<br>即可下载美团客户端<i style="margin-top:-23px; width: 47px; height: 47px; background-position: 0 -61px;">浏览器</i></li>' : '<li>选择在Safari中打开<br>即可下载美团客户端<i style="margin-top:-28px; width: 61px; height: 61px;">Safari</i></li>')
            + '</ol>'
            + '<i class="wxtips-top">右上角</i>'
            + '</div>';

        _body.appendChild(_el);
        _el.addEventListener('click', function(e){
            if(_isOpen){
                _el.style.display = 'none';
                _isOpen = false;
            }
        });
    };
    var ua = window.navigator.userAgent;
    
    return function (dom) {
        if(ua.indexOf('MicroMessenger') > -1) {
            dom.addEventListener('click', function(e){
                if (ua.indexOf('iPhone') > 0) {
                    e.preventDefault();

                    if(_el != null){
                        _el.style.display = 'block';
                    }else{
                        show(ua.indexOf('iPhone') > 0 ? 'ios' : '');
                        _isOpen = true;
                    }
                }
            });
        }
    }
});