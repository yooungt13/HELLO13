---
layout: post
title: HTML5+JavaScript实现Flappy Bird
tag: JS
addr: Sysu, Guangzhou

---

游戏截图
![img](/static/img/fb.png)


有关实现说明已发CSDN：[传送门](http://blog.csdn.net/yooungt13/article/details/19555471)
游戏体验移步Project区：[传送门](http://hello13.net/projects/bird/index.html)



<br>
__总结:__

1.　由于Chrome采用异步加载Image方式，当网络速度缓慢时会导致Image尚未加载时已经执行绘制函数，图像未绘制成功。解决该问题可以将绘制函数作为Image.onload的回调函数，当Image加载完毕再绘制。但与此同时带来的问题是，绘制图像的顺序由Image加载速度决定，可能会产生在表层的图像在绘制后被下层图像覆盖。

2.　原作除了画面精致外，数值设计游戏走红的原因。游戏难度可以通过参数修改，但要达到难度适中却非常不容易。

3.　游戏应该尽量遵循物理原理，简单的模拟只是开发游戏的第一步。