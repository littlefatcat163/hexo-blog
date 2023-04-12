---
title: GitFlow
excerpt: 协同工作流，应对生产过程中各式各样的问题
categories: [workflow]
tags: [git]
index_img: /img/git/git.webp
banner_img: /img/git/git.webp
date: 2023-04-11 17:34:24
---

在真实的生产过程中，前面的协同工作流还是不能满足工作的要求。这主要因为我们的生产过程是比较复杂的，软件生产中会有各式各样的问题，并要面对不同的环境。我们要在不停地开发新代码的同时，维护线上的代码，于是，就有了下面这些需求。

1. 希望有一个分支是非常干净的，上面是可以发布的代码，上面的改动永远都是可以发布到生产环境中的。这个分支上不能有中间开发过程中不可以上生产线的代码提交。

2. 希望当代码达到可以上线的状态时，也就是在 alpha/beta release 时，在测试和交付的过程中，依然可以开发下一个版本的代码。

3. 最后，对于已经发布的代码，也会有一些 Bug-fix 的改动，不会将正在开发的代码提交到生产线上去。

所以，GitFlow由此产生，核心思想如下图所示：
![gitflow](/img/git/gitflow.png)

## GitFlow

整个代码库有五种branch

- {% label info @Master %} 用于发布环境，上面的每一次commit都是可以发布的。
- {% label success @Feature %} 用于开发功能，对应开发环境。
- {% label primary @Develop %} 用于集成测试环境；功能开发完成，就向 {% label primary @Develop %} 合并，合并完成后，删除功能分支。
- {% label warning @Release %} 用于预发布环境；当 {% label primary @Develop %} 测试到达可以发布状态时，开出一个{% label warning @Release %}分支，然后做发布前的准备工作。为什么需要{% label warning @Release %}，因为开发可以继续向前，不会被发布限制commit。
> 当 {% label warning @Release %} 达到可以上线的状态，需要把 {% label warning @Release %} 向 {% label info @Master %} 和 {% label primary @Develop %} 同时合并，确保代码的一致性，然后再删掉{% label warning @Release %}。

- {% label danger @Hotfix %} 用于处理生产线上的 Bug-fix，每个线上 Bug-fix 都需要开一个{% label danger @Hotfix %}，完成后，向 {% label info @Master %} 和 {% label primary @Develop %} 合并，然后删除 {% label danger @Hotfix %}。

{% note success %}
从GitFlow流程中可以看到
1. 我们需要长期维护 {% label info @Master %} 和 {% label primary @Develop %} 两个分支。
2. 这其中的方式还是有一定复杂度的，尤其是 {% label warning @Release %} 和 {% label danger @Hotfix %} 分支需要同时向两个分支作合并。所以，如果没有一个好的工具来支撑的话，这会因为我们可能会忘了做一些操作而导致代码不一致。
3. GitFlow 协同虽然工作流比较重。但是它几乎可以应对所有公司的各种开发流程，包括瀑布模型，或是快速迭代模型。
{% endnote %}

## GitFlow问题

1. 需要同时维护  {% label info @Master %} 和 {% label primary @Develop %}，整个开发过程会应为复杂，尤其时rollback的时候，加上来回切换分支，容易混淆。
2. 分支太多，所以会出现 git log 混乱的局面。具体来说，主要是 git-flow 使用`git merge --no-ff`来合并分支，在 git-flow 这样多个分支的环境下会让你的分支管理的 log 变得很难看。如下所示，左边是使用`–no-ff` 参数在多个分支下的问题。

![git flow log](/img/git/gitflowlog.png)

`--no-ff` no fast forward，merge不要把这两个分支的commit以前置合并的方式，而是留下一个merge的commit。

实际方法：只有{% label success @Feature %}合并到{% label primary @Develop %}时用`--no-ff`, 其他都不用


## GitHub Flow

Forking Flow

1. 每个开发人员都把“官方库”的代码 fork 到自己的代码仓库中。
2. 然后，开发人员在自己的代码仓库中做开发，想干啥干啥。
3. 因此，开发人员的代码库中，需要配两个远程仓库，一个是自己的库，一个是官方库（用户的库用于提交代码改动，官方库用于同步代码）。
4. 然后在本地建“功能分支”，在这个分支上做代码开发。
5. 这个功能分支被 push 到开发人员自己的代码仓库中。
6. 然后，向“官方库”发起 pull request，并做 Code Review。
7. 一旦通过，就向官方库进行合并。