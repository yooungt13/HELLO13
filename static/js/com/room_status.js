/*jshint curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, boss:true, es5:true, laxbreak:true, browser:true, devel:true, jquery:true, node:true */
/*global window document define*/
'use strict'
// 酒店房态信息组件
// @link: http://git.sankuai.com/projects/HOTEL/repos/hotel-fe-static/browse/public/touch/js/component/room_status.js
define(['page/hotel/room_status.js'], function(roomStatus) {
    return function (panel) {

        roomStatus.init({
            panel: panel
        });
    };
});