---
layout: post
title: AddressSearch Component
tag: JS
addr: Meituan, Beijing
description: AddressSearch Component
keywords: address search,geolocation,amap,高德,有田十三
---

When implementing designated driver of apollo, i do add a component of address search with [AMAP](http://lbs.amap.com/api/javascript-api/summary-3/) for other business requirements.
<!--more-->

Dependencies
------------

* [Truck.js](http://www.slideshare.net/meituantech/truck-js-web)(Module Loader)
* [Zepto.js](http://zeptojs.com/)
* [Amap](http://lbs.amap.com/api/javascript-api/summary-3/)

Usage
-----

First, you should get A key from Amap for developers, and add a script into page file.
> http://webapi.amap.com/maps?v=1.3&key=YOURKEY

Then, you can use addressSearch after using addressSearch.js

{% highlight javascript linenos %}
define([
	'zepto.js',
	'addressSearch.js'], function($, addr) {
		addr.init($('#J-place'), {
			// cityName
		    city: '北京',
		    // whether use auto geolocate
		    useAutoGeoLocate: true,
		    // choose use amap or browser native
		    useAmapGeoLocate: true,
		    // callback list
		    onResultClick: _getDriverList,
		    onGeolactionComplete: _getDriverList,
		    onGeolactionError: _handleLoadingStatus
		});
	}
);
{% endhighlight %}




Feature
-------
![img](/static/img/address.png)

The link: [click here](http://192.168.128.63:3000/apollo/product/drive?showType=driverDetail&cateId=5)
<!--more-->
