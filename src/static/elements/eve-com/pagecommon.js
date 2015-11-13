/*global define,MT,_gaq*/
define(["core/count.js", 'util/cookie.js', 'core/i_extend.js', 'util/mjs.js','page/landingsession.js'], function(count, cookie, iExt, mjs,land) {
    'use strict';
    //修复touch的一个bug
    document.body.addEventListener('touchstart', function () {});
    // 添加到主屏幕的时候，将所有a连接改为js跳转，防止打开浏览器
    // 自动拼接stid
    var curnode, location=document.location, stop=/^(a|html)$/i, chref, qs=[], stid, ctpoi, cevent,extraInfo, backurl;
    document.addEventListener('click', function(e) {
        // 小米 android2.3 不支持 e.defaultprevented
        if((e.isDefaultPrevented && e.isDefaultPrevented()) || e.defaultPrevented) return;
        curnode=e.target;
        qs=[];
        while (!(stop).test(curnode.nodeName)) {
            curnode=curnode.parentNode;
        }
        // Condidions to do this only on links to your own app
        // if you want all links, use if('href' in curnode) instead.
        if(
            'href' in curnode && // is a link
                (chref=curnode.href) &&
                !/javascript:|tel:|mail:|sms:/.test(chref) &&
                chref.replace(location.href,'').indexOf('#') // is not an anchor
            ) {
            e.preventDefault();


            //首页品类入口链接优化 猜你喜欢 category 页全部分类 添加stid_b
            var stid_b = curnode.getAttribute('data-stid_b');
            stid = curnode.getAttribute('data-stid');

            stid_b && iExt.set('stid', {"ext":{"b":stid_b}});

            stid && iExt.set('stid', stid);

            stid = iExt.get('stid',true);

            stid && qs.push('stid=' + stid);

			//extraInfo里的所有信息，都直接拼接到url中
            extraInfo = curnode.getAttribute('extraInfo');
            if (extraInfo) {
                qs.push(extraInfo);
            }

            ctpoi = curnode.getAttribute('data-ctpoi');
            if (ctpoi) {
                iExt.set('ctPoi', ctpoi);
                qs.push('ct_poi=' + ctpoi);
            }

            cevent = curnode.getAttribute('gaevent');
            if (cevent) {
                qs.push("cevent=" + encodeURIComponent(cevent));
            }
            
            // 登陆按钮需要在跳转里增加给后端
            backurl = curnode.hasAttribute('data-backurl');
            if (backurl) {
                qs.push("backurl=" + encodeURIComponent(location.href));
            }

            qs = qs.join('&');

            if (!qs) {
                location.href = curnode.href;
            } else if(curnode.href.indexOf('#') === -1){
                /*jshint bitwise:false */
                location.href = ~curnode.href.indexOf('?') ? curnode.href + '&' +  qs: curnode.href + '?' + qs;
            } else {
                location.href = curnode.href;
            }
        }


    },false);

    //去掉url中的cevent
    if(location.href.indexOf('cevent') !== -1 && history.replaceState) {
        history.replaceState(history.state,document.title,location.href.replace(/&cevent=[^&]*(?=(&|$))/, ""));
    }
    //页面监控
    var _el = document.getElementById('meituan_check');
    if (!_el) {
        MT.log.send('incomplete', document.body.offsetHeight);
    } else if (_el.offsetTop < 100) {
        MT.log.send('pageheight', document.body.offsetHeight);
    } else if (_el.offsetHeight > 1) {
        MT.log.send('cdn', _el.offsetHeight);
    }
    if (window.top != window) {
        MT.log.send('ERROR', {type:"in-frame",url:location.href,referer: document.referrer || MT.HTTP_REFERER});
    }

    
    var iswebview = $('body').data('iswebview');


        //ga
        window._gaq = [];
        if(iswebview != true) {
            _gaq.push(['_setAccount', 'UA-43949337-1']);
        }

        _gaq.push(['_addOrganic', 'm.baidu', 'word']);
        _gaq.push(['_addOrganic', 'wap.baidu', 'word']);
        _gaq.push(['_addOrganic', 'baidu', 'word']);
        _gaq.push(['_addOrganic', 'Baidu', 'bs']);
        _gaq.push(['_addOrganic', 'www.soso', 'w']);
        _gaq.push(['_addOrganic', 'wap.soso', 'key']);
        _gaq.push(['_addOrganic', 'www.sogou', 'query']);
        _gaq.push(['_addOrganic', 'wap.sogou', 'keyword']);
        _gaq.push(['_addOrganic', 'm.sogou', 'keyword']);
        _gaq.push(['_addOrganic', 'so.com', 'q']);
        _gaq.push(['_addOrganic', 'so.com', 'pq']);
        _gaq.push(['_addOrganic', 'youdao', 'q']);
        _gaq.push(['_addOrganic', 'sm.cn', 'q']);
        _gaq.push(['_addOrganic', 'sm.cn', 'keyword']);
        _gaq.push(['_addOrganic', 'haosou', 'q']);
        _gaq.push(['_setDomainName', 'meituan.com']);
        _gaq.push(['_trackPageview']);
        setTimeout(function () {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = "async";
            ga.src = ('https:' === document.location.protocol ? 'https://ms0.meituan.com' : 'http://mc.meituan.net') + '/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
        }, 300);



    var landValue = land.init();
    iExt.set('landing',landValue);

    //干掉bfcache，让safari在前进和后退时不适用缓存的dom
    window.onunload=function(){};

    return function () {};
});
