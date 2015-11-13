define(['zepto.js', 'mjs.js', 'common/msg.js'], function ($, mjs, msg) {
    return function (dom) {
        var $dom = $(dom);
        if (window.userName) {
            $dom.find('.old').show();
            $('.userName').text(window.userName);
        } else {
            $dom.find('.new').show();
        }
        var btn = $dom.find('.btn-submit');
        $('.relogin').click(function () {
            $dom.find('.old').hide();
            $dom.find('.new').show();
        });
        btn.click(function (e) {
            if(btn.is('.btn-disabled')){return}
            var phone = $dom.find('.in-phone').val();
            var code = $dom.find('.in-code').val();
            if (!phone) {
                msg.toast('请输入验手机号');
            } else if (!code) {
                msg.toast('请输入手机号');
            } else {
                btn.addClass('btn-disabled');
                mjs.getData({
                    url: '/account/mobilelogin',
                    type: 'POST',
                    data: {
                        mobile: phone,
                        code: code
                    },
                    s: function () {
                        $dom.find('.old').find('.btn-get').click();
                        btn.removeClass('btn-disabled');
                    },
                    e: function (Msg) {
                        btn.removeClass('btn-disabled');
                        msg.toast(Msg);
                    }
                });
            }
        });
    }
});



