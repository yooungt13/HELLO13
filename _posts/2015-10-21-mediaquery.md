---
layout: post
title: Using media queries in Sass
tag: [CSS, Sass]
addr: Meituan, Beijing
description: Media Query in Sass - CSS3
keywords: css,sass,response-to,mobile page,有田十三
---

Using media queries in `.pic-container` for responsive web design, I collect a set of mobile device media queries, sorted by its device-width. Then write abstracted media query systems using @content blocks in mixins.

<!--more-->

### Sets of device-width

| device  | device-width | device-pixel-ratio |
| :------ | :----------- | :----------------- |
| iphone4/5 | 320*480 | 2x |
| Sumsung Node2/3, S3/4, Nexus 5| 360\*640 360*567 | 2x/3x |
| iphone6 | 375*627 | 2x |
| Nexus 4 | 384*567 | 2x |
| Nexus 6 | 412*658 | 3.5x |
| iphone6-plus | 414*736 | 3x |



## Variables in queries

Divided into 4:

{% highlight sass linenos %}
/* device-min-width */
i$break-ip4: 320px;
$break-sumsung: 360px;
$break-ip6: 375px;
$break-ip6-plus: 412px;
{% endhighlight%}


## Variables in queries, using @content

{% highlight sass linenos %}
@mixin respond-to($media) {
    @if $media == ip4 {
        @media only screen and (min-device-width: $break-ip4) and (max-device-width: $break-sumsung - 1) { @content; }
    }
    @else if $media == sumsung {
        @media only screen and (min-device-width: $break-sumsung) and (max-device-width: $break-ip6 - 1) { @content; }
    }
    @else if $media == ip6 {
        @media only screen and (min-device-width: $break-ip6) and (max-device-width: $break-ip6-plus - 1) { @content; }
    }
    @else if $media == ip6-plus {
        @media only screen and (min-device-width: $break-ip6-plus) and (max-device-width: $break-huawei-p6 - 1) { @content; }
    }
}
{% endhighlight%}

## Using in sass

{% highlight sass linenos %}
.pic-container {
    /* respond-to($media) */
    @include respond-to(ip4) { /* stylesheet */ };
    @include respond-to(sumsung) { /* stylesheet */ };
    @include respond-to(ip6) { /* stylesheet */ };
    @include respond-to(ip6-plus) { /* stylesheet */ };
}
{% endhighlight%}
