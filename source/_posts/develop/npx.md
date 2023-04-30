---
title: npx
excerpt: npm从5.2开始，增加了npx
categories: [workflow]
tags: [develop, nodejs]
index_img: /img/develop/npx.jpg
banner_img: /img/develop/nodejs.jpg
date: 2023-04-30 10:28:42
---
> https://www.ruanyifeng.com/blog/2019/02/npx.html

npm 5.2.0版本之后新加的工具，用于解决本地安装模块时需要先找到其安装路径的问题。同时，它还可以在非全局安装的情况下，直接运行一个命令。

## 调用项目安装的模块Mocha
```sh
npm install -D mocha

# 调用Mocha，只能下项目根目录执行
node-modules/.bin/mocha --verson
```
{% note success %}
npx能解决这个问题，让项目内部安装的模块调用起来更方便
```sh
npx mocha --version
```
{% endnote %}

## npx原理
在运行的时候，会到 `node_modules/.bin` 和 `$PATH` 查看命令是否存在，如果不存在，将会把相关的包下载到临时目录，用完以后再删除。

## 避免全局安装模块
{% note warning %}
```sh
npx create-react-app my-app
```
将在当前目录下检查是否有 `create-react-app`，如果不存在，自动将`create-react-app` 下载到一个临时目录，然后再执行上面的命令，使用以后删除。
{% endnote %}

## 强制使用模块

```sh
# 强化使用过本地模块，不下载远程模块，如果本地不存在，报错
npx --no-install http-server

# 忽略本地同名模块，强制安装使用远程模块
npx --ignore-existing create-react-app my-app
```

## 执行GitHub源码
```sh
# 执行 Gist 代码
npx https://gist.github.com/zkat/4bc19503fe9e9309e2bfaa2c58074d32

# 执行仓库代码
npx github:piuccio/cowsay hello
```