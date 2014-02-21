---
layout: post
title: 深刻理解JavaScrip基于原型的面向对象 - 原型链
tag: JS
---

<h2 style="background-color:#000;padding:5px;">一、基于原型的语言的特点</h2>

1 只有对象,没有类;对象继承对象,而不是类继承类。

2  “原型对象”是基于原型语言的核心概念。原型对象是新对象的模板，它将自身的属性共享给新对象。一个对象不但可以享有自己创建时和运行时定义的属性，而且可以享有原型对象的属性。

3 除了语言原生的顶级对象，每一个对象都有自己的原型对象，所有对象构成一个树状的层级系统。root节点的顶层对象是一个语言原生的对象，其他所有对象都直接或间接继承它的属性。

显然，基于原型的语言比基于类的语言简单得多，__我们只需要知道"用对象去创建对象"，就可以在原型的世界里大行其道了！__

<h2 style="background-color:#000;padding:5px;">二、基于原型的语言中对象的创建</h2>

创建有两个步骤:

1. 使用"原型对象"作为"模板"生成新对象
这个步骤是必要的，这是每个对象出生的唯一方式。以原型为模板创建对象，这也是"原型"(prototype)的原意。
2. 初始化内部属性
这一步骤不是必要的。通俗点说，就是，对"复制品"不满意，我们可以"再加工"，使之获得不同于"模板"的"个性"。

这两个步骤很自然，也很好理解，比使用类构造对象从概念上简单得多了。对于习惯了java基于类的面向对象的语言的程序员, 这种"新颖"的生成对象的方式一定会让他们感到好奇。

<h2 style="background-color:#000;padding:5px;">三、原型，为复用代码而生</h2>

使用原型，能复用代码，节省内存空间 

举个例子，存在旧对象oldObject，它有一个属性name，值是’Andy’, 和一个名为getName()的方法，如果以该对象为原型创建一个新对象。

>newObject = create(oldObject);

那么新对象newObject同样具有属性name，值也是’Andy’，也有一个方法getName()。值得注意的是，newObject并不是在内存中克隆了oldObject，它只是引用了oldObject的属性, 导致实际的效果好像"复制"了newObject一样。__类似于Java复制中的浅复制。__创建的对象newObject只有一个属性，这个属性的值是原型对象的地址(或者引用)，如下图所示。

![img](/public/images/copy.jpg)

当对象访问属性的时候，如果在内部找不到，那么会在原型对象中查找到属性；如果原型对象中仍然找不到属性，原型对象会查找自身的原型对象，如此循环下去，直至找到属性或者到达顶级对象。对象查找属性的过程所经过的对象构成一条链条，称之为原型链。__newObject,oldObject和topObject就构成一条原型链。__

下面列出newObject的3种的查找属性情况

newObject查找name <br>
1 内部找不到，到原型对象中查找<br>
2 oldObject中查找到了name，成功返回；

newObject查找toString <br>
1 内部找不到,到原型对象中查找<br>
2 oldObject中查找不到toString,到原型对象中查找<br>
3 topObject中查找到了toString，成功返回；

newObject查找valueOf
1 内部找不到,到原型对象中查找<br>
2 oldObject中查找不到valueOf,到原型对象中查找<br>
3 topObject中还是找不到，而且topObject是顶层对象，所以返回错误或者空值。

__对象会通过原型链动态地查找属性，对象的所拥有的属性并不是静态的。__如果原型链上的一个对象发生的改变，那么这个改变也会马上会反应到在原型链中处于该对象下方的所有对象。

<h2 style="background-color:#000;padding:5px;">四、继承</h2>

如果以oldObject为原型创建了newObject，那么可以说newObject继承了oldObject。
在Java中 通过语句
>class Cat extends Animal

定义Cat类继承Animal类，Cat类产生的实例对象便拥有了Animal类中定义的属性。<br>
类似地，在基于原型的语言中， 通过
>cat = create(animal);

创建以animal对象为模板的cat对象，cat对象便拥有了animal对象中的属性，因此可以说cat对象继承了anmial对象。 

<h2 style="background-color:#000;padding:5px;">五、小结</h2>

原型的本质就是对象引用原型对象的属性，实现代码复用。<br>
基于原型的语言是以原型对象为模板创建对象
>newObject = create(oldObject);

