(function() {
    /** back to the top**/
    var $trigger = $('<div class="backToTop icon"></div>');
    $('body').append($trigger);

    $trigger.on('click', function() {
        document.body.scrollTop = 0;
    });

    $(window).on('scroll', function() {
        if( $('body').scrollTop() > 0 ) {
            $trigger.css('display', 'block');
        } else {
            $trigger.css('display', 'none');
        }
    });

    $('.menu-icon').on('click', function() {
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


})();