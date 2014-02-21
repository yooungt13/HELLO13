---
layout: post
title: 深刻理解JavaScrip基于原型的面向对象 - 面向对象设计
tag: JS
---

<h2 style="background-color:#000;padding:5px;">一、饱受争议的Javascript</h2>

javascript本质上是基于原型的语言，但是却引入了基于类的语言的new关键字和constructor模式，导致javascript饱受争议。

javascript的作者Brendan在1994年研发这门语言的时候，C++语言是最流行的语言，java1.0即将发布，面向对象编程势不可挡，于是他认为，引入new关键字可以使习惯C++/java程序员更容易接受和使用javascript。

实际上，事实证明引入new是个错误的决定。

C++/java程序员看到new一个function的时候，他们会认为js通过function创建对象，function相当于类，接着他们会尝试在js挖掘类似java/C++面向类的编程特性，结果他们发现function没有extends，反而有个很奇怪的prototype对象，于是他们开始咒骂，js的面向对象太糟糕了。确实，new的引入让他们以为js的面向对象与java/C++类似，实际上并不是，如果不是以原型本质去理解js的面向对象，注定要遭受挫折，new，prototype，\_\_proto\_\_都是javascript实现原型的具体手段。

另一方面，理解原型的程序员，也表示不高兴，因为居然要使用new function的语法来间接实现原型继承，三行代码才做到最基本的原型继承,下面是实现对象newObject继承对象oldObject的代码。

>function F(){};  
F.prototype = oldObject;  
var newObject = new F(); 

这太繁琐了。基于原型语言理论上应该存在一个函数create(prototypeObject)，功能是基于原型对象产生新对象，例如，

>var newObject = create(oldObject);

看到这样的代码，人们就会自然很清晰地联想到，newObject是以oldObject模板构造出来的。

__JavaScript是世界上最容易被误解的语言，原因主要有两个:__

1)作为基于原型的语言中，却连最基本的一个通过原型产生对象的函数create(prototypeObject)也没有，让人不知道js根本上是以对象创建对象。应该添加该函数，现在Chrome和IE9的Object对象就有这个create函数。

2)使用 new func 形式创建对象，让人误会js是以类似java类的构造函数创建对象，实际上，构造函数根本上在创建对象上起到次要的作用，甚至不需要，重要的只有函数的属性prototype引用的原型对象，新对象以此为模板生成，生成之后才调用函数做初始化的操作，而初始化操作不是必要的。应该把废弃new 操作符，把 new func 分解为两步操作。

>var newObject = create(func.prototype);     
func.call(newObject);

这样程序员才好理解。如果想把这两个步骤合二为一，应该使用new以外的关键字。

到这里，我们务必要牢牢印入脑海的是，js的面向对象是基于原型的面向对象，对象创建的方式根本上只有一种，就是以原型对象为模板创建对象。
>newObject = create(oldObject);

new function不是通过函数创建对象，只是刻意模仿java的表象。

js在面向对象上遭遇的争议，完全是因为商业因素导致作者失去了自己的立场。就像现在什么产品都加个云一样，如果那时候不加个new关键字来标榜自己面向对象，产生"js其实类似c++/java"的烟幕，可能根本没有人去关注javascript。更令人啼笑皆非的是，原本称作LiveScript的javascript，因为 后期和SUN合作，并且为了沾上当时被SUN炒得火热的Java的光，发布的时候居然改名成Javascript。

<h2 style="background-color:#000;padding:5px;">二、从原型本质，站在语言设计者角度，理解constructor模式</h2>

假想我们是当时设计javascript继承机制的Brendan Eich，我们会怎么设计js的面向对象呢？
现在javascript开发到这样的阶段
1) 拥有基本类型，分支和循环，基本的数学运算,
2) 所有数据都是对象
3) 拥有类似C语言的function
4) 可以用var obj = {}语句生成一个空对象，然后使用obj.xxx或obj[xxx]设置对象属性
5) 没有继承，没有this关键字，没有new
我们任务是，实现javascript的面向对象，最好能达到类似java的创建对象和继承效果。更具体一点，我们要扩充js语言，实现类似下面的java代码。

{% highlight java %}
class Empolyee{  
    String name;  
    public Employee(String name){  
        this.name = name;  
    }  
    public getName(){  
        return this.name;  
    }  
}  
class Coder extends Employee {  
    String language;  
    public Coder(name,language){  
        super(name);  
        this.language = language;  
    }  
    public getLanguage(){  
        return this.language;  
    }  
}
{% endhighlight %}

__1 实现创建对象__

现有的对象都是基本类型，怎么创建用户自定义的对象呢？

解释：
>var i = 1;

这里的i是解释器帮忙封装的Number对象，虽然看起来跟C的int没区别，但实际上可以i.toString()。
    
java使用构造函数来产生对象，我们尝试把java的Empolyee的构造函数代码拷贝下来，看看可不可以模仿。
    
{% highlight javascript %}
function Empolyee(name){  
    this.name = name;  
}
{% endhighlight %}

我们只要生成一个空对象obj，再把函数里面的this换成obj，执行函数，就可以生成自定义对象啦！我们把Employee这样用来创建对象的函数称作构造函数。    
1) 首先我们用原生的方式为function添加方法call和apply，实现把把函数里面的this替换成obj。call,apply在Lisp语言中已经有实现，很好参考和实现。    
2) 然后实现生成实例         
    
{% highlight javascript %}
function Empolyee(name){  
    this.name = name;  
}  
var employee = {};  
Employee.call(employee,'Jack'); 
{% endhighlight %}

3) 到这里，以类似java方式产生对象基本完成了，但是这个employee对象没有方法。    
我们的function是第一类对象，可以运行时创建，可以当做变量赋值，所以没有问题。
    
{% highlight javascript %}
function Empolyee(name){  
    this.name = name;  
    this.getName = function(){return this.name};  
}  
{% endhighlight %}
