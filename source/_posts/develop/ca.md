---
title: 自建CA
excerpt: 开发环境，内测，局域网下自建CA，自己使用
categories: [workflow]
tags: [develop, ssl]
index_img: /img/code.jpg
# banner_img: /img/code.jpg
date: 2023-04-15 12:02:16
---

> - https://link.juejin.cn/?target=https%3A%2F%2Fwww.cnblogs.com%2Feven160941%2Fp%2F16068449.html
> - https://juejin.cn/post/6844904072856731662
> - https://link.juejin.cn/?target=https%3A%2F%2Fzeropointdevelopment.com%2Fhow-to-get-https-working-in-windows-10-localhost-dev-environment%2F
> - https://link.juejin.cn/?target=https%3A%2F%2Fmedium.com%2F%40tbusser%2Fcreating-a-browser-trusted-self-signed-ssl-certificate-2709ce43fd15

## 文件后缀对应的文件类型

|  格式   | 说明  |
|  ----  | ----  |
| .crt<br>.cer  | 证书 certificate |
| .key | 密钥/私钥 private key |
| .csr  | 证书认证签名请求 certificate signing request |
| .pem  | base64编码文本存储格式，可以单独放证书或者密钥，也可以同时存放证书和密钥 |


## 一、创建rootSSL
后续的证书都用root自建机构去认证

```sh
openssl genrsa -out rootSSL.key 2048
openssl req -x509 -new -nodes -key rootSSL.key -sha256 -days 1024 -out rootSSL.pem
```

## 二、把rootSSL机构导入到系统中，下面以window为例

1. `win` + `r` 执行 `MMC`, 点击`OK`运行
![run-mmc](/img/develop/ca/run-mmc.png)

2. Go to "File > Add/Remove Snap-in"
![snap-in](/img/develop/ca/snap-in.png)

3. Click "Certificates" and "Add"
![cert-add](/img/develop/ca/cert-add.png)

4. Select "Computer Account" and click "Next"
![comp-account](/img/develop/ca/comp-account.png)

5. Select "Local Computer" then click "Finish"
![local-comp-finish](/img/develop/ca/local-comp-finish.png)

6. Click "Ok" to go back to the MMC window
![mmc-ok-to-finish](/img/develop/ca/mmc-ok-to-finish.png)

7. Double-click "Certificates (local computer)" to expand the view
![mmc-expand](/img/develop/ca/mcc-expand.png)

8.  Select "Trusted Root Certification Authorities", right-click "Certificates" and select "All Tasks" then "Import"
![import-cert](/img/develop/ca/import-certificate-into-Trusted-Root-Certification-Authorities.jpg)

9. Click "Next" then Browse and locate the "rootSSL.pem" file
![import-wiz](/img/develop/ca/import-wiz.png)
![import-wiz2](/img/develop/ca/import-wiz-2.png)

10. Select "Place all certificates in the following store" and select the "Trusted Root Certification Authorities store". Click "Next" then click "Finish" to complete the wizard
![cert-store](/img/develop/ca/cert-store.png)

Browse the certificates to see yours in the list.
Now you can start issuing SSL certificates for all your local domains.
![cert-list](/img/develop/ca/cert-list.png)

## 三、给域名创建证书

1. create private key for `local.com`
```sh
openssl req -new -nodes -out local.com.csr -newkey rsa:2048 -keyout local.com.key
```

2. create `local.com.ext` file, full in the following
```ext
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = dev.local.com
DNS.2 = *.local.com
```

3. create and sign cert for `local.com`
```sh
openssl x509 -req -in local.com.csr -CA rootSSL.pem -CAkey rootSSL.key -CAcreateserial -out local.com.crt -days 1024 -sha256 -extfile local.com.ext
```

4. create pfx ready for IIS cert, need input your password in the process
```sh
winpty openssl pkcs12 -inkey local.com.key -in local.com.crt -export -out local.com.pfx
```

5. import `local.com.pfx` to MMC Follow 二

## 四、验证证书

1. open `c:\program files\windows\system32\drivers\etc\hosts` file and add
```host
127.0.0.1 dev.local.com
```

2. open `nginx.conf` add the cert
```conf
listen       443 ssl;
server_name  dev.local.com;
ssl_certificate      local.com.crt;
ssl_certificate_key  local.com.key;
```

3. open browser and input `https://dev.local.com` then can see ssl
![local.com](/img/develop/ca/local.com.jpg)