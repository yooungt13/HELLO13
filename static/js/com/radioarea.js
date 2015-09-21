define([], function() {
    return function (dom) {
        $(dom).on('change', function (e) {
            $(dom).find('label').addClass('btn-weak');
            var $t = $(e.target).parent();
            $t.removeClass('btn-weak');
        });
    }
});