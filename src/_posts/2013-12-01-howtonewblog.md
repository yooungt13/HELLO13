---
layout: post
title: How to new Blog();
addr: Sysu, Guangzhou
description: Thanks for comming and Please star and fork in Github if u like my blog.
keywords: 有田十三,javascript,web,github,blog
---

Which help me to build my blog.　[[Open]](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html)

Anyway, all u need is things below and their <strong style="color:#f00;">version</strong> is **IMPORTANT**.

> The best and most comfortable writing-space is Git + Github + Markdown + Jekyll

Github Pages
------------

Websites for you and your projects.
Hosted directly from your GitHub repository. Just edit, push, and your changes are live.


Jekyll -1.4.2
-------------

Transform your plain text into static websites and blogs.

> gem install jekyll

Markdown Rdiscount -2.1.7
-------------------------

Discount is an implementation of John Gruber's Markdown markup language in C. It implements all of the language described in the markdown syntax document and passes the Markdown 1.0 test suite.

> gem install rdiscount

Pygments  -0.5.0 (In Python 2.7.3)
----------------------------------

It is a generic syntax highlighter for general use in all kinds of software such as forum systems, wikis or other applications that need to prettify source code.

> gem install pygments.rb --version "=0.5.0"

Recommend [Monokai.css](https://github.com/richleland/pygments-css/blob/master/monokai.css)</strong> in Github.


Create Repo and Upload to Github
--------------------------------

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