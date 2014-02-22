---
layout: default
title: How to new Blog();
---

{{page.title}}
========================
<p class="meta">23 Jan 2014 - Sysu, Guangzhou</p>
      
Which help me to build my blog.　[[Open]](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html)

Anyway, all u need is things below and their <strong style="color:#f00;">version</strong> is **IMPORTANT**.

"The best and most comfortable writing-space is Git + Github + Markdown + Jekyll, one said.

<br>
<strong style="color:#a6e22e;">Github Pages</strong>

Websites for you and your projects.
Hosted directly from your GitHub repository. Just edit, push, and your changes are live. 
<br>   
<strong style="color:#a6e22e;">Jekyll -1.4.2</strong>

Transform your plain text into static websites and blogs.
<br>   
<strong style="color:#a6e22e;">Markdown</strong> __Rdiscount -2.1.7__

Discount is an implementation of John Gruber's Markdown markup language in C. It implements all of the language described in the markdown syntax document and passes the Markdown 1.0 test suite. 
<br>   
<strong style="color:#a6e22e;">Pygments  -0.5.0</strong>　(In Python 2.7.3)

It is a generic syntax highlighter for general use in all kinds of software such as forum systems, wikis or other applications that need to prettify source code. 

Recommend <strong>[Monokai.css](https://github.com/richleland/pygments-css/blob/master/monokai.css)</strong> in Github.
    
    
<br>    
<strong style="color:#a6e22e;">Create Project</strong> and <strong style="color:#a6e22e;">Upload to Github</strong>
    
{% highlight python %}
$ makdir ~/hello-world    
$ cd ~/hello-world        
$ git init              
$ touch README
$ git add README                    
$ git commit -m "first commit"    
$ git remote add origin https://github.com/yooungt13/hello-world.git     
$ git push -u origin master     
{% endhighlight %}