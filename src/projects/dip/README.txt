1.First you must ensure that your browser could support HTML5.
2.The browser could be FireFox/Chrome.

It's best to perform in FireFox.
If you wanna to run in Chrome,then need to read below.

There needs a little operation to run in Chrome.
Because of the security strategy,it couldn't allow to operate local images in the HTMLs.
So, we need to load Chrome by a param to allow the operations.

What we need to do is just to create a new shortcut of Chrome to desktop, 
and append a param(copy without quotation: '--allow-file-access-from-files') to its target,
of cause there is also a space between target and param.

Finally, you can run project in Chrome if you need.


简而言之，就是创建一个Chrome的快捷方式。
在属性中目标后加一个参数(--allow-file-access-from-files)。
关闭已打开的浏览器，启动这个快捷方式加载Project/index.html。