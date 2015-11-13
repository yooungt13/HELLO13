define(["zepto.js", "util/cookie.js"], function($, cookie) {
    var $w = $(window);
    var high = false;
    if (window.performance && performance.timing.responseEnd - performance.timing.requestStart < 1000) {
        high = true;
    } else if (!window.performance) {
        var net = parseInt(cookie.get("nettype"));
        if(net && net < 200) {
            high = true;
        }
    }
    $w.scroll(unveilAll);
    $w.resize(unveilAll);
    //body的refreshview也会触发，例如当切换tab时，原先隐藏的块出现是需要重新review
    $('body').on('refreshview', unveilAll);
    $('body').on('unveilAll', unveilAll);//接口暴露
    //unveil一张图片
    function imgResize (dom) {
        var t= dom.target;
        var tp = dom.target.parentElement;
        var dw = t.offsetWidth;
        var dh = t.offsetHeight;
        var pw = tp.clientWidth;
        var ph = tp.clientHeight;
        if (dw/dh < pw/ph) {
            t.style.width = "100%";
        } else {
            t.style.height = "100%";
        }
        t.style.visibility = "";
        dom.target.parentElement.style.background="none";
    }
    function unveil($e) {
        var wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.height();
        //当改元素可以显示 并且在窗口内
        if (eb >= wt && et <= wb && eb - et != 0) {
            var source = $e.attr("data-src");
            var sourcehigh = $e.attr("data-src-high") || source;
            if (high) {
                var $imgDom = $('<img src="' + sourcehigh + '" style="visibility:hidden">');
            } else {
                var $imgDom = $('<img src="' + source + '" style="visibility:hidden">');
            }
            $imgDom.on("load", imgResize);
            $e.append($imgDom);
            return true;
        }
        return false;
    }

    //unveil全部
    function unveilAll() {
        for (var i = 0; i < unveilPics.length; i++) {
            if (unveil(unveilPics[i])) {
                unveilPics.splice(i, 1);
                i--;
            }
        }
    }

    var unveilPics = [];

    return function (dom) {
        if (!unveil($(dom))) {
            unveilPics.push($(dom));
        }
    }
});