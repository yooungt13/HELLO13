/*
 * stepper 数值调整组件
 * @attr input[max] 最大值
 * @attr input[min] 最小值
 * @attr data-step 使用+，-时数值调整的数量
 */
define(["zepto.js"], function($) {
    return function (dom) {
        var $input = $(dom).find('input');
        var $add = $(dom).find('.plus');
        var $minus = $(dom).find('.minus');
        var step = $(dom).attr('data-step') || 1;
        var max = parseFloat($input.attr('max')) || 0;
        var min = parseFloat($input.attr('min')) || 0;
        $add.click(function () {
            var val = parseFloat($input.val()) + step;
            if (max != 0 && val > max) {
                val = max;
            }
            $input.val(val).trigger('change');
        });
        $minus.click(function () {
            var val = parseFloat($input.val()) - step;
            if (val < min) {
                val = min;
            }
            $input.val(val).trigger('change');
        });
        $input.on("change", change);
        change();
        //数值改变时调用，设置+，-的可用性
        function change() {
            var val = $input.val();
            if (val <= min) {
                $input.val(min);
                $minus.attr("disabled", "disabled");
            } else {
                $minus.removeAttr("disabled");
            }
            if (max != 0 && val >= max) {
                $input.val(max);
                $add.attr("disabled", "disabled");
            } else {
                $add.removeAttr("disabled");
            }
        }
    }
});