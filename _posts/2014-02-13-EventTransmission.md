---
layout: post
title: 事件传播机制
tag: JS
---

　　Javascript事件传播机制有两种：冒泡和捕获，区别在于事件被触发后传播的先后顺序。<br>
　　所谓的先后顺序是指针对父标签与其嵌套子标签,如果父标签与嵌套子标签均有相同的事件时,哪一个会先被触发。<br>

{% highlight html %}
<div>  
    <span>  
        <a href=""></a>  
    </span>   
</div>  
{% endhighlight %}

　　举例来说，如果单击了页面中的超链接（锚元素），那么div、span和a全都应该得到响应这次单击的机会。因为这三个元素毕竟都是在用户的鼠标指针之下啊。那么，最终响应的效果是什么样的呢？<br>
　　在事件捕获的过程中，事件首先会交给最外层的元素，接着再交给更具体的元素。<br>
　　在事件冒泡中，当事件发生时，会首先发送给最具体的元素，在这个元素获得响应机会之后，事件会向上冒泡至更一般的元素。<br><br>
　　__jQuery为了提供跨浏览器的一致性，它始终会在冒泡阶段注册事件处理程序。因此，我们总可以假定最具体的元素会首先获得响应事件的机会。__<br><br>
　　“事件冒泡”可能会导致我们预想不到的事情发生，比如，错误的元素响应mouseover或mouseout事件的情况下。<br>

{% highlight javascript %}
$(document).ready(function(){  
    $("a").mouseout(function(){  
        alert("Out of a");  
    });  
    $("span").mouseout(function(){  
        alert("Out of span");  
    });  
    $("div").mouseout(function(){  
        alert("Out of div");  
    });  
}); 
{% endhighlight %}

　　你会发现，当你的鼠标从a、span、div标签上面出来的时候在最后都会alert，说明事件一次从内向外冒泡。<br>
　　不过.hover()方法能够聪明地处理这些冒泡问题(指mouseout(),mouseover()这两个方法导致的冒泡问题),当我们使用该方法添加事件时，可以不必考虑由于错误的元素取得mouseout或mouseover事件而导致的问题。这就使得.hover()成为绑定个别鼠标事件的一种有吸引力的替代方案。<br><br>

那么我们怎么阻止事件冒泡呢？	
---------------------------
　　其实导致这个问题的根本原因就是冒泡，把本应该在正确元素上面发生的事件又传递给外层DOM，让外层DOM也去响应这个事件。
所以我们应该访问“事件对象”。<br>
　　事件对象是一种JS结构，它会在元素获得处理事件的机会时被传递给相应的事件处理程序。这个对象中包含着与事件有关的信息(例如事件发生时的鼠标指针位置)，也提供了可以用来影响事件在DOM中传递进程的一些方法。<br>
　　为了在处理程序中使用事件对象，需要为函数添加一个参数：event

{% highlight javascript %}
$(document).ready(function(){  
    $("a").mouseout(function(event){  
        alert("Out of a");  
    });   
}); 
{% endhighlight %}

　　事件处理程序中的变量event保存着事件对象，而event.target属性保存着发生事件的目标元素(也就是真正应该对事件做出响应的DOM元素)。<br>
{% highlight javascript %}
$(document).ready(function(){  
    $("a").mouseout(function(event){  
        if(event.target == this)
        	alert("Out of a");  
    });   
}); 
{% endhighlight %}
　　这样就能保证鼠标移出a标签的时候只alert而不会把这个事件(mouseout)传递到外层DOM标签中去。<br><br>

　　事件对象还提供一个.stopPropagation()方法，可以完全阻止事件冒泡。与.target类似，这个方法也是一种纯JS特性，但是在跨浏览器环境中则无法安全的使用(即在IE中停止冒泡应该使用事件对象的cancelBubble属性设置为false)，不过通过jQuery来注册所有的事件处理程序，就可以放心地使用这个方法。
{% highlight javascript %}
$(document).ready(function(){  
    $("a").mouseout(function(event){  
        alert("Out of a");  
        event.stopPropagation();  
    });   
}); 
{% endhighlight %}