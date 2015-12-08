---
layout: post
title: Front-End Engineering：Cache Management
tag: [LocalStorage,Truckjs,Engineering]
addr: Meituan, Beijing
description: Front-End Engineering：Cache Management
keywords: localstorage,truckjs,engineering,有田十三
---

In modular programming, some modules may create unnecessary HTTP requests and wasted JavaScript execution if it is not cached. So the modules should be stored after loaded at first time.

<!--more-->

## LocalStorage

The [localStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage) object stores the data with no expiration date. The data will not be deleted when the browser is closed, and will be available the next day, week, or year.

1. Apart from being an old way of saving data, Cookies give you a limit of 4096 bytes (4095, actually) - its per cookie. Local Storage is as big as 5MB per domain.
2. LocalStorage is an implementation of the Storage Interface. It stores data with no expiration date, and gets cleared only through JavaScript, or clearing the Browser Cache / Locally Stored Data - unlike cookie expiry.
3. Cookies will be carried in head of every http request from browser to server, but ls's data only stored in broswer.

#### Using LocalStorage

Here's a graph of cache flow,
![img](/static/img/post/ls-0.png)

When build the site, the revision and md5 will insert into `__requirejsConfig` and be stored in ls after loaded. If `revision[id]` in the page is diff compare to that in ls, it will sent request to load. Otherwise, load from ls directly.

Codes of template like this,
{% highlight html linenos %}
<script>
    var requirejs = {
        __require: [],
        __requirejsConfig: {
        { % if site.DEV % }
            baseUrl: 'http://localhost:4000',
        { % else % }
            revision: { % include revision.json % },
            combo: {
                url: '{ { site.STATIC_HOST } }/combo?f='
            },
        { % endif % }
            prefix: '/static/js/'
        }
    }, require = function() {
        requirejs.__require.push(arguments)
    };
</script>
{% endhighlight %}

And codes of the built page like this,
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

#### Network Loading

After the first visit, codes will be stored in the ls and could be found from the ls next time. `LS`(util of truckjs) will compare the version between that of ls and the revision of page, then decide wheather need to send a request to get new codes from server.
![img](/static/img/post/ls-2.png)
![img](/static/img/post/ls-1.png)

Which comes to high rate of cache hitting and saves the bind width without extra requests in conclusion.
![img](/static/img/post/ls-3.png)


