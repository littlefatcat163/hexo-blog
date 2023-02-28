---
title: 移动端单位选择
date: 2021-05-06 09:29:07
categories:
    - 前端
tags:
    - css
---

> 参考文章：
> https://zhuanlan.zhihu.com/p/44599960

# 像素

* `物理像素(physical pixel)`：也称为设备像素。
* `设备独立像素(density-independent pixel)`：也称为密度无光像素，可以认为是计算机坐标系中的一个点，这个点代表一个由程序使用的虚拟像素（如css像素），然后由相关系统转换为物理像素。
* `css像素(device-independent pixel)`：抽象的单位，用于浏览器上精确度量web的元素，简称DIPS。
* `屏幕密度`：设备表面上存在的像素数量，每英寸有多少个像素来计算，简称PPI。
* `设备像素比(dedvice pixel ratio)`：定义了物理像素和设备独立像素的对应关系，简称DPR —— （设备像素比 = 物理像素 / 设备独立像素），在js中，可以通过`window.devicePixelRatio`获取当前设备的dpr；在css中可以通过`-webkit-device-pixel-ratio`，`-webkit-min-device-pixel-ratio`和`-webkit-max-device-pixel-ratio`进行媒体查询。
* `位图像素`：1个位图像素对应一个物理像素，单对于dpr=2的高清（retina）屏幕来说，一个位图像素对应4个物理像素，由于单个位图像素不可以再进一步分割，只能就近取色，从而导致图片模糊，对于图片的高清问题，就是提供两倍图(@2x)，如`200*300`的`img`，需要提供`400*600`的图片，具体如下图所示
  {% image dips.jpg %} {% image 位图.jpg %}

# 视窗viewport

​	viewport严格等于浏览器的窗口，在pc的浏览器中，viewport就是浏览器窗口的大小，在移动端的viewport太窄，为了能更好的为css布局服务，提供了两个viewport：虚拟的visual viewport 和布局的layout viewport。具体查看https://www.w3cplus.com/css/viewports.html

## 视窗缩放

​	在移动端页面，设置meta定义缩放

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximun-scale=1">

<!-- 告诉移动浏览器使用真实的页面比例，不允许缩放user-scalable=no -->
<meta name="viewport" content="initial-scale=1.0, user-scalable=no">

<!-- 告诉移动浏览按照设备宽度device-width渲染网页内容 -->
<meta name="viewport" content="width=device-width">

<!-- 允许用户将页面放大到设备宽度的三倍，最小可以缩小到设备宽度的一半 -->
<meta name="viewport" content="width=device-width, maximum-scale=3, minimum-scale=0.5">
```

## 视窗单位

- vw：1vw等于视窗宽度的1%

- vh：1vh等于视窗高度的1%

- vmin：vw和vh中的最小值

- vmax：vw和vh中的最大值

  *IOS8和android4.4以上获得支持*

vw是相对单位，所有需要适配屏幕大小等比所发的元素使用vw作为单位，不需要缩放的元素使用px单位；
`计算方式`：设计师交付的设计稿高度是750px，其中有个图标元素的尺寸是32px，换算为vw是`( 32 / 750 ) * 100% = 4.27%`，不管任何屏幕，该图标始终为`4.27vw`。

# rem单位

​	设置html元素的font-size，rem根据html的font-size来适配尺寸

# 适配方案对比

## viewport缩放

​	适配原理简单，直接使用设计稿标注的单位尺寸，不用换算，需要使用js根据当前dpr控制viewport的缩放比例，方案死板之恩给你实现页面级别整体缩放。

## 动态rem

​	适配原理复杂，需要使用js根据dpr适配html的font-size和viewport缩放比例，设计稿px换算成rem，同时能实现整体缩放和局部不缩放

## vw

​	适配简单，不需要js控制，换算px到css

