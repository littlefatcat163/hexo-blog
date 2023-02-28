---
title: api
date: 2022-02-06 20:09:45
categories:
    - js
tags:
    - Node.js


---

> https://www.ruanyifeng.com/blog/2014/05/restful_api.html

# 规范

```javascript
// api专用域名/版本号
https://api.example.com/v1/
```

## restful

每个网址代表一种资源，网址中不能有动词，只能有名词，而且名词往往和数据库的表名（集合）对应，名词使用复数

```javascript
https://api.example.com/v1/zoos
https://api.example.com/v1/animals
https://api.example.com/v1/employees
```



## http动词

常用

- `GET` 从服务器取出资源（一项或多项）
- `POST` 在服务器新建一个资源
- `PUT` 在服务器更新资源（客户端提供改变后的完整资源）
- `PATCH` 在服务器更新资源（客户端提供改变的部分属性）
- `DELETE` 从服务器删除资源

不常用

- HEAD 获取资源的元数据
- OPTIONS 获取信息，关于资源的哪些属性时客户端可以改变的

```
GET /zoos：列出所有动物园
POST /zoos：新建一个动物园
GET /zoos/ID：获取某个指定动物园的信息
PUT /zoos/ID：更新某个指定动物园的信息（提供该动物园的全部信息）
PATCH /zoos/ID：更新某个指定动物园的信息（提供该动物园的部分信息）
DELETE /zoos/ID：删除某个动物园
GET /zoos/ID/animals：列出某个指定动物园的所有动物
DELETE /zoos/ID/animals/ID：删除某个指定动物园的指定动物
```

## 状态码

> [完全状态码列表](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)

- `200 OK - [GET]`：服务器成功返回用户请求的数据，该操作是幂等的（Idempotent）。
- `201 CREATED - [POST/PUT/PATCH]`：用户新建或修改数据成功。
- `202 Accepted - [*]`：表示一个请求已经进入后台排队（异步任务）
- `204 NO CONTENT - [DELETE]`：用户删除数据成功。
- `400 INVALID REQUEST - [POST/PUT/PATCH]`：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的。
- `401 Unauthorized - [*]`：表示用户没有权限（令牌、用户名、密码错误）。
- `403 Forbidden - [*]`： 表示用户得到授权（与401错误相对），但是访问是被禁止的。
- `404 NOT FOUND - [*]`：用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。
- `406 Not Acceptable - [GET]`：用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）。
- `410 Gone -[GET]`：用户请求的资源被永久删除，且不会再得到的。
- `422 Unprocesable entity - [POST/PUT/PATCH]` 当创建一个对象时，发生一个验证错误。
- `500 INTERNAL SERVER ERROR - [*]`：服务器发生错误，用户将无法判断发出的请求是否成功。

## 错误处理

错误的对应的状态码，出错信息，error作为键名，出错信息作为键值

`{error: 'Invalid API key'}`

## 返回结果

- `GET /collection`：返回资源对象的列表（数组）
- `GET /collection/resource`：返回单个资源对象
- `POST /collection`：返回新生成的资源对象
- `PUT /collection/resource`：返回完整的资源对象
- `PATCH /collection/resource`：返回完整的资源对象
- `DELETE /collection/resource`：返回一个空文档

