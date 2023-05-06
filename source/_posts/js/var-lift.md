---
title: javascript变量提升
excerpt: js引擎在正式执行之前，先进行一次预编译，在这个过程中，首先将变量声明和函数声明提升到当前作用域的顶端，然后再顺序执行接下来的处理
categories:
  - [front-end]
  - [back-end]
tags:
  - javascript
index_img: /img/js.webp
banner_img: /img/js.webp
date: 2023-05-06 21:49:18
---
js引擎在正式执行之前，先进行一次预编译。在这个过程中，首先将变量声明和函数声明提升到当前作用域的顶端，然后再顺序执行接下来的处理。 注意：当前流行的js引擎大都对源码进行了编译，由于引擎不同，编译方式有所差异，预编译和提升的说法只是抽象出来，便于理解。

## 1. 变量提升

### 1.1 函数中if声明变量
```javascript
// 源代码
function test() {
    if (!foo) {
        var foo = 5;
    }
    console.log(foo); // 5
}

test();
```
```javascript
// 预编译后
function test() {
    var foo; // 变量foo被提升到了作用域（函数）顶部， foo = undefined
    if (!foo) { // !undefined = true
        foo = 5;
    }
    console.log(foo); // 5
}

test();
```

### 1.2 全局变量与函数局部变量
```javascript
// 源代码
var foo = 3;
function test() {
    var foo = foo || 5;
    console.log(foo); //5
}
test();
```
```javascript
// 预编译后
var foo = 3;
function test() {
    var foo; // 变量foo被提升到函数顶部，函数内已经有foo变量，所以不用去调用到全局变量foo，这里的foo = undefined
    foo = foo || 5; // 条件成立， foo = 5
    console.log(foo); //5
}
tets();
```

### 1.3 局部作用域声明了多个同名变量
```javascript
// 源代码
function test() {
    var foo = 3;
    {
        var foo = 5;
    }
    console.log(foo); //5
}
test();
```
```javascript
// 预编译后
function test() {
    var foo;// 同一个标识符会被提升到作用域顶部，其他按顺序执行
    foo = 3;
    {
        foo = 5;
    }
    console.log(foo);//5
}
test();
```

## 2. 函数提升
函数是一等公民（函数优先权最高），函数声明永远被提升到当前作用域顶部，然后才是函数表达式和变量按顺序执行。

### 2.1 在函数声明之前调用函数
```javascript
//源代码
function test() {
    foo();// foo...
    function foo() {
        console.log('foo...');
    }
}

test();
```
```javascript
// 预编译后
function test() {
    // 函数声明提升到当前作用域顶部
    function foo() {
        console.log('foo...);
    }
    foo();
}
test();
```

### 2.2 同一个作用域存在多个同名函数声明
```javascript
// 源代码
function test() {
    function foo() {
        console.log(1);
    }
    foo();// 2
    function foo() {
        console.log(2);
    }
}
test();
```
```javascript
// 预编译后
function test() {
    function foo() {
        console.log(1);
    }
    function foo() {
        console.log(2);
    }
    foo();// 2，后面出现的将会覆盖前面的函数声明
}
test();
```

## 3. 函数表达式
- 函数声明 `function foo() {}`
- 匿名函数表达式 `var foo = function() {}`
- 具名函数表达式 `var foo = function bar() {console.log(bar)}`, **注意 `bar`函数名只能在函数内部使用，此时的`bar`是只读的**

### 3.1 函数声明+函数表达式
```js
// 源代码
function test() {
    foo(); // 2
    var foo = function() {
        console.log(1);
    };
    
    foo(); // 1
    
    function foo() {
        console.log(2);
    };
    
    foo();// 1
}
test();
```
```js
// 预编译后
function test() {
    var foo;
    // 函数声明是一等公民，函数声明的优先级最高，会被提升到当前作用域最顶端
    // 由于foo变量是undefined，与函数名foo相同，所以foo会赋予函数foo
    foo = function foo() {
        console.log(2);
    };
    foo(); // 2
    foo = function() {
        console.log(1);
    };
    foo(); // 1
    foo(); // 1
}
test();
```

### 3.2 函数与变量名重名
```js
// 源代码
var foo = 3;
function test() {
    console.log(foo); // f foo() {}
    foo = 5;
    console.log(foo); // 5
    function foo() {}
}

test();
console.log(foo); // 3
```
```js
// 预编译后
var foo = 3;

function test() {
    // 函数声明被提升到作用域顶端，全局的变量foo变没有被覆盖
    var foo;
    foo = function foo() {};
    console.log(foo); // f foo() {}
    foo = 5;
    console.log(foo); // 5
};

test();
console.log(foo);
```

## 4. 为什么要进行提升

这个问题并没有明确的答案，函数提升是为了解决函数分别在自己的函数体内调用了另一个函数。

