---
title: use strict
excerpt: javascript严格模式
categories:
  - [front-end]
  - [back-end]
tags:
  - javascript
index_img: /img/js.webp
banner_img: /img/js.webp
date: 2023-05-13 16:38:04
---
## 严格模式
严格模式 是ES5引入标准的，主要目的有：明确禁止不合理的语法如[变量提升](/blog/2023/05/06/js/var-lift#1-变量提升)，增加更多报错的场合，提高编译效率，增加运行速度，保证代码运行的安全，可控。

## 使用方式
js引擎发现 `use strict`，后面的js将开启严格模式，`use strict`放在js文件的第一行。
```html
<script>
  'use strict';
  console.log('这是严格模式');
</script>
```
```js
// 函数以严格模式运行
function strict() {
  'use strict';
  return '这是严格模式';
}
```
{% note  warning %}
多个js怎么合并在一起，并使用严格模式？使用IIFE包一层，在里面声明严格模式。
{% endnote %}
```js
(function() {
  'use strict';
  // ...
})()
```

## 显示报错

### 只读属性不可写
```js
'use strict';
'abc'.length = 5;
// TypeError: Cannot assign to read only property 'length' of string 'abc'

Object.defineProperty({}, 'a', {
  value: 37,
  writable: false
});
obj.a = 123;
// TypeError: Cannot assign to read only property 'a' of object #<Object>

var obj = {
  get v() { return 1; }
};
obj.v = 2;
// Uncaught TypeError: Cannot set property v of #<Object> which has only a getter

// 删除不可配置属性报错
var obj = Object.defineProperty({}, 'p', {
  value: 1,
  configurable: false
});
delete obj.p
// TypeError: Cannot delete property 'p' of #<Object>

// 禁止扩展对象
var obj = {};
Object.preventExtensions(obj);
obj.v = 1;
// Uncaught TypeError: Cannot add property v, object is not extensible
```

### 增强代码安全
```js
'use strict';
function f() {
  x = 123;
}
f() // 报错，未声明就创建一个全局变量


// 没有使用new，函数内部this表示undefined
function F() {
  'use strict';
  this.a = 1;
};
F(); // 报错，this 未定义
```

### 禁止使用fn.callee、fn.caller
函数内部不得使用`fn.caller`、`fn.arguments`，否则会报错。这意味着不能在函数内部得到调用栈了。
```js
function f1() {
  'use strict';
  f1.caller;    // 报错
  f1.arguments; // 报错
}

f1();
```

### 禁止使用 arguments.callee、arguments.caller
`arguments.callee`和`arguments.caller`是两个历史遗留的变量，从来没有标准化过，现在已经取消了。正常模式下调用它们没有什么作用，但是不会报错。严格模式明确规定，函数内部使用`arguments.callee`、`arguments.caller`将会报错。
```js
'use strict';
var f = function () {
  return arguments.callee;
};

f(); // 报错
```

## 参考链接
- [mdn strict mode](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)
- [use strict](https://wangdoc.com/javascript/oop/strict)