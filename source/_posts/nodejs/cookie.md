---
title: cookie
date: 2021-04-15 12:51:50
categories:
    - js
tags:
    - Node.js



---

> bilbil Node.js: https://www.bilibili.com/video/BV12y4y1Y793?p=8&spm_id_from=pageDriver

# Cookie

​	本质上就是一个key-value形式的字符串，里面包含着浏览器和服务器沟通的信息（交互时产生的信息）；浏览器会自动携带该网站的所有cookie。

# 分类

- 会话cookie（关闭浏览器后，会话cookie会自动消失，会话cookie存储在浏览器运行的那块**内存**上）
- 持久化cookie（看过期时间，一旦过了过期时间，自动销毁，存储在用户的**硬盘**上；如果没到过期时间，用户清理了缓存，持久化cookie也会消失）

# 工作原理

1. 当浏览器第一次请求服务器的时候，服务器可能返回一个或多个cookie给浏览器
2. 浏览器判断cookie种类
   - 会话cookie：存储在浏览器运行的那块内存上
   - 持久化cookie：存储在用户的硬盘上
3. 以后浏览器请求该网站的时候，自动携带上该网站上的所有cookie（无法进行干预）
4. 服务器拿到之前自己“种”下cookie，分析里面的内容，校验cookie的合法性，根据cookie里保存的内容，进行具体的业务逻辑

# 应用

​	解决http无状态的问题（例子：7天免登陆，一般来说不会单独使用cookie，配合后台的session存储使用）

# 不同的语言、不同的后端架构cookie的具体语法是不一样的，但是cookie原理和工作过程是不变的

​	cookie不一定只由服务器生成，前端同样可以生成cookie，但是前端生成的cookie几乎没有意义

# cookie分段存储

# Cookie 的 Secure 和 HttpOnly 标记

安全的 `Cookie`需要经过 `HTTPS`协议通过加密的方式发送到服务器，即使是安全的，也不应该将敏感信息存储在`Cookie`中，因为`Cookie`本质上是不安全的，并且此标记不能提供真正的保护

> **HttpOnly的作用**
>
> - `HttpOnly`是微软对`Cookie`作的扩展，该值指定`Cookie`是否可通过客户端脚本访问
> - 如果在Cookie中没有设置`HttpOnly`属性为true，有可能导致`Cookie`被窃取用户信息，伪装用户进行跨站脚本攻击

# Cookie 的作用域

`Domain`和`Path`标识定义了`Cookie`的作用域：即`Cookie`应该发送给哪些`URL`

`Domain`标识指定了哪些主机可以接受`Cookie`，如果不指定，默认当前主机**（不包括子域名）**；如果指定了`Domain`，包含子域名。

```javascript
/**
	设置Domain=mozilla.org
	Cookie也包含在子域名, developer.mozilla.org
	
	设置Path=/docs  以下地址都会匹配
	/docs
    /docs/web/
    /docs/web/http
*/
```

