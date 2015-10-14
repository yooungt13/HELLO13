---
layout: post
title: Object-fit and Object-position
tag: [CSS]
addr: Meituan, Beijing
description: Object-fit Object-position
keywords: js,css,css3,object-fit,object-position,有田十三
---

In the responsive design, image processing adaptive is everyone's problem.I found the same problem at work, images of our users' avatar aren't square so that I must be make sure these images fill the container adaptivly.

<!--more-->

The avatar is not a square:
![img](/static/img/post/objectfit-1.png)

{% highlight css linenos %}
img {
	width: 1rem;
	height: 1rem;
}
{% endhighlight%}

Syntax
------

{% highlight css linenos %}
/* Keyword values */
object-fit: fill;
object-fit: contain;
object-fit: cover;
object-fit: none;
object-fit: scale-down;

/* Global values */
object-fit: inherit;
object-fit: initial;
object-fit: unset;
{% endhighlight%}

Syntax
------

> fill | contain | cover | none | scale-down

{% highlight css linenos %}
img {
	width: 1rem;
	height: 1rem;
	object-fit: cover;
}
{% endhighlight%}