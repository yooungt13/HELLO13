(function() {
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
        if( $(window).width() < $('section').width() ) {
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

    $(document).ready(function() {
        if(!isMobile()) {
            var $fork = $('<a class="github-fork" href="http://github.com/yooungt13"><img src="http://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png" alt="Fork me on GitHub" /></a>');
            $('body').append($fork);
        } else {
            // 消除点击300ms延迟
            FastClick.attach(document.body);
        }
    });

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