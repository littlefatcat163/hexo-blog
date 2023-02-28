---
title: 浏览器的功能
date: 2021-04-10 16:14:20
categories:
    - 前端
tags:
    - 浏览器
---

> bilbil 前端性能优化: https://www.bilibili.com/video/BV1ur4y1K76E?t=469&p=23

# 对浏览器内核的理解？

​	浏览器一个最重要的模块，主要把一切请求回来的资源可视化

​	主要分成两部分：`渲染引擎（layout engineer或 rendering engine）`和`js引擎`，最开始渲染引起和js引擎并没有区分得很明确，后来js引擎越来越独立，内核就倾向于渲染引擎。

​	`渲染引擎`负责取得网页的内容（HTML、XML、图像等）、整理讯息（例如加入CSS）以及计算网页的显示方式，然后会输出到显示器或打印机，内核不同，对网页的解释不同，渲染效果也不相同，所有网页浏览器、电子邮件客户端以及其它需要编辑、显示网络内容的应用程序都需要内核。

`js引擎`解析和执行`javascript`来实现网页的动态效果

# 常见的浏览器内核

| 浏览器  | 内核           | 备注                                                         |
| ------- | -------------- | ------------------------------------------------------------ |
| ie      | trident        | ie、猎豹安全、360极速浏览器、百度浏览器                      |
| firefox | gecko          | firefox这几年没落了，速度慢，升级频繁                        |
| safari  | webkit         | 从safari推出的时候开始，它的渲染引擎就是webkit               |
| chrome  | chromium/blink | webkit分支，内置于chrome浏览中，大部分国产浏览器最新版都采用blink内核 |
| opera   | blink          | 跟随chrome用blink内核                                        |

# 进程与线程

​	**进程**：内存中运行着的应用程序，占有一片独享的内存空间，进程与进程之间是隔离的。一个进程由多个线程组成。

​	**线程**：进程执行的最小单位，每一个线程都是独立的，相互之间也是隔离的。

## 浏览器到底有哪些进程？

1. Browser进程：浏览器的主进程，负责浏览器界面的显示，各个页面的管理，负责其他进程的创建和销毁，**只有一个**

2. Render进程：网页渲染进程，负责页面的渲染，可以有多个，渲染进程的数量不一定等于打开网页的个数

3. 网路进程

4. GPU进程

   移动设备的浏览器进程不一样，android不支持插件，没有插件进程；GPU演化成了Browser进程的一个线程；Render进程演化成了操作系统的一个服务进程，仍然是独立的。
   
5. 各个插件进程

​	每个进程内部有很多个线程，多线程的目的主要是保持用户界面的高速响应

# 计算机网路的七层模型

1. 物理层：使用物理介质（光纤、网线wifi）电信号
2. 数据链路层：MAC地址 封装byte
3. 网络层：IP协议
4. 传输层：UDP/TCP协议 端口
5. 回话层：断点续传
6. 表示层：翻译、解决不同系统之间数据传输问题
7. 应用层：HTTP协议

## UDP用户数据包协议

只管发，不管收，如DNS、微信电话、流媒体

## TCP传输控制协议

1. 重传机制
2. 排序机制（根据数据包的编号对数据进行排序，重组数据包，保证数据包的完整性和正确性）

## 四层模型（压缩七层模型）

1. 物理层 （数据链路层）
2. 网络层
3. 传输层
4. 应用层 （会话层、表示层、应用层）

# 浏览器访问开启本地文件权限

鼠标右击 chrome.exe，在目标后面添加`–enable-webgl --ignore-gpu-blacklist --allow-file-access-from-files`  如下：

```shell
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" –enable-webgl --ignore-gpu-blacklist --allow-file-access-from-files
```

# 从用户输入URL按下回车，直到页面的显示，期间经历了什么？

## 一、DNS解析（优先走缓存）

1. 找浏览器DNS缓存解析域名
2. 找本机DNS缓存（查看本机DNS缓存命令：`ipconfig/displaydns > c:/dns.txt`）
3. 找路由器DNS缓存
4. 找运营商DNS缓存（80%的DNS查找，到这一步结束）
5. 递归查找（全球13太DNS根服务器中的一个）

## 二、进行TCP（协议）连接，三次握手