### 4.1 函数相互调用（递归）
```js
// 源代码
function isEven(n) {
    if (n === 0) {
        return true;
    }
    return isOdd(n - 1);
}

// 如果没有函数提升，当isEven函数被调用时，isOdd函数还没声明，isEvent将无法调用isOdd
console.log(isEven(2)); // true

function isOdd(n) {
    if (n === 0) {
        return false;
    }
    return isEven(n - 1);
}
```
```js
// 原编译后
function isEven(n) {
    if (n === 0) {
        return true;
    }
    return isOdd(n - 1);
}

function isOdd(n) {
    if (n === 0) {
        return false;
    }
    return isEven(n - 1);
}
// 当开始调用函数的时候，确保了所有函数都已经是声明完毕
console.log(isEven(2)); // true
```

## 5. 块级作用域

### 5.1 js没有块级作用域
JavaScript是没有块级作用域的，如果在块内使用var声明一个变量，在代码块外面仍旧是可见的。
```js
if (true) {
    var foo = 3;
}
console.log(foo); // 3

for (var i = 0; i < 9; i++) {
    var j = i;
}
console.log(i); // 9
console.log(j);; // 8
```
### 5.2 let块级作用域
块内声明的变量，块外是不可见的。
```js
if (true) {
    let foo = 3;
}

console.log(foo); // Uncaught ReferenceError: foo is not defined
```
{% note warning %}
ES6的let规范了变量的声明，约束了变量提升，必须先声明，才能使用。
{% endnote %}
```js
function test() {
    console.log(foo); // Uncaught ReferenceError: foo is not defined
    let foo = 3;
}
test();
```
{% note danger %}
注： 不管是`var`，还是`let`，预编译过程中，都发生了变量提升，与**var**不同的是，ES6对`let`进行了约束，**在真正的词法变量声明之前，以任何方式访问let变量都是不允许的**。
{% endnote %}

### 5.3 let特性
- **暂时性死区**，只要快内存在let命令，那么这个变量就绑定了当前的块作用域，不再受外部变量影响
- **禁止重复声明变量**，`let`不允许再相同作用域内重复声明同一个变量
- **不会成为全局对象的属性**，在全局作用域下用`var`声明一个变量，该变量会成为全局对象的属性（`window`、`global`），但是`let`是独立存在的变量，不会成为全局对象的属性

### 5.4 const
`const` 和 `let` 相同，唯一不同的是 **const声明的变量不能重新赋值，且声明的时候必须初始化**

### 5.5 let/const/var对比

实际上，`let/const` 和 `var` 在“**声明创建一个变量**”没什么不同，只是Javascript拒绝访问还没有绑定值的`let/const`标识符

## 6. 声明

6条声明语句中，只有变量和常量两种标识符

- `let` 声明变量，不可再赋值前读取
- `const` 声明常量，不可写
- `var` 声明变量，在赋值前可读取到 `undefined`
- `function` 声明变量，该变量指向一个函数
- `class` 声明变量，该变量指向一个类（类德作用域内部是处理严格模式的）
- `import` 导入标识符并作为常量

### 6.1 潜在声明

- `for (var|let|const){}` 声明一个或多个标识符，作为循环变量
- `try{}catch(err){}` catch声明一个或多个标识符，作为异常对象变量

### 6.2 三种变量声明
**函数、类**的名字是按照`var`来处理的，`import`导入的名字是按照`const`来处理，所以声明本质上只有 `var`、`let`、`const`三种

### 6.3 lRef = rVal

`var a = 1` **右**操作数（的**值**）赋给**左**操作数（的**引用**），赋值表达式的左右边都是表达式

### 6.4 变量泄露

向一个不存在的变量赋值，js会在创建一个全局变量

```js
a 和 x 都是global属性
var a = 100;
x = 200;

Object.getOwnPropertyDescriptor(global, 'a');
{value: 100, wirtable: true, enumerable: true, configurable: false}

Object.getOwnPropertyDescriptor(global, 'x');
{value: 200, wirtable: true, enumerable: true, configurable: true}

// a不能删除，b可以被删除
delete a; // false
delete x; // true
```

### var x = y = 100

右边是 `y = 100`，向不存在的变量y赋值了100

## 7. 练习题

### 7.1
```js
// 源代码
console.log(a);
console.log(typeof test);
var flag = true;
if (!flag) {
    var a = 1;
}

if (flag) {
    function test(a) {
        test = a;
        console.log('test1');
    }
} else {
    function test(a) {
        test = a;
        console.log('test2');
    }
}
```
```js
// 预编译后
var flag;
var a;
var test;
console.log(a); // undefined
console.log(typeof test); // undefined
flag = true;
if (!flag) {
    a = 1;
}

if (flag) {
    test = function test(a) {
        test = a;
        console.log('test1');
    }
} else {
    test = function test(a) {
        test = a;
        console.log('test2');
    }
}
```

### 7.2
```js
// 源代码
alert(a);
a();
var a = 3;
function a() {
    alter(10);
}
alert(a);
a = 6;
a();
```
```js
// 预编译后
var a;
a = function a() {
    alter(10);
}
alert(a); // alert "function a() { alert(10); }"
a(); // 10
a = 3;
alert(a); // 3
a = 6;
a(); // error, a = 6, a is not a function
```