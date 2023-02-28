---
title: mongoDB
date: 2021-04-12 09:59:00
categories:
    - 数据库
tags:
    - Node.js



---

> bilbil Node.js: https://www.bilibili.com/video/BV12y4y1Y793?p=8&spm_id_from=pageDriver

# 数据库

​	按照数据结构来组织、存储和管理数据的仓库。持久化保存数据到硬盘中。

# 数据库的分类

- ## 关系型数据库

​	MySQL、Oracle、SQL Server，关系紧密，都是表。

- 优点：易于维护，sql格式一致，通用，可以用于多个表之间的关联查询
- 缺点：读写性能比较差，尤其是海量型数据的高效读写；有固定的表结构，字段不可以随意更改；高并发读写，硬盘I/O是一个瓶颈

## 非关系型数据库

​	MongoDB、Redis，关系不紧密，有文档，有键值对

- 优点：格式灵活，速度快，可以用内存作为载体，部署简单，**4.0后支持事务**
- 缺点：不支持sql，~~不支持事务~~，复杂查询繁琐

# MongoDB

​	MongoDB是为快速开发互联网Web应用而设计的数据库系统，极简、灵活、作为Web应用栈的一部分，数据模型是一种类似JSON的结构。

## 版本x.x.x

第二位数字是偶数为稳定版，奇数为开发版。

## 安装配置

1. 安装好之后，window配置path，路径为mongodb安装路径的bin目录，如`C:\Program Files\MongoDB\Server\5.0\bin`

2. 命令

   ```shell
   # 启动
   net start mongodb
   
   # 关闭
   net stop mongodb
   ```

3. mongodb启动后，终端输入`mongo`，进入`mongo shell`

   ```shell
   # 切换到admin
   use admin
   
   # 添加一个root帐号，超级管理员权限
   db.createUser({user: 'root', pws: '123456', roles: [{role: 'root', db: 'admin'}]})
   
   # 查看所有用户
   show users
   ```

4. 开启权限验证，进入mongodb安装路径下，如`C:\Program Files\MongoDB\Server\5.0\bin`，打开`mongod.cfg`，修改

   ```shell
   security:
   authorization: "enabled"
   ```

5. 重启mongo服务即可开启验证，**一定要开启权限用户验证登录**

## CRUD（增删改查）

- create:

  ```javascript
  // db.集合名.insert({})
  // db.集合名.insertOne({})
  // db.集合名.insertMany([])
  ```

- read:

  ```javascript
  // db.集合名.find[One](查询条件[, 投影])
  db.students.find({age: 18}); // 查询学生集合里面年龄为18的所有信息
  db.students.find({}, {age:1}); // 只查age字段，1要查，0不查， 除了_id能混合1和0使用，其它不要混合使用01
  
  // 操作符
  // <, <=, >, >=, !== 对应为 $lt, $lte, $gt, $gte, $ne
  db.students.find({age: {$gte: 20}}); // 年龄大于等于20
  // 或 $in/$or, 非 $nin
  db.students.find({age: {$in:[18, 20]}});
  db.students.find({$or: [{age:18},{age:20}});
                    
  // 正则匹配
  db.students.find({name: /^T/});
  
  // $where回调函数
  db.students.find({$where: function() {
      return this.name === 'a' && this.age === 18
  }});
  ```

- update:

  ```javascript
  // db.集合名.update(查询条件, 要更新的内容[, 配置对象])
  db.students.update({name: 'zhangsan'}, {age:19}); // 将替换掉整个文档zhangsan对象，除了_id不受影响
  
  db.students.update({name: 'zhangsan'}, {$set: {age:19}}); // 修改一个zhangsan的age为19
  db.students.update({name: 'zhangsan'}, {$set: {age:19}}, {multi: true}); // 修改所有zhangsan的age为19
  ```

- delete:

  ```javascript
  // db.集合名.remove(查询条件)
  // 删除所有年龄小于等于19的学生
  db.students.remove({age:{$lte:19}});
  ```

## mongoose-CRUD

- create：

  ```javascript
  // 模型对象.create(文档对象[, 回调函数])
  ```

- read：

  ```javascript
  // 模型对象.find(查询条件[, 投影]): 不管有没数据，都返回一个数组
  // 模型对象.findOne(查询条件[, 投影]): 找到返回对象，没找到返回null
  ```

- update：

  ```javascript
  // 模型对象.updateOne(查询条件, 要更新的内容[, 配置对象])
  // 模型对象.updateMany(查询条件, 要更新的内容[, 配置对象])
  ```

- delete：

  ```javascript
  // 模型对象.deleteOne(查询条件)
  // 模型对象.deleteMany(查询条件)
  ```

  以上方法如果没有指定回调函数，将返回一个`Promise`

# 索引

​	设置索引跟不设置索引有什么区别？索引能加快查询时间，如60万条数据，查询其中一条，将耗时500ms，那么6000万呢，5000ms；6亿呢？想都不敢想。增加索引后，查询的速度基本上保持一致，1ms左右，很快！那个字段经常查，就需要添加该字段索引。

```shell
# 创建索引
db.user.ensureIndex({"username":1})

# 获取当前索引
db.user.getIndexes()

# 删除索引
db.user.dropIndex({"username":1})
```

## 复合索引

​	`db.user.ensureIndex({"username":1,"age":-1})`：基于username和age的复合索引，因为username在前面，如果只查username，也能用到该索引；但是如果只是age查询，将不会用到该符合索引。username和age都有的情况下，跟顺序就没关系了，mongodb可以在检索之前，调整查询条件顺序。

​	随着集合数据的增大，需要针对查询中大量的排序做索引。如果没有对索引的键调用sort，mongodb需要将所有数据提取到内存并排序。因此在做无索引排序，如果数据量过大导致无法在内存中进行排序，mongodb将会报错。

## 唯一索引

​	类似数据库的主键，不重复