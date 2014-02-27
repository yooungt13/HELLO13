---
layout: post
title: Css Normal Problem
tag: CSS
---

1. DIV Centering
---------------
{% highlight css %}
.father {
    margin: 0 auto;
}
.child {
    float: left;      /* 元素浮动方向     */
    display: inline;  /* 作为内联元素显示 */
}
{% endhighlight%}    

2. Background Opacity
---------------
{% highlight css %}
.back {
	background-color: rgba(0,0,0,0.6);
}
{% endhighlight%}    

3. Z-index
---------------
{% highlight css %}
.tag {
	position: relative;  /* 如果z-index失效,确保position为relative */
	z-index: 1000;
}
{% endhighlight%}    

4. Vertical Centering about MsgBox
---------------
{% highlight javascript %}
getTop: function(height) {
    return (document.body.offsetHeight - height) / 2 + document.body.scrollTop ;
}
{% endhighlight%}