1. 第一次握手：由浏览器发给服务器，我想和你说话，你能“听见”吗？
2. 第二次握手：由服务器发给浏览器，我能听得见，你说吧！
3. 第三次握手：由浏览器发给服务器，好，那我就开始说话。

## 三、发送请求（请求报文）

## 四、得到响应（响应报文）

## 五、浏览器开始解析html

1. 预解析：将所有的外部资源，发请求出去获取
2. 解析html：生成DOM树
3. 解析css：生成CSS树
4. 合并成一个render树
5. js是否操作了DOM或样式
   - 有：进行重绘重排（尽量避免，最小化重绘重排）
   - 没有：null
6. 展示页面

## 六、断开TCP连接，四次挥手（确保数据的完整性）

1. 第一次挥手：由浏览器发给服务器，我的东西接收完了，你关闭吧！
2. 第二次挥手：由服务器发给浏览器，我还有一些东西没接收（验证）完，你等一会，我处理好了告诉你；
3. 第三次挥手：由服务器发给浏览器，我接收（验证）完了，你断开吧！
4. 第四次挥手：由浏览器发给服务器，好的，我断开了。

## 为什么握手要三次，挥手要四次？

​	握手之前，还没有进行数据的传输，确保握手就行了。
​	挥手之前，正在进行数据的传输，为了确保数据的完整性，必须多经历一次验证（继续接收）。

# HTTP的请求流程

## 浏览器发送HTTP请求的流程

1. 构造请求行（请求方式、url、参数等）
2. 查找缓存（有缓存取缓存，没有就发送网络请求）
3. 准备IP地址和端口号
4. 等待TCP队列，一个域名最多只能建立6个TCP连接
5. 建立TCP连接
6. 发送HTTP请求

## 服务器处理HTTP请求

1. 返回请求内容
2. 断开连接

# 浏览器每次可以接收多少数据

64kb

# IE-Get请求有强缓存

​	请求的url如果没有变化，再次发起请求，将视为缓存记录

# 取消请求

​	`XMLHttpRequest().abort()`

# 跨域问题

​	浏览器为了安全，而采用的同源策略

## 同源策略

	1. 同源策略是由Netscape提出的一个著名的安全策略，现在所有支持JavaScript的浏览器都会使用这个策略
	2. Web是构建在同源策略基础之上的，浏览器只是针对同源策略的一种实现
	3. 所谓同源，也称为同域，是指——协议、域名(IP)，端口必须要完全相同

## 非同源收到哪些限制

- Cookie不能读取
- DOM无法获得
- Ajax请求不能获取数据

## get请求的限制

- form 不受同源策略的限制，因为form提交之后将跳转到提交地址
- ajax 收到同源策略限制
- 浏览器地址栏 不受限制
- img、link、script 标签能访问外部资源

# JSONP

​	json with padding利用script标签不受同源策略的限制，直接请求第三方进行跨域请求的特点，服务端response.body执行callback，只能解决get请求跨域问题，需要前后端人员配合使用。   **前端定义函数，后端“调用”**（服务器返回数据，浏览器js解析之后执行）

- Node.js服务端实现：

  ```javascript
  const Koa = require('koa');
  const app = new Koa();
  
  app.use(async ctx => {
      if(ctx.method === 'GET' && ctx.url.indexOf('?callback') === 1) {
          let callbackFun = ctx.query.callback || 'callback';
          let body = {
              msg: 'jsonp请求成功！'
          }
          ctx.type = 'text/javascript';
          ctx.body = `;${callbackFun}(${JSON.stringify(body)})`;
      } else {
          ctx.body = '测试!!!';
      }
  });
  
  app.on('error', err => {
      log.error('server error', err)
  });
  
  app.listen(3000, ()=> {
      console.info("node server start...")
  });
  ```

- 前端html实现：

  ```javascript
  function jsonp(res) {
      let script = document.createElement('script');
      let url = res.url + '?callback=' + res.callback.name;
      script.src = url;
      document.getElementsByTagName('head')[0].appendChild(script); 
  }
  
  function callbackFun(res) {
      console.log('msg', res && res['msg']);
  } 
  jsonp({
      url: 'otherUrl',
      data: { msg: 'val'},
      callback: callbackFun
  });
  ```