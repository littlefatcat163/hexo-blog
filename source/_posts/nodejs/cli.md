---
title: npm 脚手架
excerpt: nodejs 自定义脚手架
categories:
  - [front-end]
  - [back-end]
tags:
  - develop
  - nodejs
index_img: /img/nodejs/npm.webp
banner_img: /img/nodejs/nodejs.jpg
date: 2023-10-20 15:32:50
---

## nodejs 自定义脚手架

注意
js脚本会写到 bin下，package.json里面要注明 bin 对应脚本的执行关系，bin声明的会在使用 npm i my-cil -g 全局安装的时候，将其写入到 环境变量中

## 怎么本地调试

my-cil 目录下执行 ， npm link 生成全局软链接到这个库，每次有改动，就再执行一下 npm link，要取消软链接，执行 npm unlink即可

然后在需要的地方执行 npx my-cli就可以执行到对应的文件

如果link一直出错，或者unlink删不掉，就用 npm link --force 强替换

## npx my-cli 执行的js报错，无法运行，明明里面很简单，就只有console也不行？

#!/usr/bin/env node 这句话写到脚本文件开头，这样执行 npx my-cli的时候，操作系统就会使用 Node.js 来执行js
注意上面的格式是 Unix风格的，也就是使用LF（换行符）作为行尾符号，如果你使用的是window系统，你需要在编辑器中将行尾字符设置为LF，或者使用类似Unix系统的编辑器来编辑文件

## npx 和 npm create 执行脚手架

### npx

如下所示 `npx create-lnote test2` 
1. npx 将去找 create-lnote 包下的 bin 配置对应的js，执行，后面都是这个命令的参数

### npm create

`npm create lnote test2` 跟上面类似，只是create去执行，规定了 lnote 这个包的名字必须是 create-lnote 才能加载到，然后找本地有没有 create-lnote，没有就去npm仓库上面找，临时下载下来，用完就删，接下来的执行内容就很上面一样了