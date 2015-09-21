define(["zepto.js"], function($) {
    return function (dom) {
        var $dom = $(dom);
        $dom.click(function () {
            $dom.toggleClass('active');
        });
    }
});