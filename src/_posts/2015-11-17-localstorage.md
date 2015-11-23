---
layout: post
title: Front-End Engineering：Cache Management Of Truckjs
tag: [LocalStorage,Truckjs,Engineering]
addr: Meituan, Beijing
description: Front-End Engineering：Cache Management Of Truckjs
keywords: localstorage,truckjs,engineering,有田十三
---

In modular programming, some modules may be requested more times which lead to extra costs. So the module should be stored after loaded first time to prevent repeate requests.

<!--more-->

## LocalStorage

The [localStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage) object stores the data with no expiration date. The data will not be deleted when the browser is closed, and will be available the next day, week, or year.

1. Apart from being an old way of saving data, Cookies give you a limit of 4096 bytes (4095, actually) - its per cookie. Local Storage is as big as 5MB per domain.
2. LocalStorage is an implementation of the Storage Interface. It stores data with no expiration date, and gets cleared only through JavaScript, or clearing the Browser Cache / Locally Stored Data - unlike cookie expiry.
3. Cookies will be carried in head of every http request from browser to server, but ls's data only stored in broswer.

### Using LocalStorage

Here's a graph,
![img](http://i.imgur.com/v9o1kNy.png?1)

When build the site, the version info, md5 will insert into `__requirejsConfig` and be stored in ls. If `revision[id]` in the page is diff compare to that in ls, it will sent request to load. Otherwise, load from ls directly.

{% highlight html linenos %}
<script>
var requirejs = {
    __require: [],
    __requirejsConfig: {
        revision: {
            "page.js": "f32af19d",
            "lib/fastclick.js": "6e9d3b0d",
            "lib/truck.js": "c4d5192a",
            "lib/zepto.js": "10c89684"
        },
        combo: {
            url: 'http://static.hello13.net/combo?f='
        },
        prefix: '/static/js/'
    }
}, require = function() {
    requirejs.__require.push(arguments)
};
</script>
{% endhighlight %}

{% highlight javascript linenos %}
var LS = {
    /*
     * @param isSupported 浏览器是否支持localStoarge
     * @return {Boolean} 条目数组
     */
    isSupported: (function() {
        try {
            if (!('localStorage' in window && window['localStorage'])) {
                return false
            }
            localStorage.setItem('~_~', 1);
            localStorage.removeItem('~_~');
        } catch (err) {
            return false;
        }
        return true;
    })(),
    /*
     * @method getItem 相对于原生的localStorage，屏蔽了错误
     * @param {String} key 需要查询的条目名称
     * @return {String} 条目数组
     */
    getItem: function(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {}
    },
    /*
     * @method setItem 相对于原生的localStorage，屏蔽了错误
     * @param {String} key 需要设置的条目名称
     * @param {val} 要设置的值
     */
    setItem: function(key, val) {
        try {
            localStorage.setItem(key, val);
        } catch (e) {}
    },
    /*
     * @method removeItem 删除一个条目
     * @param {String} key 需要删除的key
     */
    removeItem: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {}
    }
};
{% endhighlight %}
