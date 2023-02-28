---
title: Node.js
date: 2020-11-05 08:46:40
categories:
    - js
tags:
    - Node.js
---

> bilbil Node.js: https://www.bilibili.com/video/BV12y4y1Y793?p=8&spm_id_from=pageDriver

# Node.js是什么？

​	Node.js是一个基于chrome v8引擎的JavaScript运行环境。

## 优点

	1. 异步非阻塞的I/O(I/O线程池)， I/O指的是如 文件、数据库的输入输出
	2. 特别适用于I/O密集型应用
	3. 事件循环机制
	4. 单线程
	5. 跨平台

## 缺点

1. 回调函数嵌套太多、太深
2. 单线程，处理不好CPU密集型任务

## 与java相比

1. java搭建服务器成本高，来一个进程起一个线程，一对一服务，占用资源高。
2. Node.js单线程处理，同一时间有100个进程，都只由一个线程处理，节省资源，但是假设上一个请求服务处理占用CPU资源多，时间久，那么后续的其它服务需要等待前面的执行完。

# Node.js中的任何一个模块(js文件)都被一个外层函数包裹

```javascript
function (exports, require, module, __filename, __dirname) {
    // 编写js文件，实际就是在这个函数里面去编写
    // 所以在写js文件的时候，才能直接用exports, require, module...这些内容不会报错
    
    // exports: 用于支持CommonJs模块化规范的暴露语法
    // require: 用于支持CommonJs模块化规范的引入语法
    // module: 用于支持CommonJs模块化规范的暴露语法
    // __filename: 当前运行文件的绝对路径
    // __dirname: 当前运行文件所在文件夹的绝对路径
}
```

## 这个外层函数有什么用？

​	用于支持模块化语法。隐藏服务内部实现（从作用域角度看）

# 浏览器端js由哪几部分组成？

1. BOM，window浏览器对象模型
2. DOM，document文档对象模型
3. ES规范，ES5、ES6...

# Node.js的js由哪几部分组成？

​	只有ES规范和一个`global`全局变量
​	**Nodejs中禁止函数的this指向global，而是指向了一个空对象**

# Node.js的事件循环模型 （v10版本）

## 第一阶段 timers

​	（定时器阶段`setTimeout`、`setInterval`），开始计时，执行定时器的回调。

## 第二阶段 pending callbacks

​	（系统阶段）

## 第三阶段 idle，prepare

​	（准备阶段）

## 第四阶段 poll

​	（轮询阶段）

- 当回调队列里有待执行的回调函数，取出该回调函数并执行，直到回调队列为空；
- 当回调队列为空的时候
  - 如果有设置过`setImmediate`，进入下一个check阶段；
  - 如果没有设置过`setImmediate`，在此阶段停留，等待回调函数被插入回调队列，若定时器到点了，进入下一个check阶段（原因：为了走第五阶段，接着走第六阶段，直到第一阶段*（最终目的执行定时器）*）

## 第五阶段 check

​	（专门用于执行`setImmediate`所设置的回调）

## 第六阶段 close callbacks

​	（关闭回调阶段）

## process.nextTick()

​	立即执行函数，能在任意阶段优先执行（“特权VIP，人民币玩家”），仅次于主线程之后。

## 案例说明

- [x] 按照事件循环，`setTimeout`要先于`setImmediate`的，因为计时器在第一阶段执行，但是下面代码输出顺序可能setTimeout在前面，也可能在后面输出，谁先谁后不一定。

```javascript
setTimeout(() => {
    console.log('setTimeout所指定的回调函数执行了');
});
setImmediate(() => {
    console.log('我是setImmediate指定的回调');
});
```

- [x] 主线程加入了一点代码，有内容执行，将占用主线程的执行时间，为`setTimeout`提供了足够的执行时间，所以下面代码，`setTimeout`永远是执行在`setImmediate`之前。

 ```javascript
setTimeout(() => {
    console.log('setTimeout所指定的回调函数执行了');
});
setImmediate(() => {
    console.log('我是setImmediate指定的回调');
}); 
console.log('我是主线程上的代码');
// 我是主线程上的代码
// setTimeout所指定的回调函数执行了
// 我是setImmediate指定的回调
 ```

