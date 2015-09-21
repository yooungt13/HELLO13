/*
 * 画廊组件
 * @dom-attr data-com-pics 相册索要展示的大图列表，标准url数组用,分割
 */
1;
define(['zepto.js', 'util/act/page.js', 'util/act/pageable.js', 'util/act/gesture.js'], function ($, Page, Pageable, gesture) {
    var Album = function(dom) {
        var dom = $(dom).addClass('gallery');
        var picList = dom.attr("data-pics") ? dom.attr("data-pics").split(',') : [];
        var dir = "hor";
        if (dom.hasClass('ver')) {
            dir = "ver";
        }
        var pager = dom.attr('gallery-pager')
        var pages = [];
        var pagedoms = dom.find('.page');
        for (var i = 0; i < pagedoms.length; i++) {
            pages.push(new Page($(pagedoms[i]), {dir: dir}));
        }
        for (var i = 0; i < picList.length; i++) {
            var page = $('<div class="page"><img class="imgbox" data-pic-src="' + picList[i] + '"/></div>');
            dom.append(dom);
            pages.push(new Page(page));
        }
        if (pager == 'dot') {
            var ul = '<ul class="list-ico list">';
            for (var i = 0; i < pages.length; i++) {
                if (i == 0) {
                    ul += '<li class="active">'
                } else {
                    ul += "<li>"
                }
            }
            ul += "</ul>";
            dom.append(ul);
        } else if (pager == 'marker') {
            var downmarker = $('<span class="marker markerdown"><span class="arrow"></span></span>');
            dom.append(downmarker);
        }
        var pageable = new Pageable(pages, dom, {
            dir: dir,
            changed: function (index) {
                $($('.list-ico li').removeClass('active')[index]).addClass('active');
                $($('.list-text li').removeClass('active')[index]).addClass('active');
                if (index == pages.length -1) {
                    $('.markerdown').hide()
                } else {
                    $('.markerdown').show()
                }
            }
        });

        pageable.goPage(0);
    }
    return Album;
});