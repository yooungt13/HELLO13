/**
 * 隐藏标题栏
 * @date 2016-02-17
 * @author youngtian
 */
define(['util/url.js'], function(url) {
    return {
        hide: function() {
            var f = url.parse()['f'];
            if (f && f == 'ios') {
                // 加入样式覆盖标题栏，进行隐藏
                var css = "header { display: none; } section { padding: 0 .24rem }",
                    head = document.head || document.getElementsByTagName("head")[0],
                    style = document.createElement("style");

                style.type = "text/css";

                if (style.styleSheet) {
                    style.styleSheet.cssText = css;
                } else {
                    style.appendChild(document.createTextNode(css));
                }

                head.appendChild(style);
            }
        }
    }
});