define(['zepto.js', 'common/msg.js'], function ($, msg) {
    var gmc = function ($dom, url) {
        //防止二次请求 
        if ($dom.attr('disabled') == 'disabled') {
            return;
        }
        $dom.attr('disabled', 'disabled').addClass('btn-disabled');;
        $.ajax({
            url: url,
            type: "POST",
            dataType: 'json',
            success: function (o) {
                $dom.removeAttr('disabled').removeClass('btn-disabled');;
                if (o.status == 0) {
                    var e = $.Event('getCardSuccess', o.data);
                    $dom.trigger(e);
                    if (!e.isDefaultPrevented) {
                        msg.toast('领取成功');
                        history.go(-1);
                    }
                } else if (o.status == -3) {
                    msg.alert(o.message, function () {
                        //登录
                        if (window.isWebview) {
                          location.href = "imeituan://www.meituan.com/signin?redirectURL=" + encodeURIComponent("http://i.meituan.com" + location.pathname);
                        } else {
                          location.href = "http://i.meituan.com/account/login?backurl=http://i.meituan.com" + location.pathname;
                        }
                    });
                } else {
                    var e = $.Event('getCardFail', o);
                    $dom.trigger(e);
                    if (!e.isDefaultPrevented) {
                        msg.toast(o.message);
                    }
                }
            },
            error: function () {
                $dom.removeAttr('disabled').removeClass('btn-disabled');
                var e = $.Event('getCardFail', {});
                $dom.trigger(e);
                if (!e.isDefaultPrevented) {
                    msg.toast("服务器忙，请稍后再试！");
                }
            }
        });
    };
    return function (dom) {
        $(dom).on('click', function () {
            var url = $(this).data('requrl');
            if (!url) {
                url = '/event/assignmagiccard.json?eventId='+$(this).data('eid');
            }
            gmc($(dom), url);
        });
    }
})