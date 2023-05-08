---
title: 高阶函数
excerpt: 函数作为参数传递和返回值输出
categories:
  - [front-end]
  - [back-end]
tags:
  - javascript
index_img: /img/js.webp
banner_img: /img/js.webp
date: 2023-05-08 20:18:51
---
## 回调函数
函数作为参数传递。

### 异步请求
```js
var getUserInfo = function(userId, callback) {
    $.ajax('http://xxx?' + userId, function(data) {
        if(typeof callback === 'function') {
            callback(data);
        }
    });
}

getUserInfo(13157, function(data) {
    console.log(data.userName);
});
```
### “委托”
{% note warning %}
回调函数的应用不仅只是在异步请求中，当一个函数不适合执行一些请求时，可以把这些请求封装成一个函数，并把它作为参数传递给另外一个函数，“委托”给另外一个函数来执行。
隐藏节点的请求实际上是由客户发起，但是客户并不知道节点什么时候会创建好，于是把隐藏节点的逻辑放在回调函数中，“委托”给appendDiv方法，appendDiv方法当然知道节点什么时候创建好，所以在节点创建好的时候，appendDiv会执行之前客户传入的回调函数。
{% endnote %}

```javascript
var appendDiv = function(callback) {
    for(var i = 0; i < 100; i++) {
        var div = document.createElemnt('div');
        div.innerHTML = i;
        document.body.appendChild(div);
        if (typeof callback === 'function') {
            callback(div);
        }
    }
};

appendDiv(function(node) {
    node.style.display = 'none';
});
```

### 数组方法
{% note success %}
Array.prototype.sort的目的是对数组元素进行排序，这是不变的部分，具体用什么规则排序，是可变的部分，把可变的部分分装在函数参数里，动态传入Array.prototype.sort，使Array.prototype.sort方法成为一个非常灵活的方法
{% endnote %}

```js
// 从小到大, [1,3,4]
[1,4,3].sort(function(a, b) {
    return a - b;
});

// 从大到小, [4,3,1]
[1,4,3].sort(function(a, b) {
    return b - a;
});
```

## 函数作为返回值输出

相比把函数当做参数传递，函数当做返回值输出的应用场景更多，也更能体现函数式编程的巧妙。让函数继续返回一个可执行的函数，意味着运算过程是可延续的。
{% note info %}
判断一个数据是否是数组，在以往的实现中，如果基于鸭子模型的概念来判断，就是判断这个数据有没有length属性，有没有sort或者slice方法等。但是更好的方式是用Object.prototype.toString返回的字符串来计算。
{% endnote %}
```javascript
var isType = function(type) {
    return function(obj) {
        return Object.prototype.toString.call(obj) === '[object ' + type + ']';
    }
};

var isString = isType('String');
var isArray = isType('Array');
var isNumber = isType('Number');

console.log(isArray([1,2,3])); // true

// 还可以利用循环，来批量注册这些isType函数
var Type = {};

for(var i = 0, type; type = ['String', 'Array', 'Number'][i++]; ) {
    (function(type) {
        Type['is' + type] = function(obj) {
            return Object.prototype.toString.call(obj) === '[object' + type + ']';
        }
    })(type)
};

Type.isArray([]); // true
Type.isString(''); // true

```

### 单例
```js
var getSingle = function(fn) {
    var ret;
    return function() {
        return ret || (ret = fn.apply(this, arguments));
    }
};

var getScript = getSingle(function() {
    return document.createElement('script');
});

var script1 = getScript();
var script2 = getScript();
console.log(script1 === script2); // true
```


## 高阶函数实现AOP

`AOP`（面向切面编程）的主要作用是把一些跟核心业务逻辑模块无关的功能抽取出来，这些业务逻辑无关的功能通常包括日志统计、安全控制、异常处理等。把这些功能抽离出来之后，再通过"动态织入"的方式参入业务逻辑模块中。这样做的好处首先是保持业务逻辑模块的纯净和高内聚性，其次是可以很方便地复用日志统计等功能模块。

在`javascript`中实现`AOP`，都是把一个函数"动态织入"到另外一个函数中，例如

