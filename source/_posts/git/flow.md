---
title: GitFlow
excerpt: 协同工作流，应对生产过程中各式各样的问题
categories: [workflow]
tags: [git]
index_img: /img/git/git.webp
banner_img: /img/git/git.webp
date: 2023-04-11 17:34:24
---

> https://www.ruanyifeng.com/blog/2015/12/git-workflow.html

在真实的生产过程中，前面的协同工作流还是不能满足工作的要求。这主要因为我们的生产过程是比较复杂的，软件生产中会有各式各样的问题，并要面对不同的环境。我们要在不停地开发新代码的同时，维护线上的代码，于是，就有了下面这些需求。

1. 希望有一个分支是非常干净的，上面是可以发布的代码，上面的改动永远都是可以发布到生产环境中的。这个分支上不能有中间开发过程中不可以上生产线的代码提交。

2. 希望当代码达到可以上线的状态时，也就是在 alpha/beta release 时，在测试和交付的过程中，依然可以开发下一个版本的代码。

3. 最后，对于已经发布的代码，也会有一些 Bug-fix 的改动，不会将正在开发的代码提交到生产线上去。

所以，GitFlow由此产生，核心思想如下图所示：
![gitflow](/img/git/gitflow.jpg)

## GitFlow

整个代码库有五种branch

- {% label info @Main %} 用于发布环境，上面的每一次commit都是可以发布的。
- {% label success @Feature %} 用于开发功能，对应开发环境。
- {% label primary @Develop %} 用于集成测试环境；功能开发完成，就向 {% label primary @Develop %} 合并，合并完成后，删除功能分支。
- {% label warning @Release %} 用于预发布环境；当 {% label primary @Develop %} 测试到达可以发布状态时，开出一个{% label warning @Release %}分支，然后做发布前的准备工作。为什么需要{% label warning @Release %}，因为开发可以继续向前，不会被发布限制commit。
> 当 {% label warning @Release %} 达到可以上线的状态，需要把 {% label warning @Release %} 向 {% label info @Main %} 和 {% label primary @Develop %} 同时合并，确保代码的一致性，然后再删掉{% label warning @Release %}。

- {% label danger @Hotfix %} 用于处理生产线上的 Bug-fix，每个线上 Bug-fix 都需要开一个{% label danger @Hotfix %}，完成后，向 {% label info @Main %} 和 {% label primary @Develop %} 合并，然后删除 {% label danger @Hotfix %}。

{% note success %}
从GitFlow流程中可以看到
1. 我们需要长期维护 {% label info @Main %} 和 {% label primary @Develop %} 两个分支。
2. 这其中的方式还是有一定复杂度的，尤其是 {% label warning @Release %} 和 {% label danger @Hotfix %} 分支需要同时向两个分支作合并。所以，如果没有一个好的工具来支撑的话，这会因为我们可能会忘了做一些操作而导致代码不一致。
3. GitFlow 协同虽然工作流比较重。但是它几乎可以应对所有公司的各种开发流程，包括瀑布模型，或是快速迭代模型。
{% endnote %}

## GitFlow Apply

{% label success @feature %}
{% label warning @release %}
{% label danger @bugfix %}
都属于临时需要，使用完毕后，应该即时删除

### a new feature

1. creating a feature branch from develop
```sh
 git checkout develop
 git chehckout -b feature-branch
```

2. finishing the feature branch
```sh
git checkout develop
git merge --no-ff feature-branch
git branch -d feature-branch
```

### release branches
{% label warning @release %}预发布分支，在发布到正式版（合入{% label info @main %}）之前，{% label warning @release %} 是从{% label primary @develop %}分出来，预发布结束后，需要合并进{% label primary @develop %} 和 {% label info @main %}

1. create a release branch from develop
```sh
git checkout develop
git checkout -b release-1.0.0
```

2. release branch merge to main
```sh
git checkout main
git merge --no-ff release-1.0.0
git tag 1.0.0

git checkout develop
git merge --no-ff release-1.0.0

git branch -d release-1.0.0
```

### bugfix

软件正式发布后，出现地bug，需要在从 {% label info @main %} 拉出分支，修补结束后，合并进{% label primary @develop %} 和 {% label info @main %}

1. create a bugfix branch from main
```sh
git checkout main
git checkout -b bugfix-1.0.1
```

2. bugfix branch merge to main and develop
```sh
git checkout main
git merge --no-ff bugfix-1.0.1
git tag 1.0.1

git checkout develop
git merge --no-ff bugfix-1.0.1

git branch -d bugfix-1.0.1
```

## GitHub Flow

Git Flow的简化版，专门作“持续发布”，如web的持续发布。

![GitHub Flow](/img/git/githubflow.jpg)

