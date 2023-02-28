---
title: 网页元素大小位置
date: 2022-01-22 10:22:15
categories:
    - js
tags:
    - 网页

---

> 原文地址：https://www.ruanyifeng.com/blog/2009/09/find_element_s_position_using_javascript.html

# 获取网页大小

​	{% image 网页大小.gif 示例图 %}

## clientWidth

​	网页每个元素都有 `clientHeight` 和 `clientWidth` 属性，这两个属性指元素内容部分加上 padding所占据的视觉面积，不包括 `border` 和 滚动条占用的空间

```javascript
function getViewport() {
    return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
    }
}
```

## scrollWidth

​	包含滚动条在内的该元素的视觉面积

```javascript
function getPageArea() {
    return {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight
    }
}
```

## 不用出现滚动条，容器尺寸足够

- 理论上 `clientWidth`和`scrollWidth`应该相等
- 实际上 不同浏览器处理方式不同，两个值未必相等，需要取其中较大的

```javascript
function getPageArea() {
    return {
        width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
        height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
    }
}
```

# 获取元素的绝对位置

​	{% image offset.gif 示例图 %}

每个元素都有`offsetTop`和`offsetLeft`属性，表示该元素的左上角与父容器左上角的距离，只要将两个值进行累加，就能得到该元素的绝对坐标

```javascript
function getElementXY(el) {
    let {offsetLeft: x, offsetTop: y, offsetParent: current} = el;
    while (current !== null) {
        x += current.offsetLeft;
        y += current.offsetTop;
        current = current.offsetParent;
    }
    return {x,y};
}
```

# 获取元素的相对位置

​	{% image relative.gif 示例图 %}

只需要将绝对坐标减去页面滚动距离

```javascript
function getElementXY(el) {
    let {offsetLeft: x, offsetTop: y, offsetParent: current} = el;
    while (current !== null) {
        x += current.offsetLeft;
        y += current.offsetTop;
        current = current.offsetParent;
    }
    x -= document.documentElement.scrollLeft;
    y -= document.documentElement.scrollTop;
    return {x,y};
}
```

# getBoundingClientRect快速获取位置

```javascript
const {left, right, top, bottom} = getBoundingClientRect();
```

