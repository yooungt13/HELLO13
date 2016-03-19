/**
 * 图片懒加载组件
 * @date 2016-02-15
 * @author youngtian
 */
define(["lib/zepto.js"], function($) {
    var $window = $(window),
        $body = $('body');

    // 待加载图片列表
    var doms = [];

    function unveil(dom) {
        var $dom = $(dom);

        var wt = $window.scrollTop(),
            wb = wt + $window.height(),
            dt = $dom.offset().top,
            db = dt + $dom.height();

        // 若当前元素在视窗范围内，则进行加载
        if (db >= wt && dt <= wb && dt != db) {
            var source = $dom.attr('data-src');
            var $img = $('<img src=' + source + ' style="visibility:hidden">');

            // 图片加载完毕调整大小
            $img.on('load', imgResize);
            $img.appendTo($dom);
            return true;
        }
        return false;
    }

    function imgResize(e) {
        var dom = e.target;
        var parent = dom.parentElement;

        var dw = dom.offsetWidth, // 图片元素整体宽高
            dh = dom.offsetHeight,
            pw = parent.clientWidth, // 可视区域宽高
            ph = parent.clientHeight;

        if (dw / dh < pw / ph) {
            dom.style.width = '100%';
        } else {
            dom.style.height = '100%';
        }
        dom.style.visibility = '';
        parent.style.background = 'none';
    }

    function unveilAll(argument) {
        for (var i = doms.length - 1; i >= 0; i -= 1) {
            // 加载成功则将该dom从待加载列表中删除
            if (unveil(doms[i])) {
                doms.splice(i, 1);
            }
        }
    }

    // 滚动、拉伸判断是否加载图片
    $window.scroll(unveilAll);
    $window.resize(unveilAll);

    return function(dom) {
        // 懒加载当前dom图片
        // 若不需加载则缓存在待加载列表中
        if (!unveil(dom)) {
            doms.push(dom);
        }
    }
});