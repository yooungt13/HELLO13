/*
 * 相册组件
 * @dom-attr data-com-pics 相册索要展示的大图列表，标准url数组用,分割
 * @dom-attr data-page 点击后打开的相册，值为页码，如果不存在则不打开相册，该属性可以存在于任一子节点
 * 行为： 点击含有data-page的元素打开相册，左右滑动切页，tap或者按后退关闭相册
 */
define(['lib/zepto.js', 'util/act/page.js', 'util/act/pageable.js', 'util/act/gesture.js'], function($, Page, Pageable, gesture) {
    function buildAlbum(picList) {
        var pThis=this;
        var pages = [];
        for (var i = 0; i < picList.length; i++) {
            var dom = $('<div class="page"><img class="eve-imgbox" data-pic-src="' + picList[i] + '"/></div>');
            this.albumContainer.append(dom);
            pages.push(new Page(dom));
        }
        var _this = this;
        this.pageable = new Pageable(pages, this.albumContainer, {
            end: function() {
                $('.cpage',pThis.albumContainer).html(_this.pageable._currentIndex+1);
            }
        });
        new gesture(this.albumContainer, 'tap', {
            tap: function () {
                history.back();
            }
        });
    }

    var Album = function (dom) {
        this.dom = $(dom);
        this.albumContainer = $('<div class="albumContainer"></div>');
        this.albumContainer.appendTo('body');
        //防止拖动
        this.albumContainer.on('touchstart', function (e) {
            e.preventDefault()
        });
        var picList = (this.dom.attr("data-pics") || "").split(',');
        var entryList = this.dom.find("[data-page]");
        if (this.dom.is("[data-page]")) {
            entryList = entryList.add(this.dom);
        }

        buildAlbum.call(this, picList);
        this.albumContainer.append('<div class="page-number-container"><span class="page-number"><span class="cpage">'+1+'</span>/'+picList.length+'</span></div>')
        var _this = this;
        entryList.click(function (e) {
            var current = $(e.currentTarget);
            // TODO:链接扩展方式不够友好
            if(current.attr('data-iswebview') == '1'){
                document.location.href = 'imeituan://www.meituan.com/album/poi?id=' + current.attr('data-poiid');
            }else{
                var entryPage = parseInt($(e.currentTarget).attr("data-page"));
                _this.show(entryPage);
            }
        });
    }
    Album.prototype.show = function (currentPage) {
        if (!currentPage) {
            currentPage = 0
        }
        this.pageable.goPage(currentPage);
        this.albumContainer.show();
        history.pushState({}, "查看相册");
        var _this = this;

        function onpopclose(e) {
            e.preventDefault();
            _this.hide();
            window.removeEventListener('popstate', onpopclose);
        }

        window.addEventListener('popstate', onpopclose);
    }
    Album.prototype.hide = function () {
        this.albumContainer.hide();
    }
    return Album;
});
