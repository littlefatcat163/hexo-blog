---
title: this
excerpt: this 对象自动生成一个内部对象，只能在对象内部使用，随着函数的调用，this将随着动态指向调用的对象。
categories:
  - [front-end]
  - [back-end]
tags:
  - javascript
index_img: /img/js.webp
banner_img: /img/js.webp
date: 2023-05-07 10:22:12
---

## this绑定方式，优先级从上到下
{% note success %}
new > call/apply/bind（显示绑定） > （上下文）对象（隐式绑定） > （window）默认绑定
{% endnote %}

### 1. new
js不存在`constructor`，所以`new`**修饰的函数 Function 是函数的构造调用**, js的new作了以下工作：

1. 创建一个新对象
2. 把这个新对象的`__proto__`指向原函数的`prototype`**（即继承原函数的原型）**
3. 将这个新对象绑定到此函数的`this`上
4. 返回新对象，**如果函数`return`了一个对象类型，那么将无法返回新对象，将丢失绑定`this`的新对象**

```js
function foo() {
    this.a = 5;
    console.log(this);
}
foo(); // this是window，window.a = 5，默认绑定this->window

var obj = new foo(); // foo{a: 5} 创建的新对象，默认名为函数名
                     // 等价于 var foo = {a: 10}; var obj = foo;
```

{% note warning %}
如果函数返回了对象类型，那么将无法返回新对象，丢失this。
{% endnote %}
```js
function foo() {
    this.a = 5;
    return {};
}
var obj = new foo(); // 等价于 var foo = {}; var obj = foo;
console.log(obj.a); // undefined
```

### 2. call/apply/bind 显示绑定

修改函数的`this`指向，第一个参数是设置 `this` 对象, `call/apply` 立刻执行函数， `bind`将绑定好`this`的函数返回

- `call(thisArg, arg1, arg2, ...)`
- `apply(thisArg, [args])`
- `bind(thisArg): Function`

```js
function foo() {
    console.log(this.a);
}
foo.call({a: 5}); // 5
foo.apply({a: 3}); // 3
foo.bind({a: 1})(); // 1
```

### 3. 隐式绑定

调用函数的是谁，`this`就指向谁

```js
function foo() {
    console.log(this.a);
}

var obj = {
    a: 5,
    foo: foo
}

foo(); // undefined
obj.foo(); // 5
```

### 4. 默认绑定

默认绑定到 `window`上，严格模式下是 `undefined`，如上示例中的 `foo();`

### 5. 箭头函数
- 箭头函数不使用前面的四种绑定，完全根据外部作用域来决定`this`
- 箭头函数的`this`绑定无法被修改

```js
var obj = {
    that: this,
    bar: function() {
        return () => {
            console.log(this);
        }
    },
    baz: () => {
        console.log(this);
    }
}
console.log(obj.that); // window, obj当前的作用域是window， that === window
obj.bar()(); // func有自己的函数作用域，将箭头函数绑定到当前对象上obj，箭头函数自动绑定函数所在的作用域obj
obj,baz(); // 默认绑定的父级作用域就是window
```

## 练习

### 1
```js
var x = 10;
var obj = {
    x: 20,
    foo: function() {
        console.log(this.x); // 20
        var bar = function() {
            console.log(this.x); // 10
        }
        bar();
    }
}

obj.foo();
```

### 2
```js
function foo(arg) {
    this.a = arg;
    return this;
}

// foo 默认绑定，this指向了window，函数里等价于 foo() { window.a = 1; return window; }
// window.a = window
var a = foo(1);

// window.a = 10
// window.b = window
var b = foo(10);

console.log(a.a); // window
console.log(b.a); // 10
```