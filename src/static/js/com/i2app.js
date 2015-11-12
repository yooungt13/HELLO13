/*jshint curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, boss:true, es5:true, laxbreak:true, browser:true, devel:true, jquery:true, node:true */
/*global window document*/
'use strict';
/**
 * Created by StuPig on 8/15/14.
 */
/**
 * 处理逻辑：
 *  1. .i2app的<a />为需处理的元素
 *  2. 先根据所处位置（pos）判断对应的MGE事件和imeituan链接
 *
 */
define([], function() {
    // 查找 .i2app 的class，这个.i2app应该是直接写在<a />上的
    var I_HOST = 'i.meituan.com',
        IMEITUAN_ORIGIN = 'imeituan://www.meituan.com',
        STAT = {
            banner: 'ibanner',
            footer: 'ift',
            index_float_layer: 'ibdownindex',
            deal_float_layer: 'ibdowndeal',
            poi_float_layer: 'ibdownpoi',
            mingdian: 'imingdian',
            deal_point: 'idealpoint',
            deal_promot: 'idealpromote',
			merchant_point:'ipoipromote',//商家详情页
			daren_rule:'iDaren_rule',//达人规则说明页
			daren_comment:'iDaren_comment'//达人个人评价主页
        },
        iframe;

    /**
     * 尝试调起客户端
     * @param elI2App {DOM}
     */
    function try2InvokeClient(elI2App) {
        var href = elI2App.getAttribute('href') || (elI2App.dataset ? elI2App.dataset.href : elI2App.getAttribute('data-href')),
            pos = elI2App.dataset ? elI2App.dataset.pos : elI2App.getAttribute('data-pos'),
            param = elI2App.dataset ? (elI2App.dataset.param && JSON.parse(elI2App.dataset.param))
                : (elI2App.getAttribute('data-param') && JSON.parse( elI2App.getAttribute('data-param') )),
            source  = elI2App.getAttribute('data-source'),
            stid = elI2App.getAttribute('data-stid'),
            cevent = elI2App.getAttribute('gaevent'),
            url;
        url = generateImeituanUrl(pos, param, stid,source);
        stid = (param && param.stid) || false;

        if (url) {
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.src = url;
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
            } else {
                iframe.src = url;
            }
            setTimeout(function () {
                href = addParam(href, 'cevent', cevent);
                href = addParam(href, 'stid', stid);
                location.href = href;
            }, 500);

        } else {
            href = addParam(href, 'stid', stid);
            location.href = href;

        }
    }

    /**
     * 非覆盖方式的parameter添加
     * @param url
     * @param paramName
     * @param paramValue
     * @returns {*}
     */
    function addParam(url, paramName, paramValue) {
        if (!~url.indexOf(paramName) && paramValue) {
            return url += ~url.indexOf('?') ? '&' + paramName + '=' + paramValue : '?' + paramName + '=' + paramValue;
        } else {
            return url;
        }
    }

    /**
     * 生成imeituan的schema链接
     * @param pos {String}
     * @param param [JSONString]
     * @param param [String]
     * @param source [String]:来源统计，优先于pos
     * @returns {string}
     */
    function generateImeituanUrl(pos, param, stid,source) {
        // 详情页正则验证
        var dealRegexp = /\/deal\/(\d+)\.html$/,
            indexRegexp = /^\/$/,
            poiRegexp = /\/(?:poi|shop)\/(\d+)(?:\.html)?$/,
            ret = '';

        switch (pos) {
            case 'banner':
                // 验证是否是团购客户端
                if (~location.href.indexOf(I_HOST)) {
                    ret = IMEITUAN_ORIGIN ;
                }
                break;
            case 'footer':
                ret = IMEITUAN_ORIGIN ;
                break;
            case 'float_layer':
                if (indexRegexp.test(location.pathname)) {
                    pos = 'index_' + pos;
                    ret = IMEITUAN_ORIGIN ;
                } else if (dealRegexp.test(location.pathname)) {
                    pos = 'deal_' + pos;
                    ret = IMEITUAN_ORIGIN + '/deal?did=' + location.pathname.match(dealRegexp)[1] ;
                } else if (poiRegexp.test(location.pathname)) {
                    pos = 'poi_' + pos;
                    ret = IMEITUAN_ORIGIN + '/merchant?id=' + location.pathname.match(poiRegexp)[1] ;
                }
                break;
            case 'deal_point':
            case 'deal_promot':
                ret = IMEITUAN_ORIGIN + '/deal?did=' + location.pathname.match(dealRegexp)[1] ;
                break;
            case 'mingdian':
                ret = IMEITUAN_ORIGIN + '/todayspecial/list?id=' + param.id ;
                break;
			case 'merchant_point':
				var arr = location.pathname.match(/\/poi\/(\d+)/);
				if(arr && arr[1]){
					ret	= IMEITUAN_ORIGIN + '/merchant?id=' + arr[1] ;
				}
				break;
			case 'deal_list'://团购列表
				ret = IMEITUAN_ORIGIN + '/deal/list?group_category_id='+param['group_category_id']
						+'&category_id='+param['category_id']
						+'&category_name='+param['category_name']
						+'&sort='+param['sort'];
				break;
			case 'comment_page'://个人评价主页
				ret = IMEITUAN_ORIGIN+'/userreview?uid='+param['uid'];
				break;
            default :
                break;
        }
		if(~ret.indexOf("?")){
			ret= ret+"&";
		}else{
			ret= ret+"/";
		}
		ret+="lch="+STAT[source||pos];
        if (stid) {
            ret += '&stid=' + stid;
        }
        return ret;
    }


    return function (dom) {
        // 微信的话不尝试
        if (~window.navigator.userAgent.indexOf('MicroMessenger')) return false;

        dom.addEventListener('click', function (e) {
            e.preventDefault();
            try2InvokeClient(dom);
        }, true);
    };
});
