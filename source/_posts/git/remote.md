---
title: git remote
excerpt: remote origin branch
categories: [workflow]
tags: [git]
index_img: /img/git/git.webp
banner_img: /img/git/git.webp
date: 2023-04-10 01:23:35
mermaid: true
---

## repository command

### branch

- `git branch <branch>` create a new branch by currently branch
- `git branch [-a]` query branch, `-a` query all, include remote
- `git checkout <branch>` switch to branch
- `git checkout -` switch to the previous branch
- `git checkout -b <branch>` create a new branch, and switch to it
- `git branch -d <branch>` delete branch, unable to delete when branch has changes and not merge
- `git branch -D <branch>` delete branch no matter what

test scene
![branch-eg]( /img/git/branch-eg.webp)

### merge

```sh
git checkout dev
git merge master
```

三方merge，往前找到共同 parent-`C2`, 产生一个新地commit-`C7`，有两个parent，一个指向`C4`, 一个指向`C6`, 存在分叉

![branch-eg]( /img/git/merge-branch.webp)

### rebase branch
{% note success %}
the diff for rebase and merge
- `git merge` 不会修改commit record，存在分叉，有merge commit
- `git rebase` 修改commit record，保持简洁，无merge commit
{% endnote %}

```sh
git checkout dev
git rebase master
```
在master基础上，改变dev，dev原来的`C5` `C6`变成补丁的方式，重新commit在`C4`之后，修改了dev的commit历史，不存在分叉，也可以理解为在dev commit之前，把master最新的同步并插入了

![branch-eg]( /img/git/rebase-branch.webp)

### rebase commit
只 rebase local 且为push的commit

- `git rebase -i <commit>` 将HEAD ~ commit区间的commit合并
- `git rebase -i HEAD~n` 将HEAD最近的n次commit合并

{% note warning %}
pick：保留该commit（缩写:p）
reword：保留该commit，但我需要修改该commit的注释（缩写:r）
edit：保留该commit, 但我要停下来修改该提交(不仅仅修改注释)（缩写:e）
squash：将该commit和前一个commit合并（缩写:s）
fixup：将该commit和前一个commit合并，但我不要保留该提交的注释信息（缩写:f）
exec：执行shell命令（缩写:x）
drop：我要丢弃该commit（缩写:d）

修改完之后，可以按下ESC+Shift，再按两下Z退出
{% endnote %}

```sh
git commit -am "C7"
git commit -am "C8"
git commit -am "C9"
git rebase -i HEAD~3
```

![rebase-commit](/img/git/rebase-commit.webp)

### remote

- `git remote [-v]` query remote branch
- `git remote add origin <url>` add remote origin
- `git remote set-url origin <url>` modify the url of the remote origin
- `git remote show origin` show origin info

### push

- `git push [origin] [local-branch]:[remote-branch]` push local-branch to remote-branch, `local-branch` default is current branch, `remote-branch` default the same with `local-branch`
```sh
git push origin develop:develop

# -u push new-branch to remote new-branch, if origin hasn't new-branch
git push -u origin new-branch
```
- `git push --force origin` 强推
- `git push --set-upstream origin develop` remote create develop and mapping local develop
- `git push -f origin branch3:refs/branch1` use local branch3 over remote branch1
- `git push origin :refs/branch1` delete remote branch1
- `git push origin --tags` push commit and tags
- `git push origin <tag>` push the tag
- `git push origin :<tag>` delete remote tag

### pull

- `git fetch` fetch remote origin
- `git pull [origin] [remote-branch]:[local-branch]` pull remote-branch to local-branch === `git fetch` + `git merge`
always I use `--rebase` now === `git fecth & git rebase`, 
```sh
git pull origin develop:develop --rebase
```

![pull before](/img/git/pull-rebase-before.png)

![pull after](/img/git/pull-rebase-after.png)
git will fetch origin/master, then commit the changes on the local master branch one by one
