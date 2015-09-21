define(["zepto.js"], function($) {
    //倒计时
    return function (dom) {
        var $dom = $(dom);
        var serverTime = parseInt($dom.data('now'));
        var begin = parseInt($dom.data('begin'));
        var end = parseInt($dom.data('end'));
        var $desc = $dom.find(".time-desc");
        var $hour = $dom.find(".time-hour");
        var $min = $dom.find(".time-min");
        var $sec = $dom.find(".time-sec");
        var $btn = $dom.find(".time-btn");
        var status = -1;
        var clientTimeBegin = new Date().getTime();
        function showTime (time) {
            var sec = time % 60;
            if (sec < 10) sec = "0" + sec;
            time = Math.floor(time/60);
            var min = time % 60;
            if (min < 10) min = "0" + min;
            time = Math.floor(time/60);
            var hour = time % 24;
            if (hour < 10) hour = "0" + hour;
            $hour.html(hour);
            $min.html(min);
            $sec.html(sec);
        }
        function upDate () {
            var currentTime = Math.floor(serverTime + (new Date().getTime() - clientTimeBegin)/1000);
            if (currentTime < begin) {
                if (status == -1) {
                    $desc.html("即将开始");
                    $dom.attr('countdown-status', 'waiting');
                    $btn.addClass('btn-disabled').attr('disabled', 'disabled');    
                    //android webview bug修复
                    setTimeout(function () {
                        $dom.css('visibility', null);
                    }, 0);    
                }
                showTime(begin - currentTime);
                status = 0;
            } else if (currentTime < end) {
                if (status <= 0) {
                    $desc.html("距离结束");
                    $dom.attr('countdown-status', 'running');
                    $btn.removeClass('btn-disabled').removeAttr('disabled');
                    $dom.trigger('countdown-begin');
                    $dom.css('visibility', 'hidden');
                    //android webview bug修复
                    setTimeout(function () {
                        $dom.css('visibility', null);
                    }, 0);
                }
                showTime(end - currentTime);
                status = 1;
            } else {
                if (status <= 1) {
                    $desc.html("已结束");
                    $dom.attr('countdown-status', 'over');
                    $btn.addClass('btn-disabled').attr('disabled', 'disabled');
                    $dom.trigger('countdown-end');
                    //android webview bug修复
                    setTimeout(function () {
                        $dom.css('visibility', null);
                    }, 0);
                }
                showTime(0);
                status = 2;
            }
            
        }
        upDate();
        setInterval(upDate, 1000);
    }
});