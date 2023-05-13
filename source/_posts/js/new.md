---
title: new
excerpt: function constructor
categories:
  - [front-end]
  - [back-end]
tags:
  - javascript
index_img: /img/js.webp
banner_img: /img/js.webp
date: 2023-05-13 19:08:17
---
## 对象
面向对象编程（Object Oriented Programming，缩写为 OOP）是目前主流的编程范式。它将真实世界各种复杂的关系，抽象为一个个对象，然后由对象之间的分工与合作，完成对真实世界的模拟。

## constructor 构造函数
{% note warning %}
`JavaScript` `constructor` 就是个普通的函数，独特的地方是
- 函数内部使用 `this` 关键字，代表了要生成的对象实例。
- 调用的时候，必须使用 `new` 。
- 为了和普通函数区分，`constructor` 构造函数的名字首字母大写。
{% endnote %}
```js
var Vehicle = function () {
  this.price = 1000;
};

var v = new Vehicle();
v.price // 1000
```

## 调用constructor必须用new
{% note danger %}
这里没用使用`new`去调用，那么`this`将指向了全局，如window
```js
var Vehicle = function () {
  this.price = 1000;
};

var v = Vehicle();
v // undefined
price // 1000
```
{% endnote %}

{% note success %}
为了保证constructor必须与new一起使用，下面提供几个解决方法。
{% endnote %}

### 1. 严格模式
使用严格模式，不允许this指向全局对象，函数内部 `this` = `undefined`
```js
function Fubar(foo, bar){
  'use strict';
  this._foo = foo;
  this._bar = bar;
}

Fubar() // 调用的时候必须用 new Fubar()
// TypeError: Cannot set property '_foo' of undefined
```

### 2. constructor加入判断处理
构造函数内部判断是否使用new命令，如果发现没有使用，则直接返回一个实例对象。
```js
function Fubar(foo, bar) {
  if (!(this instanceof Fubar)) {
    return new Fubar(foo, bar);
  }

  this._foo = foo;
  this._bar = bar;
}

Fubar(1, 2)._foo // 1
(new Fubar(1, 2))._foo // 1
```

### 3. new.target
{% note warning %}
函数内部可以使用`new.target`属性。如果当前函数是`new`命令调用，`new.target`指向当前函数，否则为`undefined`。
{% endnote %}
```js
function f() {
  console.log(new.target === f);
  if (!new.target) {
    throw new Error('请使用 new 命令调用！');
  }
  // ...
}

f() // false Uncaught Error: 请使用 new 命令调用！
new f() // true
```

## new 原理
![prototype](/img/js/prototype.jpg)
{% note success %}
1. 创建一个空对象，作为将要返回的对象实例。
2. 将这个空对象的原型，指向构造函数的prototype属性。
3. 将这个空对象赋值给函数内部的this关键字。
4. 开始执行构造函数内部的代码。
{% endnote %}

构造函数内部，this指的是一个新生成的空对象，所有针对this的操作，都会发生在这个空对象上。构造函数之所以叫“构造函数”，就是说这个函数的目的，就是操作一个空对象（即this对象）。

{% note danger %}
构造函数内部有`return`语句，而且`return`后面跟着一个非空对象，`new`命令会返回`return`语句指定的对象；否则，就会忽略`return`，返回this对象。
{% endnote %}
```js
var Vehicle = function () {
  this.price = 1000;
  // return null
  // return undefined
  // 只要return不是对象，或者是空，都将被忽略
  return 1000;
};

(new Vehicle()) === 1000 // false

var Vehicle2 = function () {
  this.price = 1000;
  return {
    price: 2000
  }
};
new Vehicle2().price; // 2000
```

## 参考链接
- [https://wangdoc.com/javascript/oop/new](https://wangdoc.com/javascript/oop/new)
- [原型链](/blog/2023/05/07/js/prototype/)