```javascript
Function.prototype.before = function(beforefn) {
    var __self = this; // 保存原函数的引用
    return function() { // 保存包含了原函数和新函数的“代理”函数
        beforefn.apply(this, arguments); // 执行新函数，修正this
        return __self.apply(this, arguments); // 执行原函数
    }
};

Function.prototype.after = function(afterfn) {
    var __self = this;
    return function() {
        var ret = __selft.apply(this, arguments);
        afterfn.apply(this, arguments);
        return ret;
    }
};

var func = function() {
    console.log('func');
};

func = func.before(function() {
    console.log('before');
}).after(function() {
    console.log('after');
});

func();
// before
// func
// after
```

## 高阶函数的其它应用

### currying 函数柯里化，部分求值

一个`currying`函数首先会接收一些参数，该函数并不会立即求值，而是继续返回另外一个函数，刚才传入的参数在函数形成的闭包中被保存起来。等待函数被真正需要求值的时候，之前传入的所有参数都会一次性用于求值。*（利用已有的函数，再创建一个动态的函数，该动态函数内部还是通过已有的函数来发生作用，只是传入更多的参数来简化函数的参数方面调用）*

### 计算每月开销
```javascript
var monthlyCost = 0;

var cost = function(money) {
    monthlyCost += money;
};

cost(100); // 第一天100
cost(200); // 第二天200
cost(300); // 第三天300
console.log(monthlyCost); //三天花费600
```
{% note warning %}
上面代码可以看到，每天结束后都会记录并计算到今天为止花掉的钱，但事实上并不需要关心每天花掉多少钱，而只想知道月底一共花费了多少钱，实际上只要在月底计算一次。
{% endnote %}
```javascript
var cost = (function() {
    var args = [];
    return function() {
        if(arguments.length === 0) {
            var money = 0;
            for (var i = 0, l = args.length; i < l; i++) {
                money += args[i];
            }
            return money;
        } else {
            [].push.apply(args, arguments);
        }
    }
})();

cost(100); // 未真正求值
cost(200); // 未真正求值
cost(300); // 未真正求值
cost(); // 求值: 600
```
{% note success %}
再改进一下，编写一个通用的`currying`函数
{% endnote %}
```javascript
// 接受并处理参数
var currying = function(fn) {
    var args = [];
    return function() {
        if (arguments.length === 0) {
            return fn.apply(this, args);
        } else {
            [].push.apply(args, arguments);
            return arguments.callee;
        }
    }
}

// 计算总额
var costFn = (function() {
    var money = 0;
    return function() {
        for (var i = 0, l = arguments.length; i < l; i++) {
            money += arguments[i];
        }
        return money;
    }
})();

var cost = currying(costFn); // 转换成currying函数
cost(100);
cost(200);
cost(300);
cost(); // 600
```


### uncurrying

把泛化`this`的过程提取出来

```javascript
Function.prototype.uncurrying = function() {
    var self = this; // 当前函数
    return function() {
        var obj = Array.prototype.shilft.call(arguments); // 取第一个元素
        return self.apply(obj, arguments); // 执行函数和参数
    }
}

// 通过uncurrying的方式，把Array.prototype.push.call变成一个通用的push函数
var push = Array.prototype.push.uncurrying();
(function() {
    push(arguments, 4);
    console.log(arguments); // [1,2,3,4]
})(1,2,3);

// 同样，一次性地把Array.prototype上的方法"复制"到array对象上
for(var i = 0, fn, ary = ['push', 'shift', 'forEach']; fn = ary[i++];) {
    Array[fn] = Array.prototype[fn].uncurrying();
}

// 现在给出uncurrying另外一种实现方式
Function.prototype.uncurrying = function() {
    var self = this;
    return function() {
        return Function.prototype.call.apply(self, arguments);
    }
}
```

## 函数节流

在有些场景下，函数可能被很频繁地调用，而造成大的性能问题，比如
1、当浏览器窗口大小被拖动而改变的时候，`window.onresize`事件触发频率很高，有一些跟`DOM`节点相关的操作，而跟`DOM`节点相关的操作往往是非常消耗性能的，这时候浏览器可能就会吃不消造成卡顿现象
2、拖拽元素节点`mousemove`
3、上传进度，浏览器插件在真正开始上传文件之前，会对文件进行扫描并随时通知`javascript`函数，以便在页面中显示当前的扫描进度，通知的频率非常高，大约一秒钟10次
4、输入框onkeyup, input, onkeydown

