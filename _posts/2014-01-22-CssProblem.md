---
layout: post
title: Css Snippets
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

5. GetStyle
---------------
由于js只能修改html内部的css样式代码，获得CssDeclaration中样式的方法如下。
{% highlight javascript %}
function getStyle(o,key) { //'currentStyle' only for ie5.0+
    return o.currentStyle ?
        o.currentStyle[key] :
        document.defaultView.getComputedStyle(o,null)[key];
}
{% endhighlight%}

5. IMG Vertical Centering
---------------
{% highlight html %}
<div style="display:table-cell;vertical-align:middle;">
    <img style="">
</div>
{% endhighlight%}

6. Better Helvetica
---------------
{% highlight css %}
body {
   font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
   font-weight: 300;
}
{% endhighlight%}