{% note primary %}
只有 {% label info @main %} 分支，要求保证高质量，对开发者要求很高。
1. 根据需求，从main拉出新分支，不区分功能或者补丁分支。
2. 新分支开发完成后，或者待完善，就可以向 {% label info @main %} 发起一个 `pull request` 。
3. 大家一起review代码，在这个过程中，还可以不断提交。
4. `pull request` 被接受，合并进 {% label info @main %}，删除原来的分支，重新部署。
{% endnote %}

如果发布有指定时间，那么会导致线上的版本落后于{% label info @main %}，这个时候就需要建一个 {% label success @production %} 来追踪线上版本。

## GitHub Forking Flow

{% note success %}
1. 每个开发人员都把“官方库”的代码 fork 到自己的代码仓库中。
2. 然后，开发人员在自己的代码仓库中做开发，想干啥干啥。
3. 因此，开发人员的代码库中，需要配两个远程仓库，一个是自己的库，一个是官方库（用户的库用于提交代码改动，官方库用于同步代码）。
4. 然后在本地建“功能分支”，在这个分支上做代码开发。
5. 这个功能分支被 push 到开发人员自己的代码仓库中。
6. 然后，向“官方库”发起 pull request，并做 Code Review。
7. 一旦通过，就向官方库进行合并。
{% endnote %}

## GitLab Flow

GitLab Flow 最大的原则“上游优先” `upstream first`，只存在一个主分支 {% label primary @master %}，它是所有分支的上游，只有上游采纳代码变化，才能应用到其他分支。

![GitLab Flow](/img/git/gitlabflow.jpg)

{% note info %}
对于“持续发布”的项目，它建议在 {% label primary @master %} 外，再建立不同的环境分支，如
- `master` 开发
- `pre-production` 预发布
- `production` 生产
代码的变化，必须由“上游”向“下游”发展，如生产环境出现了bug，这时需要新建功能分支，先合到 `master` ， 确认没问题，再 `cherry-pick` 到 `pre-production`, 到这一步也没有问题，才进入 `prodution`。
{% endnote %}

{% note danger %}
只有紧急情况，才允许跳过上游，直接合并到下游分支。
{% endnote %}

对于版本发布，每一个稳定版本，都要从master拉出一个分支。

![GitLab Flow](/img/git/gitlabstable.jpg)

对于“版本发布”的项目，建议的做法是每一个稳定版本，都要从  {% label primary @master %} 拉出一个分支，如 `2-3-stable` `2-4-stable` 等。

{% note danger %}
以后，只有修补bug，才允许将代码合并到这些分支，并且更新小版本号。
{% endnote %}

{% note success %}
实际应用：
1.  从{% label primary @master %}拉个人分支开发，`feature-name`
2. 开发完成，在迭代结束前，合入{% label primary @master %}
3. {% label primary @master %} 发布到 dev 环境
4. 测试通过后，从 {% label primary @master %} 拉出发布分支 {% label info @release-version %}
5. 有bug，在{% label info @release-version %}拉出分支修复，修复完成后再合入 {% label info @release-version %}
6. 正式发布版本，如果有bug，同5的操作
7. 等待发布版本稳定后，再将{% label info @release-version %} 合入 {% label primary @master %}
{% endnote %}

## Work Trick

### Pull Rquest

功能分支合进 {% label primary @master %}，必须通过 `Pull Request` 或 `Merge Request`

{% note warning %}
提pr的时候，可以在pr comment里面`@相关人员或团队`，引起他们注意。
{% endnote %}

### Protected branch

{% label primary @master %} 应该受保护，不是每个人都可以修改这个分支，以及拥有审批 `Pull Request` 的权限。

### Issue

Issue用于Bug追踪和需求管理，建议先建Issue，再建对应的功能分支，分支可以和Issue名字保持一致。

开发完成后，在提交说明里面，可以写上 `fix: #5` 或 `closes #10`，Github规定，只要 commit message里面有下面动词 + 编号，就会关闭对应的issue。

{% note success %}
- close
- closes
- closed
- fix
- fixes
- fixed
- resolve
- resolves
- resolved
{% endnote %}

### Merge

Git 有两种合并，一种是 Fast Forward， 不会单独的合并节点；另一种 none Fast Forward，会生成单独的节点。

Fast Forward 不利于保持 commit信息的清晰，也不利于以后的 rollback，常用 `merge --no-ff`，只要发生合并，就要有一个单独的合并节点。

### Squash mulitple commit

为了便于其他人阅读提交，还有 `cherry-pick` 或撤销代码变化，在发起 `Pull Request` 之前，应该把多个commit合并成一个，前提是这个分支只有我一个人开发，没有merge过，也没有push过。
参考 [rebase](/blog/2023/04/10/git/remote/#rebase-commit)
```sh
git rebase -i HEAD~n
```