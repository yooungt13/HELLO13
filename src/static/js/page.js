define([
    'lib/zepto.js',
    'lib/fastclick.js'
], function($, fc) {

    // 缓冲全局selector
    var $document = $(document),
        $window = $(window),
        $body = $('body');

    // init pages
    function init() {

        if (!isMobile()) {
            setGitfork();
        } else {
            // 消除点击300ms延迟
            fc.attach(document.body);
        }

        setEvent();
        setBack2Top();
        setGA();
        setDataCom();
    }

    function setEvent() {

        $window.on('resize', debounce(function() {
            if ($window.width() < 320) {
                alert('再小就要压扁了。');
            }
        }, 250));

        // 菜单下拉
        $document.on('click', '.menu-icon', function() {
            $('.menu').toggleClass('menu-expand');
        });

        // 点击非菜单 收起菜单
        $document.on('click', function(event) {
            var $menu = $('.menu');

            if ($menu.hasClass('menu-expand')) {
                if ($menu[0] != event.target && !$.contains($menu[0], event.target)) {
                    $menu.removeClass('menu-expand');
                }
            }
        });
    }

    // 加入google统计
    function setGA() {
        (function(i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function() {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a = s.createElement(o), m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
        ga('create', 'UA-68588758-1', 'auto');
        ga('send', 'pageview');
    }

    function setGitfork() {
        $body.append($('<a class="github-fork" href="http://github.com/yooungt13"><img src="http://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png" alt="Fork me on GitHub" /></a>'));
    }

    function setBack2Top() {
        var $trigger = $('<div class="backToTop icon icon-up-big"></div>');
        $body.append($trigger);

        $window.on('scroll', debounce(function() {
            if ($body.scrollTop() > 0) {
                $trigger.css('display', 'block');
            } else {
                $trigger.css('display', 'none');
            }
        }, 250));

        $document.on('click', '.backToTop', function() {
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
            var ctx = this,
                args = arguments;
            clearTimeout(last);

            last = setTimeout(function() {
                action.apply(ctx, args);
            }, delay);
        };
    }

    // 加载所有data-com组件
    function setDataCom() {
        window.__setupCom = function(root) {
            var root = root || document.body;
            var doms = root.querySelectorAll("[data-com]");
            try {
                if (root.hasAttribute('data-com')) {
                    doms = Array.prototype.slice.call(doms);
                    doms.push(root);
                }
            } catch (e) {}
            if (doms.length) {
                var collections = [];
                var coms = [];
                for (var i = 0; i < doms.length; i++) {
                    var comNames = doms[i].attributes["data-com"].value.split('|');
                    for (var j = 0; j < comNames.length; j++) {
                        var comName = ("com/" + comNames[j] + ".js");
                        //防止二次执行
                        doms[i].coms = doms[i].coms || [];
                        if (doms[i].coms && doms[i].coms[comName]) {
                            continue;
                        }
                        doms[i].coms[comName] = "loading";
                        //找到模块构造函数与打包加载的对应关系
                        var index = coms.indexOf(comName);
                        if (index == -1) {
                            index = coms.length;
                            coms.push(comName);
                        }
                        collections.push({
                            name: comName,
                            dom: doms[i],
                            index: index
                        });
                    }
                }
                //加载所有所需模块，并且初始化这些模块
                require(coms, function() {
                    for (var i = 0; i < collections.length; i++) {
                        collections[i].dom.coms[collections[i].name] = new arguments[collections[i].index](collections[i].dom);
                    }
                });
            }
        }
        if ("require" in window) {
            __setupCom(document)
        }
    }

    return {
        init: init
    }
});