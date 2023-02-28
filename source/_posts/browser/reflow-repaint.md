---
title: 图层与重绘重排
date: 2021-04-10 17:01:54
categories:
    - 前端
tags:
    - 浏览器


---

> [bilbil前端性能优化](https://www.bilibili.com/video/BV1ur4y1K76E?t=469&p=23)
>
> [阮一峰网页性能管理](https://www.ruanyifeng.com/blog/2015/09/web-page-performance-in-depth.html)

# css图层

​	浏览器在渲染一个页面时，会将每个页面分成很多个图层，每个图层有一个或多个节点

## 浏览器渲染流程

1. 使用html解析器将html页面转换成浏览器识别的DOM树 `ParseHTML`
2. 对每个图层的节点计算样式结果（Recalculate style样式重计算）
3. 为每个节点生成图形和位置（Layout布局——重排、回流）
4. 将每个节点绘制填充到图层位图中（Paint重绘）
5. GPU 图层一个个绘制
6. 组合多个图层到页面上生成最终屏幕图像（Composite Layers图层重组）

## 图层创建的条件

	1. 具有3D变化的css属性
	2. 使用视频`<video>`节点
	3. `<canvas>`节点*（如果设别没有独立显卡，chrome将不会有图层产生）*
	4. css3动画节点
	5. 拥有css加速属性`will-change`，如`div { will-change: transform; }`告诉浏览器div节点将会执行transform的变换

*查看图层，chrome中打开Layers就可以预览，如下图：*

{% image 浏览器查看图层.png %}

# Repaint 重绘

​	元素外观的改变触发的浏览器行为，如字体颜色，背景色等属性，浏览器会根据元素的新属性重新绘制，使新元素呈现先的外观。**（重绘不会带来重新布局，所以并不一定会重排）**

​	重绘重排都是以图层为单位的，如果图层中某个元素需要重绘，那么整个图层都需要重绘。所以为了提高性能，要让这些“变化的节点”拥有一个独立的图层**（css动画的节点会自动创建图层）**

# Reflow 回流、布局、重排

​	渲染对象在创建完成并添加到渲染树时，并不包含位置和大小信息。计算这些值的过程称为**布局、重排、回流**

​	重绘不一定需要重排，比如只改变某个元素的颜色，布局没变，只需重绘；重排大多数情况下会导致重绘，比如改变一个元素的位置，将会同时出发重排和重绘，因为布局改变了。

​	重排的成本比重绘高很多，一个节点的重排很有可能导致子节点，甚至父节点、同级别节点的重排，在手机设备上，这个过程是非常痛苦和耗电的。

# 触发重排的操作

​	增加、删除、修改DOM节点，移动DOM的位置，修改CSS样式，resize窗口，修改网页默认字体，获取某些属性（width、height）。

​	`display:none`会触发reflow，而`visibility:hidden`只会触发repaint。

# 重排和重绘

是在浏览器主线程执行的，比较消耗性能

# 优化方案

1. 元素位置移动变换时，尽量使用css3的transform来代替top、left操作。
2. 使用opacity代替visibility，使用visibility不触发重排，但是依然会重绘；直接使用opacity既触发重绘，又触发重排（GPU底层设计是这样的）；opacity配合图层使用，既不触发重绘，也不触发重排。
3. 不使用table布局。
4. 将多次改变样式属性的操作合并成一次，如预先定义好class。然后修改DOM的className。
5. 将DOM离线后再修改，由于display属性none的元素不在渲染树中，对隐藏的元素操作不会引发其他元素的重排。如果要对一个元素进行复杂的操作时，可以先隐藏它，操作完再显示，这样只在隐藏和显示时出发2次重排。
6. 利用文档碎片（documentFragment），vue使用了该方式提升性能。
7. 不要把某些DOM节点的属性值放在一个循环当成循环的变量，缓存该变量值。
8. 动画实现过程中，启用GPU硬件加速`transform: tranlateZ(0)`。
9. 为动画元素新建图层，提高动画元素的z-index。
10. 编写动画时，尽量使用`requestAnimationFrame()`, `cancelAnimationFrame()`以取消回调函数。

