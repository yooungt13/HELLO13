/*jshint curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, boss:true, es5:true, laxbreak:true, browser:true, devel:true, jquery:true, node:true */
/*global window document*/
'use strict';
/**
 * Created by StuPig on 11/20/14.
 */
define(['zepto.js', 'util/act/drum.js'], function($, drum) {
    return function (dom) {
        var $dom = $(dom),
            rootSelect = $dom.data('root') || dom,
            resultTarget = $dom.data('result-target'),
            panelCount = $dom.data('panel-count'),
            summaryTarget = $dom.data('summary-target');


        drum(dom, {
            panelCount: panelCount,
            resultTarget: resultTarget,
            summaryTarget: summaryTarget,
            onChange: function ($option) {
                var summary = $option.data('summary');

                if (summaryTarget) {
                    $dom.siblings(summaryTarget).text(summary);
                }

                $(rootSelect)
                    .find('select')
                    .each(function (i, el) {
                        var $select = $(el),
                            val = el.value,
                            resultTarget = $select.data('result-target'),
                            resultPattern = $select.data('result-pattern'),
                            result = '';

                        result = $select.find('option[value="' + val + '"]').text();

                        if (resultPattern) {
                            result = resultPattern.replace('$', result);
                        }

                        $(rootSelect).find(resultTarget).text(result);
                    });

            }
        });
    };
});