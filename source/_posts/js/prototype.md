---
title: 原型链
excerpt: javascript原型链
categories:
  - [front-end]
  - [back-end]
tags:
  - javascript
index_img: /img/js.webp
banner_img: /img/js.webp
date: 2023-05-07 10:35:33
---
> 参考文章
> - https://segmentfault.com/a/1190000021232132
> - https://segmentfault.com/a/1190000021787756
> - https://juejin.cn/post/6844903989088092174

## 概念
- 原型：js语言机制，对象的__proto__所指向的对象
- 原型对象：`prototype`- **构造函数`constructor`** 所指的对象
- 原型链：对象的`__proto__`逐级向上的链式路径

## 对象
js中除了基础数据 `string` `number` `boolean` `undefined` `symobol` `null` 之外，其他都是 **`Object` 对象**

## __proto__

对象有`__proto__`属性，可以使用 `Object.getPrototypeOf()`来获取`__proto__`指向的对象，如下图所示，所有的`__proto__`都指向了**原型对象`prototype`**，最终这些原型对象的`__proto__`都指向了 **`Object.prototype`原型对象**, 而`Object.prototype`的原型对象是`null`


![prototype](/img/js/prototype.jpg)

## constructor

只有原型对象有 `constructor` 构造函数，只要被 `new` 关键字调用的函数就可以成为构造函数

## 函数

只有函数才有 `prototype`

## 总结

- `__proto__`、`constructor` 对象拥有
- `prototype`函数独有
- js函数是对象的一种，所以函数也有 `__proto__`、`constructor`

![原型链](/img/js/proto.jpg)