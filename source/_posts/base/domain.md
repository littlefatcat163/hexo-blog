---
title: 域名
excerpt: domain
categories: [computer]
tags: [base, develop]
index_img: /img/base/url.jpg
# banner_img: /img/base/domain.jpg
date: 2023-04-26 17:43:48
---

## 域名

域名是网络上用于标识和定位计算机或者网络服务器的名称，通常是由一个或多个字母、数字和符号组成。

域名按照其 {% label success @从右向左 %} 的命名规则可以分为若干层级，每个层级之间使用一个“.”来进行分隔。一般来说，域名分为顶级域名（Top-Level Domain）、二级域名（Second-level Domain）和子域名（Subdomain）三个层级。

顶级域名是指在域名系统中处于最高层次的域名，例如.com、.cn、.org等。这些域名由国际域名注册机构（ICANN）管理。

二级域名是在顶级域名下面的第一层级的域名，例如example.com中的example就是二级域名。

子域名是在二级域名下一级的域名，例如test.example.com中的test就是子域名。

总的来说，域名的分级可以提供更好的组织管理，并方便用户记忆与使用。

## 子域名的使用

如果注册了一个二级域名，子域名通常也是可以使用的。

{% note success %}
如：注册了 `example.com`
那么可以通过 `www.example.com` 或者 `blog.example.com` 子域名来创建新的站点或应用程序，具体的子域名取决于DNS管理器和主机服务提供商。
{% endnote %}

## 配置域名

若要配置域名和子域名的DNS管理器，可以按照以下步骤操作：

登录DNS管理器，并进入域名管理页面。
1. 添加一条A记录，将主机记录设置为 @（表示根域名），将记录值设置为目标IP地址。这将使域名指向指定的服务器。
2. 添加一条CNAME记录，将主机记录设置为 www（表示www子域名），将记录值设置为根域名。这将使www子域名指向根域名。
3. 如果需要添加其他子域名，可以添加相应的CNAME记录或A记录，依照上述步骤进行操作。

需要注意的是，不同的DNS管理器可能操作方式有所不同，请根据具体的管理器类型和版本进行相应的配置。

## DNS

DNS是域名系统，它负责将网址转换成计算机可识别的IP地址。当你在浏览器中输入一个网址时，浏览器会首先查询本地DNS缓存，如果找不到就会向本地DNS服务器发出请求，本地DNS服务器再依次向根DNS服务器、顶级域名服务器、权威域名服务器查询，最终返回对应的IP地址给浏览器。

### 在浏览器中输入www.google.com
{% note success %}
1. 浏览器会首先查询自己的缓存，如果没有对应的IP地址，就会向本地DNS服务器发出请求。
2. 本地DNS服务器也会查询自己的缓存，如果没有就会向根DNS服务器发出请求，根DNS服务器返回给本地DNS服务器com域名服务器的IP地址，本地DNS服务器再向com域名服务器发出请求，com域名服务器返回给本地DNS服务器google.com域名服务器的IP地址，本地DNS服务器最后向google.com域名服务器发出请求，google.com域名服务器返回给本地DNS服务器 www.google.com 的IP地址，并将其保存到缓存中，最终本地DNS服务器将www.google.com的IP地址返回给浏览器。
3. 浏览器根据这个IP地址连接到Google的服务器上，从而访问到了Google的网站。
{% endnote %}