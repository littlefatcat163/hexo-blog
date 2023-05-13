---
title: CORS
excerpt: 跨源资源共享 Cross-origin resource sharing
categories: 
    - [front-end]
    - [back-end]
    - [browser]
tags: 
    - develop
    - nodejs
    - javascript
index_img: /img/web.webp
# banner_img: /img/hexo.webp
date: 2023-05-11 20:32:01
---
> https://wangdoc.com/javascript/bom/cors

CORS:  __Cross-origin resource sharing__ “跨域资源共享”，它允许浏览器向跨源的服务器，发出XMLHttpRequest请求，从而克服了 AJAX 只能同源使用的限制。CORS 需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能。

{% note primary %}
整个 CORS 通信过程，都是浏览器自动完成，不需要用户参与。对于开发者来说，CORS 通信与普通的 AJAX 通信没有差别，代码完全一样。浏览器一旦发现 AJAX 请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感知。因此，实现 CORS 通信的关键是服务器。只要服务器实现了 CORS 接口，就可以跨源通信。
{% endnote %}

