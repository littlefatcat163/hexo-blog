---
title: 浏览器的渲染和阻塞
date: 2021-04-10 16:20:20
categories:
    - 前端
tags:
    - 浏览器

---

> bilbil 前端性能优化: https://www.bilibili.com/video/BV1ur4y1K76E?t=469&p=23

# 浏览器渲染引擎

渲染引擎主要包括：HTML解析器、CSS解析器、javascript引擎、布局(layout)模块、绘图(paint)模块

- HTML解析器：将HTML文本解析成DOM树。
- CSS解析器：为DOM的各个元素对象计算出样式信息，为布局提供基础设施。
- javascript引擎：解析javascript代码，通过javascript修改网页、css内容，从而改变渲染的结果。
- 布局(layout)模块：在DOM创建之后，浏览器内核需要将其中元素对象同样式信息结合起来，计算大小位置等布局信息，形成一个能表达所有信息的内部表示模型。
- 绘图(paint)模块：使用图形库将布局计算后的各个网页节点绘制成图像。

# 渲染过程

浏览器会从上到下解析文档

1. 遇见HTML标记，调用HTML解析器解析为对应的token（一个token就是一个标签文本的序列化）并构建DOM树（就是一块内存，保存着tokens，建立它们之间的关系）。
2. 遇见style/link标记调用相应解析器处理css标记，并构建出css样式树。
3. 遇见script标记调用javascript引擎处理script标记、绑定事件、修改DOM树、css树等。
4. 将DOM树与CSS树合并成一个渲染树。
5. 根据渲染树来渲染，以计算每个节点的几何信息（这一过程需要依赖GPU）。
6. 最终将各个节点绘制到屏幕上。

以上模块依赖很多其他基础模块，包括网络存储、图像、音频视频解码器等。

# 阻塞渲染

## css阻塞

	1. link引入的外部css才能够产生阻塞（推荐使用）：由css解析器进行解析，组设浏览器渲染（利用这种组设避免“闪屏现象”）。阻塞后面的`javascript`执行；不阻塞DOM的解析。*（可以使用服务器延时几秒才能加载到css来验证）*
 	2. style中的样式：由html解析器进行解析；不阻塞浏览器渲染（可能产生“闪屏现象”）；不阻塞DOM解析。

优化方案：尽可能快的提高外部css加载速度
    (1). 利用CDN节点进行外部资源加速；
    (2). 对css进行压缩；
    (3). 减少http请求数，将多个css文件合并；
    (4). 优化样式表代码

## javascript阻塞

	1. 阻塞后续DOM解析、页面渲染：浏览器不知道后续脚本对DOM作了什么操作，干脆停住，等待脚本执行完，再继续向下解析。
 	2. 阻塞后续javascript执行：维护依赖关系，如必须先引入jQuery，再引入bootstrap。

## css解析和js执行是互斥的

​	css解析的时候js停止执行，js执行的时候css停止解析

# 加载外部资源（图片、视频、样式、js等）

​	css与js阻塞，都不会阻塞浏览器加载外部资源，只要涉及网络请求的资源，浏览器始终先发送请求去获取资源，再协调加载到资源后的处理顺序，效率很高。

```html
<!-- 网页在加载和渲染过程中会触发DOMContentLoaded和onload事件 -->
<!-- DOMContentLoaded: DOM构建（html、js、css解析）完成之后，不等待img等外部资源的加载-->
<!-- onload: DOM构建完并且网页所依赖的资源都加载完之后-->
<script>
	widnow.addEventListener('DOMContentLoaded', function() {});
</script>
<script>
	window.onload = function() {};
</script>

<!-- html解析完，defer的js脚本执行完才触发 -->
<script defer></script>

<!-- html解析完，不等async的js脚本执行完，async加载的js不一定按照顺序执行，谁先加载完先执行谁 -->
<script async></script>
```

