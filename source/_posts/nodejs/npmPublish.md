---
title: npm publish unpublish
excerpt: npm 规则、限制 publish unpublish
categories:
  - [front-end]
  - [back-end]
tags:
  - develop
  - nodejs
index_img: /img/nodejs/npm.webp
banner_img: /img/nodejs/nodejs.jpg
date: 2023-11-17 11:33:56
---

## 权限

- 新用户，刚刚注册，没有发布过npm包，{% font warning @新用户一天只能发布一个包 %}
- 老用户，注册过，并且发布过npm包，且这个包已经存在至少5年，{% font success @老用户无限制发包数量 %}

## publish {% label warning @注意事项 %}
上传npm包，命令如下，执行后，将自动找package.json里面的版本号去发布对应的版本

```sh
npm publish pkgName
```

### 1. 发布包和版本号，只能一一对应

比如你发布了的包名叫做 `test` ，版本号是 `1.0.0`，一旦发布后，后续再发布版本号必须是不同的；而且如果下架了 `test` 包，24小时内无法在上传这个包了！

### 2. 把1.0.0下架后，再发一个可以不？

不行，npm的规则不支持下架包，如果下架等于不再支持这个包的某个版本，甚至整个包，所以只能是向前推进的版本

## unpublish {% label danger @注意事项 %}
下架包，命令如下，下架某个包的某个版本，如果要下架整个包，后面的版本号可以删除

```sh
npm unpublish pkgName@version
```

### unpublish 报错怎么办

下架错误，多数是该包已经被其他包引用了，可以使用 过期标识符去把包标注过期，具体查看 [https://docs.npmjs.com/policies/unpublish](https://docs.npmjs.com/policies/unpublish)，命令如下，注意后面的message需要写上，过期的消息，但是这样只是让npm不显示过期的包版本而已，还是可以搜到的
```sh
npm deprecate pkgName@version "<message>"
```

### 怎么办？

把有关联的包去除关联后，publish上去，再来下架当前包

### 场景案例

1. 比如，有两个包，分别是 test1、test2

2. 其中 test1的 package.json如下，这样就是 test1引用了test2，将导致 test2无法下架
```json
"dependencies": {
  "test2": "^1.0.0",
}
```

3. 这个时候把 test1 关联test2的删除，然后把 test1 publish 一个上去，再下架掉 test1的其他有依赖到 test2的版本，那么test2将自动解除和test1的关联

4. 现在再次执行下面命令就可以成功下架 test2了

```sh
npm unpublish test2@1.0.0
```