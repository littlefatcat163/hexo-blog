---
title: require
excerpt: CommonJS 
categories: 
  - [front-end]
  - [back-end]
tags: 
  - develop
  - nodejs
index_img: /img/fe/modular.jpg
banner_img: /img/nodejs/nodejs.jpg
date: 2023-05-07 12:37:16
---
> [nodejs require module](https://nodejs.org/api/modules.html#modules_all_together)
> [阮一峰 require module](https://www.ruanyifeng.com/blog/2015/05/require.html)

如下目录结构 `home/project/foo.js`
```sh
home
  |—— project
        |—— node_modules
        |—— foo.js
```

```js
// foo.js
var bar = require('bar')
```
目标 `bar` 的路径可能是下面这些位置，依次搜素每一个目录。
{% note success %}
- /home/project/node_modules/bar
- /home/node_modules/bar
- /node_modules/bar
{% endnote %}

搜索目录时，`nodejs` 将 `bar` 当成文件名，依次搜索下面这些文件
{% note success %}
- bar
- bar.js
- bar.json
- bar.node
{% endnote %}

如果不成功，说明 `bar` 有可能是目录名，依次加载下面的文件
{% note success %}
- bar/package.json (main) 字段
- bar/index.js
- bar/index.json
- bar/index.node
{% endnote %}

查询完毕目录和文件，都找不到，将抛出错误。

## Module

nodejs中会将所有的js当成模块处理，都是`Module`的实例。

## demo.js
```js
var bar = require('bar');
console.log(__dirname);
module.exports = {};
```

## 编译
```js
// demo.js当作Module示例，相当于包裹了func，提供模块成员 module, __dirname 等
(function (exports, require, module, __filename, __dirname) {
  // 模块源码
});
```