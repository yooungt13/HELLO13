define([
    'lib/zepto.js',
    'lib/fastclick.js'], function($, fc) {

    // init pages
    function init() {

        if(!isMobile()) {
            setGitfork();
        } else {
            // 消除点击300ms延迟
            fc.attach(document.body);
        }

        setEvent();
        setBack2Top();
        setGA();
    }

    function setEvent() {

        $(window).on('resize', debounce(function() {
            if( $(window).width() < 320 ) {
                alert('再小就要压扁了。');
            }
        }, 250));

        $(document).on('click', '.menu-icon', function() {
            var $menu = $('.menu');
            if( $menu.hasClass('menu-expand') ) {
                $('.menu').removeClass('menu-expand');
            } else {
                $('.menu').addClass('menu-expand');
            }
        });

        $(document).on('click', function(event) {
            var $menu = $('.menu');

            if( $menu.hasClass('menu-expand') ) {
                if( $menu[0] != event.target && !$.contains($menu[0], event.target) ) {
                    $menu.removeClass('menu-expand');
                }
            }
        });
    }

    function setHeader() {
        var isWebview = true;
        if( isWebview ) {
            $('header').hide();
            $('section').css('padding', '0 .24rem');
        }
    }

    function setGA() {
        // 加入google统计
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create','UA-68588758-1','auto');ga('send','pageview');
    }

    function setGitfork() {
        var $fork = $('<a class="github-fork" href="http://github.com/yooungt13"><img src="http://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png" alt="Fork me on GitHub" /></a>');
            $('body').append($fork);
    }

    function setBack2Top() {
        var $trigger = $('<div class="backToTop icon icon-up-big"></div>');
        $('body').append($trigger);

        $(window).on('scroll', debounce(function() {
            if( $('body').scrollTop() > 0 ) {
                $trigger.css('display', 'block');
            } else {
                $trigger.css('display', 'none');
            }
        }, 250));

        $(document).on('click', '.backToTop', function() {
            document.body.scrollTop = 0;
        });
    }

    function isMobile() {
        var u = navigator.userAgent;
        return !!u.match(/.*Mobile.*/);
    }

    function debounce(action, delay) {
        var last;
        return function() {
            var ctx = this, args = arguments;
            clearTimeout(last);

            last = setTimeout(function() {
                action.apply(ctx, args);
            }, delay);
        };
    }

    return {
        init: init
    }
});