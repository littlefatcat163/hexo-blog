---
title: buffer
date: 2021-04-12 09:09:45
categories:
    - js
tags:
    - Node.js

---

> bilbil Node.js: https://www.bilibili.com/video/BV12y4y1Y793?p=8&spm_id_from=pageDriver

# 进制相关

​	十六进制: 00 - ff

​	二进制: 000000 - 11111111

# 计算机单位换算

​	8位(bit) = 1字节(Byte)
​	1024Byte = 1Kb
​	1024Kb = 1Mb
​	1024Mb = 1Gb

# Buffer缓冲器

	1. Buffer是一个类似数组的对象，用于存储数二进制据。
	2. Buffer效率高，存储和读取很快，直接对计算机的内存进行操作。
	3. Buffer的大小一旦确定了，不可修改。
	4. 每个元素占用内存的大小为1字节。
	5. Buffer是Node.js中的非常核心的模块，无需下载、引入，直接使用。

```javascript
// 创建一个Buffer的实例对象，性能特别差
// 1.在堆里开辟空间；2.清理
const buf = new Buffer(10);

// 创建一个Buffer的实例对象，性能比new Buffer()稍强一点
// 在堆里开启一块没有使用过的空间
const buf2 = Buffer.alloc(10);

// 创建一个Buffer的实例对象，性能最好的
// 在堆里开辟空间，可能残留着使用过的数据
const buf3 = Buffer.allocUnsafe(10);

// 输出的Buffer不是二进制，是十六进制，存储的是二进制
console.log(buf3, buf2, buf);


// 将数据存入一个Buffer实例
let buf4 = Buffer.from('hello');

// Buffer实例的length属性，表示该Buffer实例占用内存空间的大小
buf4.length;
```

