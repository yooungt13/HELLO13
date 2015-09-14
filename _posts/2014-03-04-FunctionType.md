---
layout: post
title: 深入理解Function类型
tag: JS
addr: Sysu, Guangzhou
description: 深入理解Function类型
keywords: function,类型,函数,有田十三
---
__1.函数是对象，函数名是指针__

　　函数实际上是对象，每个函数都是Function类型的实例，而且都与其他引用类型一样具有属性和方法。由于函数是对象，因此函数名实际上也是一个指向函数对象的指针，不会与某个函数绑定。

{% highlight javascript %}
function sum(num1, num2){
    return num1 + num2;
}
alert(sum(10,10)); //20

var anotherSum = sum;
alert(anotherSum(10,10)); //20

sum = null;
alert(anotherSum(10,10)); //20
{% endhighlight %}

以上代码定义了一个名为sum()函数，又声明了一个anotherSum与sum相等。当将sum设置为null时，因为不带括号是函数指针名不是调用函数，所以只是将函数指针设为null。anotherSum则可以继续调用函数。


<br>
__2.没有重载__

　　将函数名想象为指针，就可以理解为什么JavaScript中没有函数重载。
{% highlight javascript %}
function add(num){
    return num + 100;
}
function add(num){
    return num + 200;
}

var result = add(100); //300
{% endhighlight %}
以上代码声明了两个同名函数，而结构则是后面的函数覆盖了前面的函数，实际上覆盖了引用第一个函数的变量add。


<br>
__3.函数声明与函数表达式__

　　解释器在向执行环境中加载数据时，对函数声明和函数表达式并非一视同仁。解释器会率先读取函数声明，并使其执行任何代码之前可用；至于函数表达式，则必须等到解释器执行到它所在的代码行，才会真正被解释执行。
{% highlight javascript %}
alert(add(100));
function add(num){
    return num + 100;
}
{% endhighlight %}
以上代码完全可以正常运行。因为代码开始之前，解释器已经通过一个名为函数声明提升的过程，读取并将函数声明添加到执行环境中。如果把上面的函数声明改为函数表达式则会在执行期间导致错误。
{% highlight javascript %}
alert(add(100));
var add = function(num){
    return num + 100;
}
{% endhighlight %}
在执行期间会导致“unexpected identifier”(意外标识符)的错误。因为在调用时add并未声明。

<br>
__4.函数属性和方法__

　　每个函数都包含两个属性：length和prototype。其中length表示参数个数，而prototype则是JavaScript基于原型的面向对象中最重要的一个属性，它保存了类似于父类的对象的属性和方法。
每个函数也都包含两个非继承而来的方法：apply()和call()。这两个方法的用途都是在特定的作用域中调用函数，实际上等于设置函数体内this对象的值。

　　apply()方法接受两个参数：一个是在其中运行函数的作用域，另一个是参数数组。
{% highlight javascript %}
function sum(num1, num2){
    return num1 + num2;
}
function applySum(num1, num2){
    return sum.apply(this,arguments);
    // OR return add.apply(this, [num1,num2]);
}
alert(sum(10,10)); //20
alert(applySum(10,10)); //20
{% endhighlight %}

call()方法和apply()方法的作用相同，它们的区别仅在于接受参数的方式不通。对于call()方法，第一个参数与apply()方法一样，而其余参数都是直接传递给函数。换句话说，在使用call()方法时，传递给函数的参数必须逐个列举出来。
{% highlight javascript %}
function sum(num1, num2){
    return num1 + num2;
}
function callSum(num1, num2){
    return sum.call(this, num1, num2);
}
alert(callSum(10,10)); //20
{% endhighlight %}
至于使用apply()还是call()，完全取决于你采取哪种给函数传递参数的方式最方便。在不给函数传递参数的情况下，两个方法都一样。

　　事实上，传递参数并非apply()和call()真正的用武之地；__它们真正强大的地方是能够扩充函数赖以运行的作用域。__
{% highlight javascript %}
window.color = "red";
var o = { color: "blue" };

function sayColor(){
    alert(this.color);
}

sayColor(); //red
sayColor.call(this); //red
sayColor.call(window); //red
sayColor.call(o); //blue
{% endhighlight %}
　　使用call()或者apply()来扩充作用域最大的好处，就是对象不需要与方法有任何耦合关系。当不需要参数情况下，也可以通过bind()来扩充作用域。