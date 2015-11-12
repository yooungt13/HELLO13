define(["zepto.js"], function($) {
    $('head').append('<style>.sticky-top,.sticky-bottom{position:fixed!important;z-index:10;top:0;left:0;box-sizing:border-box;-webkit-filter:drop-shadow(0 0 .06rem rgba(0,0,0,0.6));}.sticky-bottom{top:auto;bottom:0}</style>');
    var wh = document.documentElement.clientHeight;
    return function (dom) {
        var $dom = $(dom);
        var $anchor = $('<div></div>');
        var dir = $(dom).attr('sticky-pos') || "top";
        $dom.before($anchor);
        function checkfixd () {
            if($dom.hasClass('sticky-top')){
                if($anchor.offset().top >= document.body.scrollTop) {
                    $dom.removeClass('sticky-top');
                    $anchor.height(0);
                }
            } else if ($dom.hasClass('sticky-bottom')) {
                if($anchor.offset().top + $dom.height() < document.body.scrollTop + wh) {
                    $dom.removeClass('sticky-bottom');
                    $anchor.height(0);
                }
            } else {
                if (dir == "bottom") {
                    if($anchor.offset().top + $dom.height() >= document.body.scrollTop + wh) {
                        $dom.addClass('sticky-bottom');
                        $anchor.height($dom.height());
                    }
                } else {
                    if($dom.offset().top < document.body.scrollTop) {
                        $dom.addClass('sticky-top');
                        $anchor.height($dom.height());
                    }
                }
            }
        }
        checkfixd();
        window.addEventListener('scroll', checkfixd);
        //修复ios下webview的scroll问题
        var nav = navigator.userAgent;
        if(/iPhone/.test(nav) && !/Safari/.test(nav)) {
            window.addEventListener('touchmove', checkfixd);
        }
    }
});