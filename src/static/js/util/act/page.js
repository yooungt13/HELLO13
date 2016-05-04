define([], function () {
    var Page = function (dom) {
        this.dom = dom;
    }
    Page.prototype = {
        constructor: Page,
        resize: function () {
            this._cacheW = window.innerWidth;
            this._cacheH = window.innerHeight;
        },
        show: function () {
            //todo 在这里控制不太好
            this.dom.css('-webkit-transform', undefined);
            this.dom.removeClass('current').removeClass('prev').removeClass('next').addClass('current');
            this.prepare();
        },
        hide: function (state) {
            this.dom.removeClass('current').removeClass('prev').removeClass('next').removeClass('prev2').removeClass('next2');
            if (state == "full") {//视野外，可隐藏
                //this.dom.hide();
            } else if (state == 'next2' || state == "prev2") {//临近，需要准备
                this.dom.css("visibility","hidden");
                var _this = this;
                setTimeout(function () {
                    _this.dom.css('-webkit-transform', undefined);
                    _this.dom.addClass(state);
                    setTimeout(function(){
                        _this.dom.css("visibility", "");
                    }, 200);
                }, 200);
                this.dom.css('display', '')
            } else {//当前展示
                this.dom.addClass(state);
                this.prepare();
                this.dom.css('display', '')
                this.dom.css('-webkit-transform', undefined);
            }
        },
        prepare: function (time) {
            var _this = this;
            var imgDom = this.dom.find('img');
            if (imgDom.attr('src') == '') {
                imgDom.css('width', '100%').css('height', '5rem');
                var img = new Image();
                img.onload = function () {
                    imgDom.attr('src', imgDom.attr('data-pic-src')).css('width', null).css('height', null).css('max-width', '100%').css('max-height', '100%');
                    imgDom[0].onload = null;
                }
                img.src = imgDom.attr('data-pic-src');
            }
            setTimeout(function () {//排版延后，优先处理翻页动画
                //_this.dom.show(); wtf 。。moved
                if (_this._cacheW != window.innerWidth || _this._cacheH != window.innerHeight)
                    _this.resize();
            }, time || 200);
        },
        showing: function (offsetX, offset) {
            this.dom.css('-webkit-transform', 'translate3d(' + (offsetX) + 'px, 0, 0)');
        }
    }
    return Page;
});
