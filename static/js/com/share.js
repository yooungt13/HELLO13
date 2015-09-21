define(["zepto.js", "common/msg.js", "util/url.js"], function($, msg, URL) {
    //拨打电话
    $('head').append('<style>.msg-doc.msg-share{bottom: initial;top: .3rem;text-align: right;background: transparent;color: white;font-size: .4rem;text-shadow: 0 0 4px black;}</style>')

    return function (dom) {
        var $dom = $(dom);
        if (window.maoyan) {
            $dom.hide();
            return;
        } else if (/f=ios|f=android|f=iphone/.test(location.href)) {
            var ua = "native";
        } else {
            var ua = "touch"
        }

        $dom.click(function () {
            var href = location.origin + location.pathname + (location.search?  '?' + filterXInfo(location.search) : '');
            var url = encodeURIComponent($dom.attr('data-share-url') || href);
            var title = encodeURIComponent($dom.attr('data-share-text') || document.title);
            var pic = encodeURIComponent($dom.attr('data-share-pic') || $('img').attr('src'));
            var channel = $dom.attr('data-share-channel') || 385;
            var weiboContent =  encodeURIComponent($dom.attr('data-share-weibo'));
            if (ua == "touch") {
                msg.option("", [
                    {
                        text: "新浪微博",
                        url: 'http://service.weibo.com/share/share.php?appkey=1550938859&url=' + url + '&pic=' + pic + "&title="+title
                    }
                ]);
            } else if (ua == "native") {
                var shareLink = "imeituan://www.meituan.com/share?channel=" + channel + "&title=" + title + "&imageURL=" + pic + "&detailURL=" + url + "&content_-1=" + url + (weiboContent?("&content_1="+weiboContent):"");
                location.href = shareLink;
            } else {
                msg.diy('<style>.msg-share{pointer-events: none}</style><img style="width:100%;" src="http://p0.meituan.net/mmc/de96e40c0c716a588aa935a8b61c677a24596.png"/>', null, {type: "share", closeOut: true, opacity: .7});
            }
        })

        function filterXInfo (queryString) {
            var qsObj = URL.parseQueryString(queryString),
                x = ['token', 'userid', 'f', 'msid', 'version_name' ];

            x.forEach(function (k) {
                delete qsObj[k];
            });

            return URL.stringifyQuery(qsObj);
        }
    }
});