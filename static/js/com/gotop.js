define([], function() {
    return function (dom) {
        dom.onclick = function () {
            window.scrollTo(0, 0);
        }
        function checkVisivle() {
            if (document.body.scrollTop > 300) {
                dom.style.display = "block";
            } else {
                dom.style.display = "none";
            }
        }

        checkVisivle();
        window.addEventListener('scroll', checkVisivle);
    }
});