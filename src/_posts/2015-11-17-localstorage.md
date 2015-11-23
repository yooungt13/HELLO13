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

![img](http://i.imgur.com/v9o1kNy.png?1)
