---
title: 服务端
date: 2021-04-13 08:25:04
categories:
    - js
tags:
    - Node.js

---

> bilbil Node.js: https://www.bilibili.com/video/BV12y4y1Y793?p=8&spm_id_from=pageDriver

# 常见端口号

​	范围：1~65535，不使用1~199端口，这是预留给系统的，通常用4位，且不是1开头的。

- 21：FTP文件传输服务
- 22：SSH
- 23：TELNET终端仿真服务
- 25：SMTP简单邮件传输服务
- 53：DNS域名解析服务
- 80：HTTP超文本传输服务
- 110：POP3“邮局协议版本3”‘
- 443：HTTPS加密的超文本传输服务
- 1433：MS SQL * SERVER数据库默认端口
- 1521：Oracle数据库服务
- 1863：MSN Messenger的文件传输功能
- 3306：MYSQL默认端口
- 3389：Microsoft RDP 微软远程桌面端口
- 5631：Symantec pcAnywhere 远程控制数据传输时使用的端口
- 5632：Symatec pcAnywhere 主控端扫描被控制时使用的端口
- 5000：MS SQL SERVER使用的端口
- 27017：MongoDB默认端口

# http协议

​	超文本传输协议（属于应用层协议）

- 特点：无状态，现在cookie解决了无状态问题（早期网页开发时，用cookie解决，现在是cookie和session配合使用）
- 作用：规定了服务器和客户端传递信息的规则（统称为报文，分为请求报文和相应报文）
- 版本：
  - http 1.0 （老本版）—— 不支持长连接
  - http 1.1 （主流版本）—— 支持长连接，但是同时发送资源的数量过小（假设浏览器要加载100张图片，不是一次发出100个请求，而是分组进行，4-8个一组）
  - http 2.0 （最新版）—— 同时发送资源的数量稍微提升（8-12个一组）
- 报文：
  1. 报文首行
  2. 报文头
  3. 空行（仅仅作为一个分割）
  4. 报文体

# GET请求报文

## 报文首行

​	`GET http://localhost:3000/?name=xxx HTTP/1.1`—— 请求方式：协议名://主机地址:端口/?urlencode编码形式的参数 协议名/版本

## 报文头

​	`Host: localhost:3000`——发送请求的目标主机：主机名:端口号
​	`Conection: keep-alive` ——浏览器告诉服务器，浏览器支持长连接
​	`Pragma: no-cache` —— 不走缓存
​	`Cache-Control: no-cache` —— 不走缓存（强缓存）
​	`Upgrade-Insecure-Request: 1` —— 浏览器告诉服务器可以使用https或http1.1
​	`DNT: 1` —— 浏览器告诉服务器：1禁止跟踪。（值为0或者1，最终是否跟踪，还得看服务器是否配合）
​	`User-Agent：Mozilla/5.0 (windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML...)` —— 用户代理：之前该字段用于判断用户的浏览器品牌和版本，现在不好用了
​	`Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8...`——浏览器能够接受资源的类型及优先级，优先级不写默认是1，1的优先级最高
​	`Referer: http://localhost:3000/index.html`—— 本次请求是在哪个站点放出去的，可以用来处理防盗链和广告计费
​	`Accept-Encoding: gzip, deflate, br`——浏览器告诉服务器，浏览器能够接受的压缩文件类型
​	`Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7`——浏览器告诉服务器，浏览器所能支持的语言种类，及权重
​	`Cookie: as98d456asd6554as65d456a5sd4`——cookie

## GET请求没有报文体

## 防盗链

​	报文请求头 Referer参数有网页源地址，可以用来判断当前获取资源的是不是服务器允许加载的网址，如果不是，将禁用该资源的加载，*可以支持作广告计费*。

# POST请求报文

## 报文首行

​	`POST http://localhost:3000/?name=xxx HTTP/1.1`—— 请求方式：协议名://主机地址:端口/?urlencode编码形式的参数 协议名/版本

## 报文头

​	和上面GET类似，下面只列举不同的

​	`Origin: http://localhost:3000`—— 可以看做是精简版的referer
​	`Referer: http://localhost:3000/index.html`
​	`Content-Type: application/x-www-form-urlencoded`—— 表单提交的参数为`urlencoded`形式编码

## 报文体

​	`name=xxx`

# 响应报文

## 报文首行

​	`HTTP/1.1 200 OK`—— 协议版本 状态码

## 报文头

​	`X-Powered-By: Express`—— 服务器所采用的框架（尽量不要让用户知道服务器具体采用的技术）

```javascript
const app = express();
app.disable('x-powered-by'); // 禁止服务器返回X-Powered-By
```

​	`Content-Type: text/html; charset=utf-8` —— 告诉浏览器返回资源的类型和编码格式
​	`Content-Length: 2`—— 返回数据的长度
​	`ETag: W/"2-e0Xoasdiqiwdas+s"`—— 协商缓存必要字段
​	`Date: Fri, 01 Nov 2019 08:24:19 GMT`—— 响应的日期+时间
​	`Connection: keep-alive` —— 服务器告诉浏览器，下次请求时，或许会采用场链接

# http状态码

​	告诉客户端，当前客户端处理请求的结果

## http状态码分类

- 1xx：服务器已经收到了本次请求，但是还需要进一步处理
- 2xx：服务器已经收到了本次请求，且已经分析、处理等......最终处理完毕
- 3xx：服务器已经接受到了请求，还需要其他的资源，或重定向到其他位置，甚至交给其他服务器处理
- 4xx：一般指请求的参数或者地址有错误，出现了服务器无法理解的请求（前端的锅）
- 5xx：服务器内部错误（不是因为请求地址或者请求参数不当造成的），无法响应用户请求（后端的锅）

## 常见的状态码

- 200：成功（最理想的状态）
- 301：重定向，被请求的旧资源永久移除了（不可以访问了），将会跳转到一个新资源，搜索引擎在抓取新内容的同时也将旧的网址替换为重定向的网址
- 302：重定向，被请求的旧资源还在（仍然可以访问），但会临时跳转到一个新资源，搜索引擎会抓取新的内容而保存旧的地址
- 304：请求资源重定向到缓存中（命中了协商缓存）
- 404：资源未找到，一般是客户端请求了不存在的资源
- 500：服务器收到了请求，但是在服务器内部发生了错误
- 502：连接服务器失败（服务器在处理一个请求的时候，或许需要其他的服务器配合，但是联系不上其他的服务器了）
