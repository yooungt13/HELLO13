(function() {
    $(document).ready(function() {
        if(!isMobile()) {
            appendGitfork();
        } else {
            // 消除点击300ms延迟
            FastClick.attach(document.body);
        }

        setEvent();
        setGA();
    });

    function setEvent() {
        /** back to the top**/
        var $trigger = $('<div class="backToTop icon"></div>');
        $('body').append($trigger);

        $trigger.on('click', function() {
            document.body.scrollTop = 0;
        });

        $(window).on('scroll', debounce(function() {
            if( $('body').scrollTop() > 0 ) {
                $trigger.css('display', 'block');
            } else {
                $trigger.css('display', 'none');
            }
        }, 250));

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

    function setGA() {
        // 加入google统计
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create','UA-68588758-1','auto');ga('send','pageview');
    }

    function appendGitfork() {
        var $fork = $('<a class="github-fork" href="http://github.com/yooungt13"><img src="http://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png" alt="Fork me on GitHub" /></a>');
            $('body').append($fork);
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

})();