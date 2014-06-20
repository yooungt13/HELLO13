---
layout: post
title: jQuery实现瀑布流加载图片
tag: JS
description: jQuery实现瀑布流加载图片
keywords: jQuery,spring,瀑布流,加载图片
---

获取当前documents的scrollTop为docTop，浏览器窗口高度为winHeight以及container高度为contentHeight。通过scroll事件触发判断机制，若docTop + winHeight >= contentHeight，则对每一列加载图片。    


{% highlight html %}
<div class="albums" id="albums">
    <div class="col" id="col1"></div>
    <div class="col" id="col2"></div>
    <div class="col" id="col3"></div>
    <div class="col" id="col4"></div>
    <div class="col" id="col5"></div>
</div>
{% endhighlight %}

{% highlight javascript %}
$(function(){
    var winHeight = $(window).height(),
        picno = 0;

    $(function() {
        loadImg();

        $(window).scroll(function() {
            var docTop = $(document).scrollTop(),
                contentHeight = $('#albums').height();
            if (docTop + winHeight >= contentHeight) {
                loadImg();
            }
        });
    });

    function loadImg() {
        for (var i = 1; i <= 5; i++) {
            if (picno < 40) {
                $('#col' + i).append('<div><img src="./data/thumb/' + picno + '.jpg"alt=""></div>');
                picno++;
            }
        }
    }
});
{% endhighlight %}

