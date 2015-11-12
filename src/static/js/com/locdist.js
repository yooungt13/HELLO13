define(['zepto.js', 'mjs.js'], function($, mjs) {
    return function (dom) {
        var $dom = $(dom);
        mjs.getLoc(function (geo) {
            var dist = mjs.getDistance(geo.lat, geo.lng, parseFloat($dom.attr('data-lat')), parseFloat($dom.attr('data-lng')));
            if (dist < 1) {
                $dom.html(dist + "m");
            } else {
                $dom.html(Math.floor(dist / 100) / 10 + "km");
            }
        });
    }
});