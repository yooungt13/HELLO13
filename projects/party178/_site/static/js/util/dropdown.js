1;
//下拉菜单
define([], function() {
    return function (dom) {
        var target = dom.getAttribute('data-target');
        var dropdown = document.getElementById(target);
        if (dropdown) {
            dom.addEventListener('click', function (e) {
                dropdown.classList.toggle('active');
                e.stopPropagation();
            });
            document.body.addEventListener('click', function () {
                dropdown.classList.remove('active');
            });
        }
    }
});