- [x] 加入process.nextTick()，优先级最高的

```javascript
setTimeout(() => {
    console.log('setTimeout所指定的回调函数执行了');
});
setImmediate(() => {
    console.log('我是setImmediate指定的回调');
});
process.nextTick(() => {
    console.log('process.nextTick所指定的回调');
});
console.log('我是主线程上的代码');
// 我是主线程上的代码
// process.nextTick所指定的回调
// setTimeout所指定的回调函数执行了
// 我是setImmediate指定的回调
```

# 包和包管理器

​	Node.js的包基于遵循CommonJS规范，将一组相关的模块组合在一起，形成一组完整的工具。包由包结构和包描述文件两个部分组成。

## 包结构

- package.json 描述文件必须要有，包名要求不能有中文，不能有大写字母和数字开头，不能与npm仓库上的其他包同名
- bin 可执行的二进制文件
- lib 编译后的js代码
- doc 说明文档、bug修复文档、版本变更记录文档
- test 测试报告

## npm和node.js的关系

​	npm（node package manager），安装Node.js之后自动安装npm，npm是Node.js官方出的包管理器，专门用于管理包

## npm常用命令

	1. 搜索 www.npmjs.com
	2. npm i packageName
	 - 局部安装完第三方包，放在当前目录中的node_modules文件夹下
	 - 安装完自动产生一个`package-lock.json`(npm5之后才有)，里面缓存的是每个下载过的包的地址，目的是下次安装的时候直接去下载地址下载即可
	 - 当安装完一个包，该包会自动写入到`package.json`中的`dependencies`（生产依赖）
	3. npm install packageName -D 安装包并写入到`devDependencies`（开发依赖中），依赖区分开发和生产的目的：开发者可能会用各种包来提升开发效率，但这些包不一定在最终提供生产包的时候需要，所以区分开生产依赖也是为了让包更加简洁干净
	4. npm root -g 查看全局安装目录
	5. npm i packageName -g 全局安装
	6. npm i packageName@xxx 安装包的xxx版本，默认是安装最新版
	7. npm i 安装package.json中声明的所有包
	8. npm view packageName versions 查看npm仓库中包的保本信息
	9. npm view packageName version 查看npm仓库种包的最新版本
	10. npm ls packageName 查看安装的包的版本
	11. npm remove packageName 删除包，同时删除包在package.json中的声明
	12. npm aduit fix 检测项目依赖中的一些问题，并且尝试着修复

## 关于版本号说明

`^3.x.x`锁定大版本，以后安装包的时候，保证包是3.x.x版本，x默认获取最新的
`~3.1.x`锁定小版本，以后安装包的时候，保证是3.1.x版本，x默认获取最新的
`3.1.1`锁定完整版本，以后安装包的时候，保证包必须是3.1.1

# 切换镜像源

```sh
# 中国稳定的npm资源库
yarn config set registry https://registry.npm.taobao.org

# 切换回npm库
yarn config set registry https://registry.yarnpkg.com
```

# yarn常用命令

1. yarn 下载所有声明的依赖
2. yarn add packageName@xxx 下载指定的依赖包版本
3. yarn add packageName@xxx -D 下载指定的开发时依赖
4. yarn global add packageName 全局下载指定包
5. yarn remove packageName 删除依赖包
6. yarn global remove packageName 全局删除依赖包
7. yarn info packageName 查看某个包的信息
8. yarn global dir 查看全局安装包位置

# node_modules

​	当引入第三方库的时候，在当前文件夹下没有找到node_modules,将找外层文件夹，直到根目录

# 创建HTTP服务器

```javascript
const http = require('http');
http.createServer(function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
  	res.write('<h1>Node.js</h1>');
  	res.end('<p>Hello World</p>');
}).listen(3000);
// 每次修改都需要重启Node.js，可使用supervisor工具监视代码的改动，并自动重启Node.js
```

# Nodejs作为单线程，需要数据库连接池吗？

​	要用到连接池，nodejs单线程指的是代码在单线程运行，异步IO是系统在其他线程运行。
