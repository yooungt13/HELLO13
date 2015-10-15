---
layout: post
title: Object-fit - CSS3
tag: [CSS]
addr: Meituan, Beijing
description: Object-fit - CSS3
keywords: js,css,css3,object-fit,object-position,有田十三
---

In the responsive design, image processing adaptive is everyone's problem.I found the same problem at work, images of our users' avatar aren't square so that I must be make sure these images fill the container adaptivly.

<!--more-->

The avatar is not a square, <br>
![img](/static/img/post/objectfit-1.png)

but it shouled be a square.
{% highlight css linenos %}
img {
	width: 1rem;
	height: 1rem;
}
{% endhighlight%}

Imagine that the image hava distorted. <br>
![img](/static/img/post/objectfit-3.png)

## Object-fit

The object-fit CSS property specifies how the contents of a replaced element should be fitted to the box established by its used height and width.

### Syntax

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

### Formal syntax

> fill | contain | cover | none | scale-down

### Value

| Option  | Description |
| :------ | :---------- |
| fill    | The replaced content is sized to fill the element’s content box: the object’s concrete object size is the element’s used width and height. |
| contain | The replaced content is sized to maintain its aspect ratio while fitting within the element’s content box: its concrete object size is resolved as a contain constraint against the element’s used width and height. |
| cover   | The replaced content is sized to maintain its aspect ratio while filling the element’s entire content box: its concrete object size is resolved as a cover constraint against the element’s used width and height. |
| none    | The replaced content is not resized to fit inside the element’s content box: the object’s concrete object size is determined using the default sizing algorithm with no specified size, and a default object size equal to the replaced element’s used width and height. |
| scale-down | The content is sized as if none or contain were specified, whichever would result in a smaller concrete object size. |

## Usage

{% highlight css linenos %}
img {
	width: 1rem;
	height: 1rem;
	object-fit: cover;
}
{% endhighlight%}

After using `object-fit: cover;`, amazing happened: <br>
![img](/static/img/post/objectfit-5.png)

### MDN
* [object-fit](https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit)
* [object-position](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position)
