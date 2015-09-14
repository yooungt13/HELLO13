---
layout: post
title: Scroll Bar
tag: CSS
addr: Sysu, Guangzhou

---

webkit浏览器CSS设置滚动条
---------------

主要有下面7个属性

1. ::-webkit-scrollbar              滚动条整体部分，可以设置宽度
2. ::-webkit-scrollbar-button       滚动条两端的按钮
3. ::-webkit-scrollbar-track        外层轨道
4. ::-webkit-scrollbar-track-piece  内层滚动槽
5. ::-webkit-scrollbar-thumb        滚动的滑块
6. ::-webkit-scrollbar-corner       边角
7. ::-webkit-resizer                定义右下角拖动块的样式

具体所指如图例
![img](/public/images/scrollbarparts.png)


实例(本站scrollbar)：
{% highlight css %}
::-webkit-scrollbar-track-piece {
  background-color: #f4f4f4;
  -webkit-border-radius: 2px;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-thumb {
  height: 50px;
  background-color: #000;
  -webkit-border-radius: 2px;
  outline-offset: -2px;
}
{% endhighlight %}