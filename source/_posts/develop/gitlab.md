---
title: gitlab https ssl
excerpt: gitlab use https and add cert
categories: [workflow]
tags: [develop, ssl]
index_img: /img/gitlab.jpg
banner_img: /img/code.jpg
date: 2023-04-15 13:09:34
---

## 一、添加证书，开启https

`vim /etc/gitlab/gitlab.rb`

```sh
external_url "https://gitlab.example.com"
letsencrypt['enable'] = false
nginx['redirect_http_to_https'] = true
nginx['ssl_certificate'] = "/etc/gitlab/ssl/gitlab.example.com.crt"
nginx['ssl_certificate_key'] = "/etc/gitlab/ssl/gitlab.example.com.key"
```

重新读取配置
```sh
gitlab-ctl reconfigure
```

## 二、nginx开启https

`vim /var/opt/gitlab/nginx/conf/gitlab-http.conf`

```sh
server {
  listen *:443 ssl http2;
  server_name gitlab.example.com;
  ssl on;
  ssl_certificate /etc/gitlab/ssl/gitlab.example.com.crt;
  ssl_certificate_key /etc/gitlab/ssl/gitlab.example.com.key;
}
```

重启
```sh
gitlab-ctl restart
```