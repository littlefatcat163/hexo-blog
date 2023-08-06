---
title: commitizen
excerpt: commit message and change log
categories: [workflow]
tags: [git]
index_img: /img/git/git.webp
banner_img: /img/git/git.webp
date: 2023-08-06 09:50:24
---

> https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html
> https://github.com/commitizen/cz-cli

__Commitizen__ 是一个撰写 commit message 标准的工具。

## 全局安装

1. 安装 `commitizen` `cz-conventional-changelog`
```sh
npm install -g commitizen cz-conventional-changelog
```
2. 创建 ~/.czrc
```sh
echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc
```
3. 这个时候就可以使用 `git cz` 替换 `git commit`， `cz` 参数和`commit` 一样
### 注意
- 执行 `git cz` 出现下面错误，通常出现在 __window__
```sh
${username} contains invalid charset, expect utf8
```
请删除 `~/.czrc`，再用下面命令重新生成 `.czrc`
```sh
echo '{ "path": "cz-conventional-changelog" }' | Add-content -Encoding UTF8 -Path ~/.czrc
```

## commit message 标准

每次提交，commit message 都包含三个部分：
1. __Header__ （必需）
2. __Body__
3. __Footer__

```
<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```
{% note warning %}
不管是哪一部分，任何一行都不得超过72或100个字符。这是为了避免自动换行影响美观。
{% endnote %}

### Header
__Header__ 只有一行，包括三个字段：`type`（必需）、`scope`（可选）、`subject`（必需）

1. __type__ 用于 comiit 的 类别，只允许使用下面几种
{% note info %}
- feat: 新功能 feature
- fix: 修补bug
- improvement: 对当前功能的改进
- docs: 文档
- style: 格式（不影响代码运行的变动）
- refactor: 重构（既不是新增功能，也不是修改bug的代码变动）
- perf: 提高性能的修改
- test: 增加或修改测试代码
- build: 构建工具或者外部依赖包的修改
- ci: 持续集成的配置文件或脚本的修改
- chore: 其它杂项，补修改源代码与测试代码
- revert: 撤销某次提交
{% endnote %}

2. __scope__
用于说明影响的范围，比如数据层、控制层、视图层、组件等

3. __subject__
简短描述，不超过50个字符

{% note danger %}
- 以动词开头，使用第一人称现在时，比如 change，而不是 changed 或 changes
- 第一个字母小写
- 结尾不加句号
{% endnote %}

### Body
对subject的补充，可以分成多行，大概72个字符会换行，如下案例
```
More detailed explanatory text, if necessary.  Wrap it to 
about 72 characters or so. 

Further paragraphs come after blank lines.

- Bullet points are okay, too
- Use a hanging indent
```
{% note danger %}
- 以动词开头，使用第一人称现在时，如 change
- 第一个字母大写
- 说明代码变动的冬季，与以前行为的对比
{% endnote %}

### Footer
1. 关闭 issue
```
# 关闭一个issue
Closes #11

# 关闭多个issue
Closes #12, #13
```

2. 如果当前代码与上一个版本不兼容，则 __Footer__ 部分以 {% label danger @BREAKING CHANGE %} 开头，后面是对变动的描述，以及变动的理由和迁移方法。

```
BREAKING CHANGE: isolate scope bindings definition has changed.

    To migrate the code follow the example below:

    Before:

    scope: {
      myAttr: 'attribute',
    }

    After:

    scope: {
      myAttr: '@',
    }

    The removed `inject` wasn't generaly useful for directives so there should be no code using it.
```

## 特殊情况 Revert
当前 commit 用于撤销以前的commit， 必须以 {% label danger @revert: %} 开头，后面跟着被撤销的 Commit 的 Header，Body部分的格式是固定的，必须写成 {% label danger @This reverts commit <commitid> %}，如下案例

```
revert: feat(pencil): add 'graphiteWidth' option

This reverts commit 63c167e2700d337c10d8d75cfc687b4fcc349ddb
```
{% note warning %}
如果当前 commit 与被撤销的 commit，在同一个发布（release）里面，那么它们都不会出现在 Change log 里面。如果两者在不同的发布，那么当前 commit，会出现在 Change log 的Reverts小标题下面。
{% endnote %}