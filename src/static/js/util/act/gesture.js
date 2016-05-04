/*
 手势识别
 by gyx
 @param dom
 @param action
 action:
 v: 监听垂直
 h: 监听水平
 tap: 监听点击
 注意，改模块禁用了touchmove，并且在active(默认开启)状态下禁用了touchstart
 */
1;
define([
    'lib/zepto.js'
], function ($){
    var moveFlag;//0:still 1:horizontal 2:vertical -1:moved
    var startX;
    var startY;
    var vScrollable;
    var hScrollable;
    var scrollable;
    var offsetX;
    var offsetY;
    var touchTarget;
    var touching = false;
    var active = true;
    //FIXME: 检测touchdevice不正确
    if(document.ontouchmove !== undefined){
        document.documentElement.addEventListener('touchstart', start);
        document.documentElement.addEventListener('touchmove', move);
        document.documentElement.addEventListener('touchend', end);
    }else{
        document.documentElement.addEventListener('mousedown', start);
        document.documentElement.addEventListener('mousemove', move);
        document.documentElement.addEventListener('mouseup', end);
    }

    function start(e){
        if(active && (!touching || !document.ontouchmove)){
            if(e.touches){
                var target = e.touches[0];
            }else{
                var target = e;
            }
            touchTarget =target.target;
            startX = target.clientX;
            startY = target.clientY;
            moveFlag = 0;
            scrollable = null;
            //
            vScrollable = $(touchTarget).closest('.v_gesture_,._gesture_');
            hScrollable = $(touchTarget).closest('.h_gesture_,._gesture_');
            if(vScrollable) vScrollable = vScrollable.data('v_gesture_');
            if(hScrollable) hScrollable = hScrollable.data('h_gesture_');
            touching = true;
            //e.preventDefault();
        }
    }
    function move(e){
        if(!touching && !document.ontouchmove)
            return;
        if(e.touches){
            var target = e.touches[0];
        }else{
            var target = e;
        }
        var cx = target.clientX;
        var cy = target.clientY;
        offsetX = cx - startX;
        offsetY = cy - startY;
        //TODO: 使得检测阈值可配置
        if(moveFlag <= 0){
            if(hScrollable && Math.abs(cx - startX) > 0 && Math.abs(cy - startY)/Math.abs(cx - startX) < 3){
                if(hScrollable){
                    moveFlag = 1;
                    scrollable = hScrollable;
                    hScrollable.options.begin && hScrollable.options.begin.call(hScrollable.context, offsetX, offsetY, e);
                }else{
                    moveFlag = -1
                }
            }else if(vScrollable && Math.abs(cy - startY) > 5){
                if(vScrollable){
                    moveFlag = 2;
                    scrollable = vScrollable;
                    vScrollable.options.begin && vScrollable.options.begin.call(vScrollable.context, offsetX, offsetY, e);
                }else{
                    moveFlag = -1;
                }
            }
        }
        if(moveFlag > 0){
            scrollable.options.moving && scrollable.options.moving.call(scrollable.context, offsetX, offsetY, e, moveFlag);
        }
        if(scrollable){
            e.preventDefault();
        }
    }
    function end(e){
        if(moveFlag == 0){
            // 微信占用tap事件
            if($(e.target).closest('a').length != 0)
                return;
            var gdom =$(touchTarget).closest('.tap_gesture_');
            var gesture = gdom.data('tap_gesture_');
            if(gesture && gesture.options.tap){
                gesture.options.tap.call(gesture.context, e);
            }
        }else if(moveFlag > 0){
            scrollable.options.end && scrollable.options.end.call(scrollable.context, offsetX, offsetY, e);
        }
        touching = false;
    }
    var Gesture = function(dom, action, options){
        this.dom = dom;
        this.action = action || '';
        this.options = options || {};
        this.context = options.context;

        this.dom.addClass(this.action + '_gesture_');
        if(this.action == '' || this.action == 'v'){
            this.dom.data('v_gesture_', this);
        }else if(this.action == '' || this.action == 'h'){
            this.dom.data('h_gesture_', this);
        }else if(this.action == 'tap'){
            this.dom.data('tap_gesture_', this);
        }
    };
    Gesture.prototype = {
        active: function(value){
            if(value) {
                this.dom.addClass(this.action + '_gesture_');
            }else{
                this.dom.removeClass(this.action + '_gesture_');
            }
        },
        destory: function(){
            this.dom.removeClass(this.action + '_gesture_');
            if(this.action == '' || this.action == 'v'){
                this.dom.data('v_gesture_', undefined);
            }else if(this.action == '' || this.action == 'h'){
                this.dom.data('h_gesture_', undefined);
            }else if(this.action == 'tap'){
                this.dom.data('tap_gesture_', undefined);
            }
        },
        constructor: Gesture
    }
    Gesture.active = function(value){
        active = value;
    }
    return Gesture;
});
