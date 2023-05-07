---
title: arguments
excerpt: 函数中的形参与实参
categories:
  - [front-end]
  - [back-end]
tags:
  - javascript
index_img: /img/js.webp
banner_img: /img/js.webp
date: 2023-05-07 10:42:29
---
## 函数参数
- **形参**：函数定义的参数，用于接收函数调用时的实参 `function foo(a,b){}`
- **实参**：调用函数传入的变量 `function foo(1,2) {}`
{% note warning %}
形参与实参分别作用域不同的内存地址中
{% endnote %}

1. 当`实参`为基础类型，`形参` = `实参`的拷贝，函数体内形参值的改变并不影响实参值
```js
function foo(num) {
    num = 2;
    return num;
}
var num1 = 1;
var num2 = foo(num1);

console.log(num1); // 1
console.log(num2); // 2
```

2. `实参`为引用值，如`object`，`形参` = `实参`内存地址，函数体内`形参`值的变化在一定情况下将影响`实参`
```js
function foo(obj) {
    // 此时形参obj和实参obj指向同一个内存地址引用
    obj.name = 'foo';
    
    // 形参obj被重新赋值，指向了一个新的内存地址
    obj = {
        name: 'xxx',
        value: 0
    };
    // 形参
    obj.value = 10;
    return obj;
}
var obj = {
    name: 'test',
    value: 1
}

var obj2 = foo(obj);
console.log(obj); // name: foo, value: 1
console.log(obj2); // name: xxx, value: 10
```

## arguments
{% note warning %}
在函数调用的时候，有两个隐式的参数，函数上下文`this` 和 实参封装类数组对象 `arguments` 。
{% endnote %}
{% note danger %}
注意：js中函数可以接收任意个参数，最多可以接收**255**个，且不会引发任何错误，遗漏的参数以`undefined`传给函数，多余的参数将被函数忽略，`函数变量.length`表示形参个数
{% endnote %}
```js
function fn(a, b, c) {
    console.log(a, b, c); // 1 2 undefined
    console.log(fn.length); // 3
    console.log(arguments); // {0: 1, 1: 2, length: 2, callee: f fn(a, b, c)}
}
fn(1,2);
```

如上例所示，`arguments`代表调用函数传入的实参，这是个类数组对象，有下标对应参数值，`length`对应参数个数，`callee`返回被当前的函数体