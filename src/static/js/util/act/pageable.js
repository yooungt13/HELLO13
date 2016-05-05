/*
 实现翻页功能
 by gyx
 */
define([
    'util/act/gesture.js',
    'util/act/page.js',
    'lib/zepto.js'
], function(Gesture, Page, $) {

    var emptyPage = new Page($('<div></div>'));
    //翻页完成，判断翻页方向并完成剩余翻页
    function end(offsetX, offsetY) {
        var prev = this.prev(), next = this.next(), current = this.current();
        //TODO:阈值做成可调节
        if (next != emptyPage && offsetX < -this.hold) {
            this.nextPage();
        } else if (prev != emptyPage && offsetX > this.hold) {
            this.prevPage();
        } else {
            current.show('current');
            prev.hide('prev');
            next.hide('next');
            this.prev(2).hide('prev2');
            this.next(2).hide('next2');
        }
    }

    //用于检测从上拉到下拉的情况
    var lastOffset;
    var everNext = false;

    function moving(offsetX, offsetY) {
        /*
         //翻页方式 上下
         if(offsetY < 0){
         this.current().showing(offsetY);
         if(lastOffset * offsetY <= 0 && this.prev()){
         this.prev().hide('prev');
         }
         }else if(offsetY > 0 && this.prev()){
         this.prev().showing(offsetY - window.innerHeight);
         }
         lastOffset = offsetY;

         //滚动翻页方式 上下
         this.prev() && this.prev().showing(offsetY - window.innerHeight - 20);
         this.current().showing(offsetY);
         this.next() && this.next().showing(offsetY + window.innerHeight + 20);
         */
        //滚动翻页方式 左右
        this.prev().showing(offsetX - this.containerWidth * 1.05, offsetX);
        this.current().showing(offsetX, offsetX);
        this.next().showing(offsetX + this.containerWidth * 1.05, offsetX);
        this.prev(2).showing(offsetX - this.containerWidth * 2.1, offsetX);
        this.next(2).showing(offsetX + this.containerWidth * 2.1, offsetX);
    }

    //TODO: 增加方向和页面联动选项
    function Pageable(pages, container, options) {
        this.options = options || {};
        this.hold = options.hold || 20;
        this.pages = pages;
        this._currentIndex = this.options.startIndex || 0;
        var _this = this;
        this.containerWidth = container[0].clientWidth || window.innerWidth;
        this.gesture = new Gesture(container, 'h', {
            begin: function (offsetX, offsetY) {
                options.begin && options.begin();
                Pageable.root.removeClass('automove');
                lastOffset = 0;
            },
            moving: function (offsetX, offsetY) {
                moving.call(_this, offsetX, offsetY);
            },
            end: function (offsetX, offsetY) {
                Pageable.root.addClass('automove');
                end.call(_this, offsetX, offsetY);
                options.end && options.end();
            }
        });
    }

    Pageable.root = $('body')
    Pageable.root.addClass('automove');
    Pageable.prototype = {
        moving: moving,
        end: end,
        next: function (count) {
            var dest = this._currentIndex + (count || 1);
            if(this.options.cycle){
                dest = (dest + this.pages.length) % this.pages.length;
            }
            return this.pages[dest] || emptyPage;
        },
        current: function () {
            return this.pages[this._currentIndex] || emptyPage;
        },
        prev: function (count) {
            var dest = this._currentIndex - (count || 1);
            if(this.options.cycle){
                dest = (dest + this.pages.length) % this.pages.length;
            }
            return this.pages[dest] || emptyPage;
        },
        nextPage: function () {
            this.goPage(this._currentIndex + 1);
            this.options.changed && this.options.changed(this._currentIndex);
        },
        prevPage: function () {
            this.goPage(this._currentIndex - 1);
            this.options.changed && this.options.changed(this._currentIndex);
        },
        goPage: function (index) {
            this._currentIndex = index;
            if (this.options.cycle) {
                this._currentIndex = (this._currentIndex + this.pages.length) % this.pages.length;
            }
            for(var i = 0; i < this.pages.length; i++){
                this.pages[i].dom[0].style.display = "none"
            }
            this.current().hide("current");
            this.next().hide("next");
            this.prev().hide("prev");
            this.next(2).hide("next2");
            this.prev(2).hide("prev2");
        },
        destory: function () {
            this.options = null;
            this.pages = null;
            this.gesture.destory();
            this.gesture = null;
        },
        active: function (value) {
            this.gesture.active(value);
            if (value) {
                this.pages[this._currentIndex].show();
            }
        },
        constructor: Pageable
    }
    return Pageable;
});
