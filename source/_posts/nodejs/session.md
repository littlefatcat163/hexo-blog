---
title: session
date: 2021-04-15 16:44:11
categories:
    - js
tags:
    - Node.js




---

> bilbil Node.js: https://www.bilibili.com/video/BV12y4y1Y793?p=8&spm_id_from=pageDriver

# session

​	session将浏览器和服务器之间沟通产生的一些信息存储于服务端；默认session存储在服务器的内存中，每当一个新客户端发来请求，服务器都会开辟一块内存空间，供session会话存储使用。
​	有些cookie的过期时间是session，意味着该cookie是会话cookie。

# 工作流程

1. 第一次利库蓝旗请求服务器的时候，服务器会开辟出一块内存空间，供session会话存储使用
2. 返回响应的时候，会自动返回一个cookie（有时候返回多个，为了安全），cookie里包含着，上一步产生会话存储“容器”的编号（id）
3. 浏览器以后请求的时候，会自动携带着这个cookie给服务器
4. 服务器从该cookie中拿到对应的session的id，去服务器中匹配
5. 服务器会根据匹配信息，决定下一步逻辑

**cookie一定会配合session来使用，服务端会做session持久化，防止由于服务器重启，造成session的丢失**