define(["zepto.js"], function($) {
    return function (dom) {
        var $dom = $(dom);
        var img = $dom.find('img');
        var src = $dom.attr('captcha-src');
        var reladTime = 0;
        img.on('error', function () {
            if (reladTime < 3) {
                reladTime++;
                img.attr('src', src);
            }
        }).attr('src', src);
        $dom.find('.refresh').click(function () {
            img.attr('src', src);
        });
    }
});