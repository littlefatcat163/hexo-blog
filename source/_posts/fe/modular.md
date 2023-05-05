---
title: javascript模块化
excerpt: nodejs和浏览器 javascript modular, commonjs和commonjs2区别
categories: 
    - [front-end]
    - [back-end]
tags: 
    - develop
    - nodejs
    - javascript
index_img: /img/fe/modular.jpg
# banner_img: /img/hexo.webp
date: 2023-05-05 20:53:34
---
## js模块化写法

### 1. 原始写法
模块就是函数自己组成一个模块
```js
function m1() {...}
function m2() {...}
```
{% note danger %}
缺点：“污染”全局变量，无法保证变量名冲突，模块成员之间看不出直接关系。
{% endnote %}

### 2. 对象写法
模块所有成员在一个对象里面
```javascript
var module1 = {
    _count: 0,
    m1: function() {...},
    m2: function() {...}
}
```
{% note danger %}
缺点：暴露所有模块成员，内部成员可以被外部改写。
{% endnote %}

### 3. IIFE立即执行函数
__Immediately-Invoked Function Expression__ 可以达到不暴露私有成员的目的。
```js
var module1 = (function() {
    var _count = 0;
    var m1 = function() {...};
    var m2 = function() {...};
    return {
        m1: m1,
        m2: m2
    }
})()

// 无法读取内部_count
module1._count; // undefined
```

### 4. 放大模式
如果一个模块很大，必须分成几个部分，或者一个模块需要继承另一个模块。
```js
var module1 = (function(mod) {
    mod.m3 = function() {...};
    return mod;
})(module1)
```

### 5. 宽放大模式
在浏览器中，模块的各个部分通常都是从网上获取的，有有时无法知道哪个部分会先加载，第一个执行的部分可能加载一个不存在的对象。
```js
var module1 = (function(mod) {
    mod.m4 = function() {...};
    return mod;
})(window.module1 || {})
```

### 6. 输入全局变量
独立性是模块的重要特点，模块内部最好不与程序的其他部分直接交互。
为了在模块内部调用全局变量，必须显示地将其他变量输入模块。
```js
var module1 = (function($, YAHOO) {
    ...
})(jQuery, YAHOO);
```

## 模块化规范
> [requirejs用法](https://www.ruanyifeng.com/blog/2012/11/require_js.html)
### 1. CommonJS
node.js的模块系统，有一个全局的方法 `require()`，用于加载模块，然后就可以调用模块提供的方法。
```js
// math.js
function add(a, b) {
    return a + b;
}
module.exports = {
    add: add
}
```

```js
var math = require('math');
math.add(1,2);
```
{% note danger %}
CommonJS在服务端运行，因为所有模块都存在本地硬盘，可以同步加载完成，等待时间就是硬盘的读取时间。
__但是对于浏览器，这是个大问题，因为模块都在服务端，等待时间取决于网速，可能要等待很长时间，使浏览器js阻塞。__
{% endnote %}

### 2. AMD
__Asynchronous Module Definition__  异步模块，模块的加载不影响后面语句的执行。
所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成后，才执行该回调。
AMD也是采用`require()`，但是不同于CommonJS
```js
// math.js
define([], function() {
    return {
        add: function(a, b) {
            return a + b;
        }
    }
});
```
```js
require(['math'],  function(math) {
    math.add(2,3);
});
```

### 3. CMD
__Common Module Definition__ 在玉伯开发`SeaJS`的时候提出来的，`SeaJS`要解决的问题和`RequireJS`一样，不同与**AMD**的依赖前置，**CMD**是就近依赖。
```javascript
// AMD
require(['./utils', 'a', 'b'], function(utils) {
    // 还没用到 utils、a、b模块，但是AMD已经初始化了utils、a、b
    utils.add(1,2)
})

// CMD
define(function(require, expors, module) {
    if (false) {
        var utils = require('./utils') // 需要时再require，不执行就不加载
        utils.add(1,2)
    }
})
```

### 4. UMD
__Universal Module Definition__ 通用模块定义，如写了一个库，在服务端和浏览器同时用到，不用去同时维护CJS和AMD两套代码，UMD判断是哪个方式来定义模块，都不是直接挂载到全局。
```javascript
(function(root, factory){
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['utils'], factory)
    } else if (typeof exports === 'object') {
        // CommonJS
        var utils = require('utils');
        module.exports = factory(utils);
    } else {
        root.result = factory(root.utils);
    }
})(this, function(utils){
    utils.add(1,2)
})
```

### 5. ES模块化
ES2015自带模块化，__import__ __export__

```javascript
// utils.js
export const utils = {
    add: function(a, b) {
        return a + b;
    }
}

// main.js
import {utils} from './utils'
utils.add(1,2)
```

## 参考链接

- [webpack output.library commonjs和commonjs2区别](https://juejin.cn/post/7140619769853509640)