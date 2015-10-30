---
layout: post
title: Staying Sane With Asynchronous Programming：Promises and Generators
tag: [JS, Promise, Generator]
addr: Meituan, Beijing
description: Staying Sane With Asynchronous Programming：Promises and Generators
keywords: js,generator,es6,promise,有田十三
---

Callback Hell, also known as Pyramid of Doom, is an anti-pattern seen in code of programmers who are not wise in the ways of asynchronous programming.

<!--more-->

{% highlight javascript linenos %}
async1(function(){
    async2(function(){
        async3(function(){
            async4(function(){
                ....
            });
        });
    });
});
{% endhighlight%}

It consists of multiple nested callbacks which makes code hard to read and debug. It is understandable how one might unknowingly get caught in Callback Hell while dealing with asynchronous logic.

![img](/static/img/post/generator-1.gif)

## Promise

A little preview of how a promise-based approach solves the callback hell:

{% highlight javascript linenos %}
// Callback approach
async1(function(){
    async2(function(){
        async3(function(){
            ....
        });
    });
});

// Promise approach
var task1 = async1();
var task2 = task1.then(async2);
var task3 = task2.then(async3);

task3.catch(function(){
    // Solve your thrown errors from task1, task2, task3 here
})

// Promise approach with chaining
async1(function(){..})
    .then(async2)
    .then(async3)
    .catch(function(){
        // Solve your thrown errors here
    })
{% endhighlight%}

## Generators

Generators, like Promise, is also one of the features in ES6 that can manage asynchronous programming. The great thing about Generators is that it can work hand-in-hand with Promise to bring us closer to synchronous programming.

{% highlight javascript linenos %}
function * g() {
    console.log(.5);
    yield 1;
    console.log(1.5);
    yield 2;
    console.log(2.5);
}

var gn = g();
gn.next(); // 0.5 Object{ value: 1, done: false }
gn.next(); // 1.5 Object{ value: 2, done: false }
gn.next(); // 2.5 Object{ value: undefined, done: true }
{% endhighlight%}

It also could be `yield promise`.

### Run-to-completion

Javascript function are expected to run-to-completion - This means once the function starts running, it will run to the end of the function. However, Generators allow us to interrupt this execution and switch to other tasks before returning back to the last interrupted task.

The weird-looking function *() is to inform the Javascript interpreter that this is a special generator function type while yield is the cue to interrupt the function.

When the code enter the function, it will hit console.log('1') first. It then continues to the next line which hit the yield expression. This pauses the function and allow other code to run which in this case is console.log('2'). But once lowerCasePromise's Promise has resolved, the paused function resumes and it continue to the last line of the function, console.log(str).