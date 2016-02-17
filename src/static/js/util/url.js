/**
 * @date 2016-02-17
 * @author youngtian
 */
define([], function() {
    return {
        /**
         * 解析url,得到参数
         * @param  {String} query url,可为空
         * @return {Object}       参数对象
         */
        parse: function(query) {
            var params = {};

            // 默认query为location.search
            if (undefined === query) {
                query = location.search;
            };

            if( !query) return params;

            // 取？后的string
            if (query.indexOf('?') == 0) {
                query = query.substring(1);
            }

            var vars = query.split('&');
            vars.forEach(function(v) {
                var pair = v.split('=');
                params[pair[0]] = decodeURI(pair[1]);
            });

            return params;
        },
        /**
         * stringify参数
         * @param  {[type]} obj [description]
         * @return {[type]}     [description]
         */
        stringify: function(obj) {
            // body...
        }
    }
});