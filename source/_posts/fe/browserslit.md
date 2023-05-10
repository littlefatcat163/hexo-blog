---
title: browserslist
excerpt: 查询浏览器列表工具
categories: 
    - [front-end]
    - [back-end]
tags: 
    - develop
    - nodejs
    - javascript
index_img: /img/fe/webpack.jpg
# banner_img: /img/hexo.webp
date: 2023-05-10 20:34:46
---
> [https://github.com/browserslist/browserslist#full-list](https://github.com/browserslist/browserslist#full-list)
> [https://juejin.cn/post/7054114633312894983](https://juejin.cn/post/7054114633312894983)

## 例子

### 查找chrome最后两个版本

```sh
npx browserslist "last 2 Chrome versions"

chrome 113
chrome 112
```

## 查看全球市场占有率大于1%的浏览器
```sh
npx browserslist "> 1%"

and_chr 112
chrome 112
chrome 111
chrome 109
edge 112
edge 111
firefox 111
ios_saf 16.4
ios_saf 16.3
ios_saf 16.2
ios_saf 16.1
safari 16.3
samsung 20
```

## defaults
{% note success %}
默认配置，相当于 > 0.5%, last 2 versions, Firefox ESR, not dead
{% endnote %}
```sh
npx browserslist

and_chr 112
and_ff 110
and_qq 13.1
and_uc 13.4
android 112
chrome 113
chrome 112
chrome 111
chrome 109
edge 113
edge 112
edge 111
firefox 112
firefox 111
firefox 102
ios_saf 16.4
ios_saf 16.3
ios_saf 16.2
ios_saf 16.1
ios_saf 16.0
ios_saf 15.6
kaios 3.0-3.1
kaios 2.5
op_mini all
op_mob 73
opera 98
opera 97
safari 16.4
safari 16.3
safari 15.6
samsung 20
samsung 19.0
```

## 按市场占有率
```sh
# 全球市场占有率大于 5% 的浏览器
npx browserslist "> 5%"

# 全球市场占有率小于 5% 的浏览器
npx browserslist "< 5%"

# 查找 USA 地区市场占有率大于 5% 的浏览器
npx browserslist "> 5% in US"

# 查找 Asia 地区市场占有率大于 5% 的浏览器
npx browserslist "> 5% in alt-AS"
```

## 按最后版本
```sh
# 查找所有浏览器的最后 2 个版本
npx browserslist "last 2 versions"

# 查找 Chrome 浏览器的最后 2 个版本
npx browserslist "last 2 Chrome versions"
```

## dead
{% note warning %}
查找超过 24 个月没被官方维护的浏览器，比如 IE10、BlackBerry 10 等
{% endnote %}
```sh
npx browserslist "dead"
```

## supports es6-module
{% note info %}
支持es6模块的浏览器
{% endnote %}
```sh
npx browserslist "supports es6-module"
```

## 组合查询

### and
and 交集，查找chrome58-65，且支持es6-module的版本
```sh
npx browserslist "Chrome 58-65 and supports es6-module"

```

### or
or并集，查找 Chrome 与 Edge 大于 94 的版本
```sh
npx browserslist "Chrome > 94 or Edge > 94"

# 可以用逗号代替or
npx browserslist "Chrome > 94,Edge > 94"
```

### not 非， 取反
```sh
npx browserslist "Chrome 58-65 and not supports es6-module"
```

## 配置文件
{% note success %}
项目根目录下创建`.browserslistrc`，编写相关查询条件，换行表示 __or__
{% endnote %}
```.browserslistrc
Chrome > 94
Edge > 94
```

## caniuse-lite 与 caniuse-db
browserslist 是从 caniuse-lite 这个库中查询数据的，caniuse-lite 是 caniuse-db 的精简版本，对 caniuse-db 的数据按一定规则做了简化，减少了库的大小。
caniuse-db 则是 can i use 网站的数据源，提供了网站查询所需的所有数据，caniuse-db 发布时会同步发布 caniuse-lite。
由于它们都不属于线上数据库，使用时会将数据克隆至本地，所以可能会存在本地数据不是最新的情况，browserslist 提供了更新 caniuse-lite 的命令，可定期运行以获取最新数据：
```sh
npx browserslist@latest --update-db
```

## 作用
市面上有很多浏览器，每种浏览器又有不同的版本，所支持的环境各不相同，为了抹平它们之间的差异，于是出现了 Pollyfill 解决方案，Pollyfill 的作用是通过降级处理，让新的语法能够运行在其不被支持的浏览器环境中，常见的 Pollyfill 有 Babel、Autoprefixer 等。
以 Babel 为例，它是怎么判断项目是否需要做降级处理的呢，答案就是通过 browserslist 查询出需要支持的浏览器列表，然后根据这个列表来做判断。

### 1. 用 Babel 验证一下，先安装 Babel
```sh
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

### 2. 创建 babel.config.json
```json
{
  "presets": ["@babel/preset-env"]
}
```

### 3. 创建 .browserslistrc
```.browserslistrc
chrome 96
```

### 4. 创建index.j
```js
const say = (msg) => {
  console.log(msg)
}
say('hello')
```

### 5. 运行babel编译
```sh
npx babel index.js --out-dir test
```
可以看到编译后的文件如下，因为chrome96已经支持const和箭头函数，所以不用作降级处理
```js
"use strict";

const say = msg => {
  console.log(msg);
};

say('hello');
```

### 6. 修改 .browslistrc 支持 ie9
```.browserslistrc
chrome 96
ie 9
```
再次执行编译后，js已经做了降级处理
```js
"use strict";

var say = function say(msg) {
  console.log(msg);
};

say('hello');
```

## 注意
{% note danger %}
如果 .browserslistrc 包含版本较旧的浏览器，可能会增大打包文件的体积，因为一些 api 需要通过 Pollyfill 来实现，比如某些浏览器不支持 Promise，那么会在打包文件中注入 Promise 的补丁；新版本的浏览器已经支持了Promise，将不会打补丁。根据项目实际情况设置以减少打包文件体积。
{% endnote %}