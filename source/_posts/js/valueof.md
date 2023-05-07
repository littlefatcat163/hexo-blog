---
title: valueOf toString
excerpt: Symbol.toPrimitive 输出结果
categories:
  - [front-end]
  - [back-end]
tags:
  - javascript
index_img: /img/js.webp
banner_img: /img/js.webp
date: 2023-05-07 10:49:54
---
> - [valueOf](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf)
> - [toString](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)

## 不同类型对象的结果

### valueOf
返回对象本身， `Math`和`Error`对象没有`valueOf`

```js
valueOf.call(() => {}) // () => {}
valueOf.call({}) // {}
valueOf.call([]) // []
valueOf.call(true) // Boolean {true}
valueOf.call('') // String {'', length: 0}
valueOf.call(2) // Number {2}
valueOf.call(new Date) // Sat Apr 16 2022 12:08:26 GMT+0800 (中国标准时间)
```

### toString
`toString`在处理非字符串到字符串的强制类型转换

```js
toString.call(()=>{})       // [object Function]
toString.call({})           // [object Object]
toString.call([])           // [object Array]
toString.call('')           // [object String]
toString.call(2)           // [object Number]
toString.call(true)        // [object Boolean]
toString.call(undefined)    // [object undefined]
toString.call(null)         // [object null]
toString.call(new Date)     // [object Date]
toString.call(Math)         // [object Math]
toString.call(window)       // [object Window]
```

### 优先级

- 在数值运算中，优先使用 `valueOf`, 字符串运算中，优先调用 `toString`
- 运算操作符下，`valueOf` 优先于 `toString`
- 转字符串优先调用 `toString`，如果`toString`无法得到基本类型值，则转用 `valueOf`
- 转数字优先调用 `valueOf`，如果`valueOf`无法得到基本类型值，则转用`toString`
- 如果 `valueOf` 和 `toString` 均不返回基本类型值，将会产生 `TypeError`

### Symbol.toPrimitive
- 内置的一个Symbol值，当一个对象转移为对应的基础类型时，将调用该函数，优先级最高，高于 `valueOf` 和 `toString`
- 为了将值转换为相应的基础类型，抽象操作toPrimitive会首先检查是否有`valueOf`/`toString`

```js
class Foo {
    constructor(count) {
        this.count = count;
    }
    valueOf() {
        return 0;
    }
    toString() {
        return '0';
    }
    [Symbol.toPrimitive](hit) {
        // hit - number/string
        if (hit === 'number') return 1;
        if (hit === 'string') return '1';
        return null;
    }
}
```


### toJSON

- 不安全的`json`值。`undefined`，`function`，`symbol`，循环引用（对象之间的相互引用）
- `JSON.stringify` 在对象遇到 `undefined`, `function`, `symbol`会自动忽略，在数组中会返回`null`
- 对象中定义了`toJSON`函数，`JSON`字符串转换会优先调用该函数的返回值来进行序列化

```js
JSON.stringify(undefined); // undefined
JSON.stringify(function() {}); // undefined
JSON.stringify([1, undefined, function() {}, 4]); // [1,null,null,4]

function foo() {}
foo.toJSON = function() {return "foo"}
JSON.stringify(foo); // "foo"
```

## == 和 === 的区别

- `===` 等同符，等号两边类型和值都相同返回 `true`，不是返回 `false`
- `==` 等值符，等号两边类型不同将自动转换成相同类型后比较值

### x == y


| x | y | 结果 |
| --- | --- | --- |
| `null` | `undefined` | true |
| `number` | `string` | x == toNumber(y) |
| `boolean` | any | toNumber(x) == y |
| `string/number` | `object` | x == toPrimitive(y)


## 运算符操作强转数字

### +

```js
+'3.14'; // 3.14

# 数组valueOf无法得到基本类型值，转而用toString，变成 '1,2'+'3,4'
[1,2] + [3,4]l // "1,23,4"
```

### -

`-` `*` 会强转为数字

```js
[3] - [1]; // 2
```

### 代码块

- `{}` 出现在运算符表达式中，被当成一个值（空对象）处理

```js
// []被强制类型转换为""， {}被强制类型转换为"[object Object]"
[] + {}; // "[object Object]"

// {}被当作一个独立的代码块（不执行任何操作），代码块结尾不需要加分号
// + [] 将[]转换为0 => Number('') = 0
{} + []; // 0
```