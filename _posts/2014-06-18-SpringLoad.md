---
layout: post
title: jQuery实现瀑布流加载图片
tag: JS
description: jQuery实现瀑布流加载图片
keywords: jQuery,spring,瀑布流,加载图片
---

1.批处理图片大小，需要PIL。    
输入宽度，高度自适应。

{% highlight python %}
# -*- coding:utf-8 -*- 

'''
Arion ,2012-09-06
必须安装PIL库

批量修改文件中的图片为格式及大小
'''

import os, glob
import Image

path = raw_input("path:")
width =int(raw_input("the width U want:"))
imgslist = glob.glob(path+'/*.*')
format = raw_input("format:")
def small_img():
    for imgs in imgslist:
        imgspath, ext = os.path.splitext(imgs)
        img = Image.open(imgs)
        (x,y) = img.size
        height =int( y * width /x)
        small_img =img.resize((width,height),Image.ANTIALIAS)
        small_img.save(imgspath +".thumbnail."+format)
    print "done"

if __name__ == '__main__':
    small_img()
{% endhighlight %}

2.批处理重命名图片。    

{% highlight python %}
#!\usr\bin\env python
# -*- coding: utf-8 -*-
# Author: PZX
# FileName: batchrename.py
# Function: 批量命名某一文件夹下的文件名

import sys
import os

def UsePrompt():
    #如果省略path，则path为当前路径
    print 'Useage: batchrename.py [path] newfilenames'
    sys.exit()

def BatchRename(path, pattern):
    #设置路径
    os.chdir(path)
    fileList = os.listdir("./")
    
    dotIndex = pattern.rfind('.')
    fileName = pattern[ : dotIndex]
    fileExt = pattern[dotIndex : ]
    genNum = 0
    for fileItem in fileList:
        fileFullName = fileName + ' (' + str(genNum) + ')' + fileExt
        os.rename(fileItem, fileFullName)
        print (fileItem + ' => ' + fileFullName) 
        genNum += 1

def main():
    if len(sys.argv) == 3:
        path = sys.argv[1]
        pattern = sys.argv[2]
    elif len(sys.argv) == 2:
        path = os.getcwd()
        pattern = sys.argv[1]
    else:
        UsePrompt()
    confirm = raw_input('Confirm(y|n): ')
    if confirm == 'n':
        sys.exit()
    BatchRename(path, pattern)
    
if __name__ == '__main__':
    main(){% endhighlight %}

