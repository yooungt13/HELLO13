/**
 * Created by chenboxiang on 15/5/22.
 */
define(["lib/zepto.js", "util/msg.js", "lib/iscroll.js"], function($, msg) {

    var markup = '<div class="com-date">\
            <div class="hd">\
                <div class="op-cancel">取消</div>\
                <div class="op-ok">完成</div>\
            </div>\
            <div class="bd">\
                <div class="bg-top"></div>\
                <div class="wrapper-date">\
                    <div id="com-date-wrapper-year" class="scroller-wrapper">\
                        <ul class="scroller scroller-year" id="com-date-scroller-year">\
                        </ul>\
                    </div>\
                    <div id="com-date-wrapper-month" class="scroller-wrapper">\
                        <ul class="scroller" id="com-date-scroller-month">\
                        </ul>\
                    </div>\
                    <div id="com-date-wrapper-day" class="scroller-wrapper">\
                        <ul class="scroller scroller-day" id="com-date-scroller-day">\
                        </ul>\
                    </div>\
                </div>\
                <div class="bg-bottom"></div>\
            </div>\
        </div>';

    var defaults = {
        minDate: new Date(1999, 0, 1),
        maxDate: new Date()
    }

    /**
     *
     * @param options
     *  options.maxDate {Date} 最大日期
     *  options.minDate {Date} 最小日期
     *  options.initDate {Date} 初始化日期
     *
     * @constructor
     */
    function DateSelect(options) {
        var self = this;
        this.options = $.extend({}, defaults, options);

        msg.diy(markup, {
            type: 'dateselect', closeOut: true, closeFun: function () {
                msg._el.animate({
                    translateY: "100%"
                }, 200, "ease-in");
                msg._el_bg.fadeOut(200);
                setTimeout(function () {
                    msg._el.remove();
                    msg._el_bg.remove();
                }, 300);
            }
        });
        this.initDateHtml();

        var yearScroll = new IScroll('#com-date-wrapper-year', {
            snap: true,
            hScroll: false,
            vScrollbar: false,
            bounce: false,
            bounceLock: true
        });
        var monthScroll = new IScroll('#com-date-wrapper-month', {
            snap: true,
            hScroll: false,
            vScrollbar: false,
            bounce: false,
            bounceLock: true
        });
        var dayScroll = new IScroll('#com-date-wrapper-day', {
            snap: true,
            hScroll: false,
            vScrollbar: false,
            bounce: false,
            bounceLock: true
        });
        var $yearLi = $("#com-date-wrapper-year li");
        var $monthLi = $("#com-date-wrapper-month li");
        var $dayLi = $("#com-date-wrapper-day li");
        var liHeight = $dayLi.eq(0).height();

        yearScroll.on("scrollEnd", function() {
            var date = getCurrentDate();
            adjustScroller(date);
        })
        monthScroll.on("scrollEnd", function() {
            var date = getCurrentDate();
            adjustScroller(date);
        })

        dayScroll.on("scrollEnd", function() {
            var date = getCurrentDate();
            adjustScroller(date);
        })

        // -- 初始化日期
        var initDate = this.options.initDate;
        if (initDate) {
            scrollToYear(initDate.getFullYear());
            scrollToMonth(initDate.getMonth() + 1);
            scrollToDay(initDate.getDate());
        }

        // -- 监听选择和取消操作
        msg._el.on("click", ".op-cancel", function() {
            msg.close();
        })

        msg._el.on("click", ".op-ok", function() {
            var date = getCurrentDate();
            if (self.options.onselect) {
                self.options.onselect(new Date(date.year, date.month - 1, date.day));
            }
            msg.close();
        })

        function getCurrentDate() {
            var date = {};
            date.year = $yearLi.eq(Math.abs(yearScroll.y) / liHeight).data("value");
            date.month = $monthLi.eq(Math.abs(monthScroll.y) / liHeight).data("value");
            date.day = $dayLi.eq(Math.abs(dayScroll.y) / liHeight).data("value");

            return date;
        }

        /**
         * 切换年月后要矫正日期，防止出现日期超过当月最大日期的情况
         * @param date
         */
        function adjustScroller(date) {
            var maxDate = self.options.maxDate;

            // -- disable掉超出的month和day
            $monthLi.removeClass("disabled");
            $dayLi.removeClass("disabled");
            if (maxDate.getFullYear() == date.year) {
                var maxMonth = maxDate.getMonth() + 1;
                $monthLi.each(function() {
                    var $this = $(this);
                    if ($this.data("value") > maxMonth) {
                        $this.addClass("disabled");
                    }
                })
            }

            var maxDay = getMaxDayOfMonth(date.year, date.month);
            if (maxDate.getFullYear() == date.year && maxDate.getMonth() + 1 == date.month) {
                maxDay = maxDate.getDate();
            }
            $dayLi.each(function() {
                var $this = $(this);
                if ($this.data("value") > maxDay) {
                    $this.addClass("disabled");
                }
            })

            // -- 判断月和日是否超过最大日期的月日，超过则矫正
            if (maxDate.getFullYear() == date.year) {
                maxMonth = maxDate.getMonth() + 1;
                if (date.month > maxMonth) {
                    monthScroll.scrollToElement($monthLi.eq(maxMonth - 1)[0]);
                    return;
                }
            }

            if (date.day > maxDay) {
                dayScroll.scrollToElement($dayLi.eq(maxDay - 1)[0]);
            }
        }

        function scrollToYear(year) {
            $yearLi.each(function() {
                var $this = $(this);
                if ($this.data("value") == year) {
                    yearScroll.scrollToElement(this);
                    return false;
                }
            })
        }

        function scrollToMonth(month) {
            $monthLi.each(function() {
                var $this = $(this);
                if ($this.data("value") == month) {
                    monthScroll.scrollToElement(this);
                    return false;
                }
            })
        }

        function scrollToDay(day) {
            $dayLi.each(function() {
                var $this = $(this);
                if ($this.data("value") == day) {
                    dayScroll.scrollToElement(this);
                    return false;
                }
            })
        }

    }

    /**
     * 根据起止日期
     */
    DateSelect.prototype.initDateHtml = function() {
        var minYear = this.options.minDate.getFullYear();
        var maxYear = this.options.maxDate.getFullYear();
        var minMonth = 1;
        var maxMonth = 12;
        var minDay = 1;
        var maxDay = 31;

        var html = "";
        var i;
        for (i = minYear; i < maxYear + 1; i++) {
            html += '<li class="item" data-value='+i+'>'+i+'年</li>';
        }
        var monthHtml = "";
        for (i = minMonth; i < maxMonth + 1; i++) {
            monthHtml += '<li class="item" data-value='+i+'>'+i+'月</li>';
        }
        var dayHtml = "";
        for (i = minDay; i < maxDay + 1; i++) {
            dayHtml += '<li class="item" data-value='+i+'>'+i+'日</li>';
        }

        $("#com-date-scroller-year").html(html);
        $("#com-date-scroller-month").html(monthHtml);
        $("#com-date-scroller-day").html(dayHtml);
    }

    function getMaxDayOfMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    return DateSelect;
})