以上三个场景，共同问题是函数被触发的频率太高，事实上可以不需要那么每次都处理，只需要处理有效的次数即可，这里就需要用到函数节流了，下面`throttle`函数的原理是，将准备被执行的函数用`setTimeout`延迟一段时间执行，如果该次延迟执行还没有完成，则忽略接下来调用该函数的请求。

```javascript
var throttle = function(fn, interval) {
    
    var __self = fn, // 保存需要被延迟执行的函数引用
        timer, // 定时器
        firstTime = true; // 是否第一次调用
    
    return function() {
        var args = arguments,
            __me = this;
        
        if(firstTime) { // 如果是第一次调用，不需延迟执行
            __self.apply(__me, args);
            return firstTime = false;
        }
        
        if(timer) { // 如果定时器还在，说明前一次延迟还没有完成
            return false;
        }
        
        timer = setTimeout(function() { // 延迟一段时间执行
            clearTimeout(timer);
            timer = null;
            __self.apply(__me, args);
        }, interval || 500);
        
    }
    
};
window.onresize = throttle(function() {
    console.log(1);
}, 500);
```

## 分时函数

同时往页面添加大量DOM节点显然会让浏览器吃不消，往往就是浏览器卡顿，解决方案就是让将创建节点的工作分批进行，例如把1秒钟创建1000个节点，改为每隔200毫秒创建8个节点

```javascript
var timeChunk = function(ary, fn, count) {
    
    var obj,
        t;
    
    var len = ary.length;
    
    var start = function() {
        for(var i = 0; i < Math.min(count || 1, ary.length); i++) {
            var obj = ary.shift();
            fn(obj);
        }
    };
    
    return function() {
        t = setInterval(function() {
            if(ary.length === 0) { // 如果全部节点都已经被创建好
                return clearInterval(t);
            }
            start();
        }, 200); // 分批执行的时间间隔，也可以用参数的形式传入
    };
    
};

var ary = [];
for(var i = 1; i <= 1000; i++) {
    ary.push(i);
}

var renderFriendList = timeChunk(ary, function(n) {
    var div = document.createElement('div');
    div.innerHTML = n;
    document.body.appendChild(div);
}, 8);

renderFriendList();
```

## 惰性加载函数

在web开发中，因为浏览器之间的差异，需要做兼容，比如个个浏览器中能工通用的时间绑定函数`addEvent`

```javascript
// 缺点：每次调用的时候都会执行里面的if分支，虽然开销不大，但也许有一些方法可以让程序避免这些重复的执行过程
var addEvent = function(elem, type, handler) {
    if (window.addEventListener) {
        return elem.addEventListener(type, handler, false);
    }
    if (window.attachEvent) {
        return elem.attachEvent('on' + type, handler);
    }
};

// 在代码加载的时候立刻进行一次判断，让addEvent返回一个包裹了正确逻辑的函数；
// 缺点：从头到尾都没用使用过addEvent函数，这样看来，前一次的浏览器嗅探是完全多余的操作，
// 而且这也会稍稍延长页面ready时间
var addEvent = (function() {
    if(window.addEventListener) {
        return function(elem, type, handler) {
            elem.addEventListener(type, handler, false);
        }
    }
    if(window.attachEvent) {
        return function(elem, type, handler) {
            elem.attachEvent('on' + type, handler);
        }
    }
})();

// 惰性载入函数方案，addEvent被声明为一个普通函数，函数里也有分支判断，
// 但在第一次进入条件分支之后，函数内部会重写这个函数，重写之后的函数就是我们期待的addEvent函数，
// 在下一次进入addEvent函数的时候，addEvent已经不再存在条件分支语句
var addEvent = function(elem, type, handler) {
    if (window.addEventListener) {
        addEvent = function(elem, type, handler) {
            elem.addEventListener(type, handler, false);
        }
    } else if (window.attachEvent) {
        addEvent = function(elem, type, handler) {
            elem.attachEvent('on' + type, handler);
        }
    }
    
    addEvent(elem, type, handler);
};

var div = document.getElementById('div');
addEvent(div, 'click', function() {
    console.log(1);
});
```
