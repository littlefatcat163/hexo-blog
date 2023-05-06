---
title: npm
excerpt: node package manager, nodejs的开放式模块登记和管理系统，用于nodejs包的发布、传播、依赖控制
categories:
  - [front-end]
  - [back-end]
tags:
  - develop
  - nodejs
index_img: /img/nodejs/npm.webp
banner_img: /img/nodejs/nodejs.jpg
date: 2023-05-06 08:49:17
---
__node package manager__ nodejs的开放式模块登记和管理系统，用于nodejs包的发布、传播、依赖控制。

## 链接
> [npm常用指令](https://zhuanlan.zhihu.com/p/258080852)
> [.npmrc](https://docs.npmjs.com/cli/v8/using-npm/config)
> [package.json](https://docs.npmjs.com/cli/v6/configuring-npm/package-json#engines)

## package.json包版本号
{% note warning %}
- vue ^2.5.0 => vue 2.6.14
- vuex ~3.1.0 => vuex 3.1.3
- vue-router 3.5.3 => vue-router 3.5.3
- react 15.4.x => react 15.4.2
- typescript 3.x.x => typescript 3.9.10
- react-dom *.*.* => react-dom 17.0.2
- react-draggable x.x => react-draggable 4.4.4
- classnames x => classnames 2.3.1
- pinia * => pinia 2.0.12
{% endnote %}

- `^` 开头的版本会固定首个大版本号，后面的两个小版本号会更新到最新
- `~` 开头的版本会固定前两个版本，后面的小版本会更新到最新
- 不带符号，固定版本
- 最小版本号设置为 `x` 或 `*` ，最小版本号会更新到最新
- 任何一位版本设置为 `x` 或 `*`， 当前位置的版本号会更新到最新

{% note danger %}
要手动控制版本，可以在项目目录下添加 `.npmrc`配置前缀
```.npmrc
# 版本号不使用前缀^
save-prefix=""
```
{% endnote %}

## 限制项目指定nodejs版本
> [package.json 与 package-lock.json 关系](https://juejin.cn/post/7078233610683170824)
多人开发合作时，package-lock.json频繁冲突，因为每个人电脑上的node版本不同，最好用nvm来控制node版本，并确保项目中的node环境统一。

1. package.json配置环境要求
```json
// package.json
"engines": {
  "node": ">=16.13.0",
  "npm": ">=8.1.0"
},
"scripts": {
  // 只能使用npm 安装包
  "preinstall": "npx only-allow npm"
}
```
2. .npmrc 开启严格模式，以及去除包版本号前缀，使用精确版本，统一控制
```.npmrc
engine-strict=true
save-prefix=""
```
{% note warning %}
为什么要精确包版本号，因为无法确定每个包都有严格遵循npm规范，最好是统一控制处理，保持环境的统一。
{% endnote %}
3. 根目录放 .nvmrc 声明当前项目使用的node版本，直接使用 `nvm use` 就可以切换
```.nvmrc
v16.13.0
```
4. 如果需要更新依赖到最新版本，可以使用 [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) 

## pre- 和 post- 脚本
{% note success %}
npm run 为每条命令提供了 pre- 和 post- 两个钩子（hook）。以 npm run lint 为例，执行这条命令之前，npm会先查看有没有定义 prelint 和 postlint 两个钩子，如果有的话，就会先执行 npm run prelint，然后执行 npm run lint，最后执行npm run postlint。
{% endnote %}