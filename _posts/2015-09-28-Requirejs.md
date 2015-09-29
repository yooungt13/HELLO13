---
layout: post
title: Requirejs Practicing
tag: [JS, Requirejs]
addr: Meituan, Beijing
description: Requirejs Practicing
keywords: js,requirejs,zepto,有田十三
---

There's a requirement to rebulid the front end pages of [website](http://party178.com/). For better organization, i choosed [jekyll](http://jekyllrb.com/docs/home/) to be a generator, the same as my site.

<!--more-->

Which module loader can be used, [seajs](http://seajs.org/docs/) or [requirejs](http://www.requirejs.org/)? Because of the same standard(AMD) with truckjs of MEITUAN and better realizing, i prefer to use requirejs.

Dependencies
-------------

* [jekyll](http://jekyllrb.com/docs/home/)
* [requirejs](http://www.requirejs.org/)
* [zeptojs](http://zeptojs.com/)

The first think to do is to install jekyll.

> gem install jekyll

Now you can start the server of jekyll.

> jekyll server


Usage
-----

To take full advantage of the optimization tool, it is suggested that you keep all inline script out of the HTML, and only reference require.js with a requirejs call like so to load your script:

{% highlight html linenos %}
<!DOCTYPE html>
<html>
    <head>
        <!-- data-main attribute tells require.js to load
             scripts/main.js after require.js loads. -->
        <script data-main="scripts/main" src="scripts/require.js"></script>
    </head>
    <body></body>
</html>
{% endhighlight%}

Inside of page.js, you can use requirejs() to load any other scripts you need to run. This ensures a single entry point, since the data-main script you specify is loaded asynchronously.

{% highlight javascript linenos %}
require(['zepto'], function($) {
    //This function is called when zepto is loaded.
});
{% endhighlight%}

__shim:__ Configure the dependencies, exports, and custom initialization for older, traditional "browser globals" scripts that do not use define() to declare the dependencies and set a module value.

{% highlight javascript linenos %}
require.config({
    baseUrl: '/static/js',
    paths: {
        zepto: 'lib/zepto',
    },
    shim: {
        zepto: { exports: '$' }
    }
});
{% endhighlight%}

__NOTICE:__ paths' value without '.js' !!!



